import secrets
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def _truncate_password(p: str) -> str:
    return p.encode('utf-8')[:72].decode('utf-8', 'ignore')

random_password = secrets.token_urlsafe(16)
print(f"Password: {random_password}, length: {len(random_password)}")
try:
    truncated = _truncate_password(random_password)
    h = pwd_context.hash(truncated)
    print("Success:", h)
except Exception as e:
    import traceback
    print("Error during normal hash:")
    traceback.print_exc()

long_password = "a" * 100
try:
    truncated = _truncate_password(long_password)
    print(f"Truncated length: {len(truncated)}")
    h = pwd_context.hash(truncated)
    print("Success with long:", h)
except Exception as e:
    import traceback
    print("Error during long hash:")
    traceback.print_exc()
