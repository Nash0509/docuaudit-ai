import { motion } from "framer-motion";

export default function ActivityItem({ icon, text, time, color = "var(--text-secondary)" }) {
  return (
    <motion.div
      whileHover={{ x: 4, background: "var(--bg-surface-hover)" }}
      transition={{ duration: 0.2 }}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "14px",
        padding: "16px",
        borderBottom: "1px solid var(--border)",
        cursor: "default",
        borderRadius: "var(--radius-md)",
      }}
    >
      <div style={{
        background: `${color}15`,
        color: color,
        padding: "8px",
        borderRadius: "10px",
        border: `1px solid ${color}25`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        {icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: "13px",
          color: "var(--text-primary)",
          fontWeight: "500",
          lineHeight: "1.4",
          marginBottom: "4px",
        }}>
          {text}
        </div>
        <div style={{
          fontSize: "11px",
          color: "var(--text-muted)",
          letterSpacing: "0.02em",
        }}>
          {time}
        </div>
      </div>
    </motion.div>
  );
}
