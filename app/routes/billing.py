import os
import stripe
from fastapi import APIRouter, HTTPException, Depends, Request, Header
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.auth_service import get_current_user
from app.models.user import User

router = APIRouter(tags=["Billing"])

STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "sk_test_dummy")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "whsec_dummy")

stripe.api_key = STRIPE_SECRET_KEY
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

@router.post("/create-checkout-session")
def create_checkout_session(current_user: User = Depends(get_current_user)):
    # 99 INR = 9900 paise (Stripe works using smallest currency unit)
    
    # Check if mock local environment without real keys
    if STRIPE_SECRET_KEY == "sk_test_dummy":
        return {"url": f"{FRONTEND_URL}/documents?mock_success=true"}

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            customer_email=current_user.email,
            client_reference_id=str(current_user.id),
            line_items=[{
                'price_data': {
                    'currency': 'inr',
                    'product_data': {
                        'name': 'DocuAudit AI Premium Subscription',
                        'description': 'Unlimited audits and document processing.',
                    },
                    'unit_amount': 9900,  # 99 INR
                    'recurring': {
                        'interval': 'month'
                    }
                },
                'quantity': 1,
            }],
            mode='subscription',
            success_url=f"{FRONTEND_URL}/documents?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{FRONTEND_URL}/pricing?canceled=true",
        )
        return {"url": session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None), db: Session = Depends(get_db)):
    if STRIPE_SECRET_KEY == "sk_test_dummy":
        return {"status": "mock ignored"}

    payload = await request.body()
    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        user_id = session.get("client_reference_id")
        customer_id = session.get("customer")
        if user_id:
            user = db.query(User).filter(User.id == int(user_id)).first()
            if user:
                user.is_subscribed = True
                user.stripe_customer_id = customer_id
                db.commit()
    
    elif event['type'] == 'customer.subscription.deleted':
        subscription = event['data']['object']
        customer_id = subscription.get("customer")
        user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
        if user:
            user.is_subscribed = False
            db.commit()

    return {"status": "success"}

@router.post("/test-mock-success")
def mock_success(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Bypassing Stripe check for immediate "Pro" upgrade
    current_user.is_subscribed = True
    db.commit()
    return {"status": "upgraded to pro"}
