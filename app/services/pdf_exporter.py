from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.enums import TA_LEFT, TA_CENTER
import io
from datetime import datetime

STATUS_COLORS = {
    "PASS": colors.HexColor("#16a34a"),
    "FAIL": colors.HexColor("#dc2626"),
    "WARN": colors.HexColor("#d97706"),
}

BG_DARK   = colors.HexColor("#0a0f1e")
BG_CARD   = colors.HexColor("#111827")
BG_MID    = colors.HexColor("#1e293b")
TEXT_MAIN = colors.HexColor("#e2e8f0")
TEXT_MUTED= colors.HexColor("#94a3b8")
ACCENT    = colors.HexColor("#00d4aa")

def generate_audit_pdf(report: dict) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=20*mm,
        leftMargin=20*mm,
        topMargin=20*mm,
        bottomMargin=20*mm,
    )

    styles = getSampleStyleSheet()

    style_title = ParagraphStyle(
        "title",
        fontSize=22,
        textColor=TEXT_MAIN,
        fontName="Helvetica-Bold",
        spaceAfter=4,
    )
    style_accent = ParagraphStyle(
        "accent",
        fontSize=13,
        textColor=ACCENT,
        fontName="Helvetica-Bold",
        spaceAfter=2,
    )
    style_label = ParagraphStyle(
        "label",
        fontSize=8,
        textColor=TEXT_MUTED,
        fontName="Helvetica",
        spaceAfter=2,
        leading=10,
    )
    style_body = ParagraphStyle(
        "body",
        fontSize=10,
        textColor=TEXT_MAIN,
        fontName="Helvetica",
        spaceAfter=4,
        leading=14,
    )
    style_muted = ParagraphStyle(
        "muted",
        fontSize=9,
        textColor=TEXT_MUTED,
        fontName="Helvetica-Oblique",
        spaceAfter=2,
        leading=12,
    )
    style_citation = ParagraphStyle(
        "citation",
        fontSize=9,
        textColor=colors.HexColor("#475569"),
        fontName="Helvetica-Oblique",
        leftIndent=10,
        leading=12,
    )

    elements = []

    # ── HEADER ──────────────────────────────────────────────
    elements.append(Paragraph("DocuAudit AI", style_title))
    elements.append(Paragraph("Contract Compliance Report", style_accent))
    elements.append(Spacer(1, 2*mm))
    elements.append(Paragraph(
        f"Document: {report['document']}  ·  Generated: {datetime.now().strftime('%d %b %Y, %H:%M')}",
        style_label
    ))
    elements.append(HRFlowable(width="100%", thickness=0.5, color=BG_MID, spaceAfter=6*mm))

    # ── SUMMARY CARDS ────────────────────────────────────────
    risk = report["risk_score"]
    risk_color = (
        colors.HexColor("#dc2626") if risk >= 70
        else colors.HexColor("#d97706") if risk >= 40
        else colors.HexColor("#16a34a")
    )

    summary = report["summary"]
    summary_data = [
        [
            Paragraph("RISK SCORE", style_label),
            Paragraph("PASSED", style_label),
            Paragraph("FAILED", style_label),
            Paragraph("WARNINGS", style_label),
        ],
        [
            Paragraph(f"{risk}/100", ParagraphStyle("rs", fontSize=20, fontName="Helvetica-Bold", textColor=risk_color)),
           Paragraph(f'{summary["passed"]}', ParagraphStyle("ps", fontSize=20, fontName="Helvetica-Bold", textColor=colors.HexColor("#16a34a"))),
Paragraph(f'{summary["failed"]}', ParagraphStyle("fs", fontSize=20, fontName="Helvetica-Bold", textColor=colors.HexColor("#dc2626"))),
Paragraph(f'{summary["warnings"]}', ParagraphStyle("ws", fontSize=20, fontName="Helvetica-Bold", textColor=colors.HexColor("#d97706"))),
        ],
    ]

    summary_table = Table(summary_data, colWidths=["25%","25%","25%","25%"])
    summary_table.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), BG_CARD),
        ("ROWBACKGROUNDS", (0,0), (-1,-1), [BG_CARD, BG_CARD]),
        ("BOX", (0,0), (-1,-1), 0.5, BG_MID),
        ("INNERGRID", (0,0), (-1,-1), 0.5, BG_MID),
        ("TOPPADDING", (0,0), (-1,-1), 8),
        ("BOTTOMPADDING", (0,0), (-1,-1), 8),
        ("LEFTPADDING", (0,0), (-1,-1), 12),
        ("RIGHTPADDING", (0,0), (-1,-1), 12),
    ]))
    elements.append(summary_table)
    elements.append(Spacer(1, 6*mm))

    # ── CLAUSE RESULTS ───────────────────────────────────────
    elements.append(Paragraph("CLAUSE-BY-CLAUSE FINDINGS", ParagraphStyle(
        "section", fontSize=9, textColor=TEXT_MUTED, fontName="Helvetica-Bold",
        charSpace=2, spaceAfter=4*mm
    )))

    for r in report["results"]:
        status = r["status"]
        sc = STATUS_COLORS.get(status, STATUS_COLORS["WARN"])

        status_label = Paragraph(
            f'<font color="white"> {status} </font>',
            ParagraphStyle("sl", fontSize=8, fontName="Helvetica-Bold",
                           backColor=sc, textColor=colors.white, leading=12)
        )

        rule_name = Paragraph(r["rule_name"], ParagraphStyle(
            "rn", fontSize=12, fontName="Helvetica-Bold", textColor=TEXT_MAIN, leading=14
        ))

        finding = Paragraph(r["finding"], style_muted)

        row_content = [[status_label, rule_name]]
        header_table = Table(row_content, colWidths=[18*mm, None])
        header_table.setStyle(TableStyle([
            ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
            ("LEFTPADDING", (0,0), (-1,-1), 0),
            ("RIGHTPADDING", (0,0), (-1,-1), 0),
            ("TOPPADDING", (0,0), (-1,-1), 0),
            ("BOTTOMPADDING", (0,0), (-1,-1), 4),
        ]))

        inner_elements = [header_table, finding]

        if r.get("citation") and r["citation"] != "Not found":
            inner_elements.append(
                Paragraph(f'"{r["citation"]}"', style_citation)
            )

        clause_table = Table([[inner_elements]], colWidths=["100%"])
        clause_table.setStyle(TableStyle([
            ("BACKGROUND", (0,0), (-1,-1), BG_CARD),
            ("BOX", (0,0), (-1,-1), 0.5, sc),
            ("LEFTPADDING", (0,0), (-1,-1), 12),
            ("RIGHTPADDING", (0,0), (-1,-1), 12),
            ("TOPPADDING", (0,0), (-1,-1), 10),
            ("BOTTOMPADDING", (0,0), (-1,-1), 10),
            ("LINEBEFORE", (0,0), (0,-1), 3, sc),
        ]))

        elements.append(clause_table)
        elements.append(Spacer(1, 3*mm))

    # ── FOOTER ───────────────────────────────────────────────
    elements.append(Spacer(1, 4*mm))
    elements.append(HRFlowable(width="100%", thickness=0.5, color=BG_MID))
    elements.append(Spacer(1, 2*mm))
    elements.append(Paragraph(
        "Generated by DocuAudit AI  ·  docuaudit.ai  ·  Confidential",
        ParagraphStyle("footer", fontSize=8, textColor=TEXT_MUTED,
                       fontName="Helvetica", alignment=TA_CENTER)
    ))

    doc.build(elements)
    buffer.seek(0)
    return buffer.read()