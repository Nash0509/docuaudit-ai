import requests
import io
from reportlab.pdfgen import canvas

BASE_URL = "https://docuaudit-ai.onrender.com/api"

print("Logging in as guest...")
res = requests.post(f"{BASE_URL}/auth/guest-login")
if not res.ok:
    print("Login failed:", res.status_code, res.text)
    exit(1)

token = res.json()["access_token"]
print("Logged in successfully.")

print("Creating dummy PDF...")
pdf_buffer = io.BytesIO()
c = canvas.Canvas(pdf_buffer)
c.drawString(100, 100, "Hello World")
c.showPage()
c.save()
pdf_buffer.seek(0)

print("Uploading document...")
headers = {"Authorization": f"Bearer {token}"}
files = {"file": ("test_doc.pdf", pdf_buffer, "application/pdf")}
res = requests.post(f"{BASE_URL}/documents/upload", headers=headers, files=files)

print("Upload Status:", res.status_code)
print("Upload Response:", res.text)
