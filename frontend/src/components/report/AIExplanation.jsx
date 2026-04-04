import { BrainCircuit } from "lucide-react";

export default function AIExplanation({ status, confidence, finding }) {
  const getStatusText = () => {
    if (status === "FAIL") return "Why this rule failed";
    if (status === "WARN") return "Investigate further";
    return "Why this rule passed";
  };

  const statusColor = status === "FAIL" ? "var(--danger)" : status === "WARN" ? "var(--warn)" : "var(--success)";
  const statusBg = status === "FAIL" ? "var(--danger-dim)" : status === "WARN" ? "var(--warn-dim)" : "var(--success-dim)";

  return (
    <div style={{
      background: "rgba(0, 212, 170, 0.03)",
      border: "1px solid var(--border-accent)",
      borderRadius: "var(--radius-md)",
      padding: "16px",
      marginTop: "8px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: statusColor, fontWeight: "600", fontSize: "13px" }}>
          <BrainCircuit size={16} />
          {getStatusText()}
        </div>
        <div style={{
          background: statusBg,
          border: `1px solid ${statusColor}33`,
          color: statusColor,
          padding: "3px 10px",
          borderRadius: "var(--radius-xl)",
          fontSize: "11px",
          fontWeight: "700",
          flexShrink: 0,
        }}>
          {confidence}% confidence
        </div>
      </div>
      
      <p style={{
        margin: 0,
        fontSize: "13.5px",
        color: "var(--text-secondary)",
        lineHeight: "1.7",
        borderLeft: "2px solid var(--border-accent)",
        paddingLeft: "14px",
      }}>
        {finding}
      </p>
    </div>
  );
}
