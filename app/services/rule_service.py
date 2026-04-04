from sqlalchemy.orm import Session
from app.models.rule import Rule

DEFAULT_TEMPLATES = [
    {
        "name": "Payment Terms",
        "description": "Contract must specify clear payment terms including due date or net days (e.g. Net 30).",
        "severity": "HIGH",
        "category": "Financial",
        "industry": "Small Business",
        "is_template": True
    },
    {
        "name": "Limitation of Liability",
        "description": "Contract must include a clause that caps the maximum liability of either party.",
        "severity": "CRITICAL",
        "category": "Risk",
        "industry": "Manufacturing",
        "is_template": True
    },
    {
        "name": "IP Ownership",
        "description": "Contract must clearly state who owns any intellectual property created during the engagement.",
        "severity": "HIGH",
        "category": "Intellectual Property",
        "industry": "Vendor agreements",
        "is_template": True
    },
    {
        "name": "Termination Notice",
        "description": "Contract must specify a notice period required to terminate the agreement (e.g. 30 days).",
        "severity": "MEDIUM",
        "category": "Operations",
        "industry": "Employment",
        "is_template": True
    },
    {
        "name": "Data Privacy Compliance",
        "description": "Contract must clearly state how customer data will be managed and protected.",
        "severity": "CRITICAL",
        "category": "Compliance",
        "industry": "SaaS contracts",
        "is_template": True
    }
]

def seed_default_rules(db: Session):
    existing_templates = db.query(Rule).filter(Rule.is_template == True).count()
    if existing_templates == 0:
        rules = [Rule(**template_data) for template_data in DEFAULT_TEMPLATES]
        db.add_all(rules)
        db.commit()

def get_merged_rules(db: Session, user_id: int):
    return db.query(Rule).filter(
        (Rule.is_template == True) | (Rule.user_id == user_id)
    ).all()