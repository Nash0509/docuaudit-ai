import { motion } from "framer-motion";

const variants = {
  primary: {
    background: "var(--accent)",
    color: "#fff",
    border: "none",
    fontWeight: "600",
    boxShadow: "0 2px 8px var(--accent-light)",
  },
  secondary: {
    background: "var(--bg-surface)",
    color: "var(--text-primary)",
    border: "1px solid var(--border)",
    fontWeight: "500",
    boxShadow: "none",
  },
  ghost: {
    background: "transparent",
    color: "var(--text-secondary)",
    border: "1px solid transparent",
    fontWeight: "500",
    boxShadow: "none",
  },
  danger: {
    background: "var(--danger-light)",
    color: "var(--danger)",
    border: "1px solid var(--danger-border)",
    fontWeight: "500",
    boxShadow: "none",
  },
  accent: {
    background: "var(--info-light)",
    color: "var(--info)",
    border: "1px solid var(--info-border)",
    fontWeight: "500",
    boxShadow: "none",
  },
};

export default function Button({
  children,
  variant = "secondary",
  size = "md",
  onClick,
  disabled = false,
  loading = false,
  icon,
  style = {},
  type = "button",
}) {
  const v = variants[variant] || variants.secondary;

  const sizes = {
    sm: { padding: "6px 12px", fontSize: "12px", height: "30px" },
    md: { padding: "8px 16px", fontSize: "13px", height: "36px" },
    lg: { padding: "10px 20px", fontSize: "14px", height: "42px" },
  };

  const s = sizes[size] || sizes.md;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      transition={{ duration: 0.15 }}
      style={{
        ...v,
        ...s,
        borderRadius: "var(--radius-md)",
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        fontFamily: "inherit",
        transition: "background 0.2s, box-shadow 0.2s",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {loading ? (
        <span style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          border: "2px solid currentColor",
          borderTopColor: "transparent",
          animation: "spin 0.6s linear infinite",
          display: "inline-block",
        }} />
      ) : icon}
      {children}
    </motion.button>
  );
}
