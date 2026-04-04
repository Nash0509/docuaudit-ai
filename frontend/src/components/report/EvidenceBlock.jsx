import { Quote } from "lucide-react";

export default function EvidenceBlock({ citation }) {
  if (!citation || citation === "Not found") {
    return (
      <div style={{
        color: "var(--text-muted)",
        fontStyle: "italic",
        fontSize: "13px",
        background: "var(--bg-surface)",
        border: "1px dashed var(--border)",
        borderRadius: "var(--radius-md)",
        padding: "14px 16px",
        marginTop: "8px",
      }}>
        No direct clause evidence found in this document.
      </div>
    );
  }

  return (
    <div style={{
      background: "rgba(59, 130, 246, 0.04)",
      border: "1px solid rgba(59, 130, 246, 0.15)",
      borderRadius: "var(--radius-md)",
      padding: "16px 16px 16px 20px",
      position: "relative",
      marginTop: "8px",
      borderLeft: "3px solid #3b82f6",
    }}>
      <Quote size={14} color="rgba(59, 130, 246, 0.3)" style={{ position: "absolute", top: "12px", right: "14px" }} />
      <div style={{
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        fontSize: "12.5px",
        color: "var(--text-secondary)",
        lineHeight: "1.7",
        maxHeight: "200px",
        overflowY: "auto",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}>
        {citation}
      </div>
    </div>
  );
}
