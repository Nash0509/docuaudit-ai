const configs = {
  PASS: { bg: "var(--success-light)", color: "var(--success)", border: "var(--success-border)", dot: "var(--success)" },
  FAIL: { bg: "var(--danger-light)", color: "var(--danger)", border: "var(--danger-border)", dot: "var(--danger)" },
  WARN: { bg: "var(--warn-light)", color: "var(--warn)", border: "var(--warn-border)", dot: "var(--warn)" },
  INFO: { bg: "var(--info-light)", color: "var(--info)", border: "var(--info-border)", dot: "var(--info)" },
  CRITICAL: { bg: "var(--danger-light)", color: "var(--danger)", border: "var(--danger-border)", dot: "var(--danger)" },
  HIGH: { bg: "var(--danger-light)", color: "var(--danger)", border: "var(--danger-border)", dot: "var(--danger)" }, // Mapping HIGH to danger here to match existing theme
  MEDIUM: { bg: "var(--warn-light)", color: "var(--warn)", border: "var(--warn-border)", dot: "var(--warn)" },
  LOW: { bg: "var(--bg-surface-hover)", color: "var(--text-secondary)", border: "var(--border)", dot: "var(--text-muted)" },
  indexed: { bg: "var(--success-light)", color: "var(--success)", border: "var(--success-border)", dot: "var(--success)" },
  processing: { bg: "var(--warn-light)", color: "var(--warn)", border: "var(--warn-border)", dot: "var(--warn)" },
  pending: { bg: "var(--bg-surface-hover)", color: "var(--text-secondary)", border: "var(--border)", dot: "var(--text-muted)" },
};

export default function Badge({ text, dot = true, style = {} }) {
  const key = text?.toUpperCase() || "INFO";
  const cfg = configs[key] || configs[text?.toLowerCase()] || {
    bg: "var(--bg-surface-hover)",
    color: "var(--text-muted)",
    border: "var(--border)",
    dot: "var(--text-muted)",
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
