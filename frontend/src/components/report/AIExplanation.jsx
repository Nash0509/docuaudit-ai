import { BrainCircuit } from "lucide-react";

export default function AIExplanation({ status, confidence, finding }) {
  const getStatusText = () => {
    if (status === "FAIL") return "Why this rule failed";
    if (status === "WARN") return "Investigate further";
    return "Why this rule passed";
  };

  const statusColor = status === "FAIL" ? "var(--danger)" : status === "WARN" ? "var(--warn)" : "var(--success)";
  const statusLight = status === "FAIL" ? "var(--danger-light)" : status === "WARN" ? "var(--warn-light)" : "var(--success-light)";
  const statusBorder = status === "FAIL" ? "var(--danger-border)" : status === "WARN" ? "var(--warn-border)" : "var(--success-border)";

  return (
    <div style={{
      background: "var(--bg-surface-hover)",
      border: `1px solid var(--border)`,
      borderRadius: "var(--radius-md)",
      padding: "16px",
      marginTop: "8px",
      boxShadow: "var(--shadow-sm)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: statusColor, fontWeight: "600", fontSize: "14px" }}>
          <BrainCircuit size={17} />
          {getStatusText()}
        </div>
        <div style={{
          background: statusLight,
          border: `1px solid ${statusBorder}`,
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
        borderLeft: `2px solid ${statusColor}`,
        paddingLeft: "16px",
        marginLeft: "4px"
      }}>
        {finding}
      </p>
    </div>
  );
}
