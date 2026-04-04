const configs = {
  PASS: { bg: "rgba(34, 197, 94, 0.1)", color: "#22c55e", border: "rgba(34, 197, 94, 0.2)", dot: "#22c55e" },
  FAIL: { bg: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "rgba(239, 68, 68, 0.2)", dot: "#ef4444" },
  WARN: { bg: "rgba(245, 158, 11, 0.1)", color: "#f59e0b", border: "rgba(245, 158, 11, 0.2)", dot: "#f59e0b" },
  INFO: { bg: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", border: "rgba(59, 130, 246, 0.2)", dot: "#3b82f6" },
  CRITICAL: { bg: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "rgba(239, 68, 68, 0.2)", dot: "#ef4444" },
  HIGH: { bg: "rgba(249, 115, 22, 0.1)", color: "#f97316", border: "rgba(249, 115, 22, 0.2)", dot: "#f97316" },
  MEDIUM: { bg: "rgba(245, 158, 11, 0.1)", color: "#f59e0b", border: "rgba(245, 158, 11, 0.2)", dot: "#f59e0b" },
  LOW: { bg: "rgba(100, 116, 139, 0.1)", color: "#94a3b8", border: "rgba(100, 116, 139, 0.2)", dot: "#94a3b8" },
  indexed: { bg: "rgba(34, 197, 94, 0.1)", color: "#22c55e", border: "rgba(34, 197, 94, 0.2)", dot: "#22c55e" },
  processing: { bg: "rgba(245, 158, 11, 0.1)", color: "#f59e0b", border: "rgba(245, 158, 11, 0.2)", dot: "#f59e0b" },
  pending: { bg: "rgba(100, 116, 139, 0.1)", color: "#94a3b8", border: "rgba(100, 116, 139, 0.2)", dot: "#64748b" },
};

export default function Badge({ text, dot = true, style = {} }) {
  const key = text?.toUpperCase() || "INFO";
  const cfg = configs[key] || configs[text?.toLowerCase()] || {
    bg: "rgba(255,255,255,0.05)",
    color: "#94a3b8",
    border: "rgba(255,255,255,0.08)",
    dot: "#94a3b8",
  };

  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      background: cfg.bg,
      color: cfg.color,
      border: `1px solid ${cfg.border}`,
      borderRadius: "var(--radius-xl)",
      padding: "3px 9px",
      fontSize: "11px",
      fontWeight: "600",
      letterSpacing: "0.02em",
      whiteSpace: "nowrap",
      ...style,
    }}>
      {dot && <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: cfg.dot, display: "inline-block", flexShrink: 0 }} />}
      {text}
    </span>
  );
}
