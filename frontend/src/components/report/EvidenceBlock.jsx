import { Quote } from "lucide-react";

export default function EvidenceBlock({ citation }) {
  if (!citation || citation === "Not found") {
    return (
      <div style={{
        color: "var(--text-muted)",
        fontStyle: "italic",
        fontSize: "13px",
        background: "var(--bg-surface-hover)",
        border: "1px dashed var(--border)",
        borderRadius: "var(--radius-md)",
        padding: "16px",
        marginTop: "8px",
        textAlign: "center"
      }}>
        No direct clause evidence found in this document.
      </div>
    );
  }

  return (
    <div style={{
      background: "var(--info-light)",
      border: "1px solid var(--info-border)",
      borderRadius: "var(--radius-md)",
      padding: "16px 16px 16px 20px",
      position: "relative",
      marginTop: "8px",
      borderLeft: "3px solid var(--info)",
    }}>
      <Quote size={14} color="var(--info)" style={{ position: "absolute", top: "12px", right: "14px", opacity: 0.2 }} />
      <div style={{
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        fontSize: "12.5px",
        color: "var(--text-secondary)",
        lineHeight: "1.7",
        maxHeight: "220px",
        overflowY: "auto",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        paddingRight: "10px"
      }}>
        {citation}
      </div>
    </div>
  );
}
