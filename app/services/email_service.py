import smtplib
import os
import threading
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.logger import logger

# Load SMTP config from environment
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM = os.getenv("SMTP_FROM", SMTP_USER)


def _build_html(title: str, message: str, type: str, action_label: str = None, action_url: str = None) -> str:
    """Build a clean, branded HTML email body."""
    type_styles = {
        "SUCCESS": {"color": "#00d4aa", "bg": "#00d4aa1a", "icon": "✅"},
        "WARNING": {"color": "#f59e0b", "bg": "#f59e0b1a", "icon": "⚠️"},
        "CRITICAL": {"color": "#ef4444", "bg": "#ef44441a", "icon": "🚨"},
        "INFO": {"color": "#60a5fa", "bg": "#60a5fa1a", "icon": "ℹ️"},
    }
    style = type_styles.get(type, type_styles["INFO"])

    action_html = ""
    if action_label and action_url:
        action_html = f"""
        <tr>
          <td style="padding: 24px 0 0 0; text-align: center;">
            <a href="{action_url}" style="background:{style['color']};color:#020617;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;display:inline-block;">
              {action_label}
            </a>
          </td>
        </tr>"""

    return f"""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>{title}</title>
</head>
<body style="margin:0;padding:0;background:#020617;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#020617;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#0f172a;border:1px solid rgba(255,255,255,0.06);border-radius:16px;overflow:hidden;max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#00d4aa15,#00d4aa05);padding:32px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:center;">
              <div style="font-size:13px;font-weight:700;color:#00d4aa;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:8px;">DocuAudit AI</div>
              <div style="font-size:22px;font-weight:700;color:#e2e8f0;letter-spacing:-0.02em;">{title}</div>
            </td>
          </tr>

          <!-- Badge -->
          <tr>
            <td style="padding:28px 32px 0 32px;">
              <div style="background:{style['bg']};border:1px solid {style['color']}33;border-radius:10px;padding:16px 20px;display:flex;align-items:center;gap:12px;">
                <span style="font-size:20px;">{style['icon']}</span>
                <span style="color:{style['color']};font-weight:600;font-size:14px;">{type}</span>
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 32px;">
              <p style="margin:0;color:#94a3b8;font-size:15px;line-height:1.7;">{message}</p>
            </td>
          </tr>

          {action_html}

          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px 32px 32px;border-top:1px solid rgba(255,255,255,0.06);margin-top:24px;">
              <p style="margin:0;color:#475569;font-size:12px;text-align:center;">
                You're receiving this because you're logged into <strong style="color:#64748b;">DocuAudit AI</strong>.<br/>
                This is an automated system notification.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""


def _send_smtp(to_email: str, subject: str, html_body: str):
    """Internal function that performs the actual SMTP send."""
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = SMTP_FROM
        msg["To"] = to_email

        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.ehlo()
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_USER, to_email, msg.as_string())

        logger.info(f"Email sent to {to_email}: {subject}")
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {str(e)}")


def send_email(
    to_email: str,
    subject: str,
    title: str,
    message: str,
    type: str = "INFO",
    action_label: str = None,
    action_url: str = None
):
    """
    Public entry point. Sends email in a background thread
    so it never blocks API responses.
    """
    if not SMTP_USER or not SMTP_PASSWORD:
        logger.warning("SMTP credentials not configured — skipping email.")
        return

    html_body = _build_html(title, message, type, action_label, action_url)
    thread = threading.Thread(
        target=_send_smtp,
        args=(to_email, subject, html_body),
        daemon=True
    )
    thread.start()
