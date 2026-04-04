import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export default function StatsCard({ icon, title, value, color = "var(--accent)", trend, trendLabel }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "22px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div style={{
        position: "absolute",
        top: "-20px",
        right: "-20px",
        width: "100px",
        height: "100px",
        borderRadius: "50%",
        background: `${color}10`,
        filter: "blur(20px)",
        pointerEvents: "none",
      }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <div style={{
          width: "38px",
          height: "38px",
          borderRadius: "10px",
          background: `${color}15`,
          border: `1px solid ${color}25`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: color,
        }}>
          {icon}
        </div>

        {trend && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "11px",
            color: trend > 0 ? "var(--success)" : "var(--danger)",
            background: trend > 0 ? "var(--success-dim)" : "var(--danger-dim)",
            padding: "2px 7px",
            borderRadius: "20px",
          }}>
            <TrendingUp size={10} />
            {trend > 0 ? "+" : ""}{trend}%
          </div>
        )}
      </div>

      <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: "500", marginBottom: "6px" }}>
        {title}
      </div>
      <div style={{ fontSize: "30px", fontWeight: "700", color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1 }}>
        {value}
      </div>
      {trendLabel && (
        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>{trendLabel}</div>
      )}
    </motion.div>
  );
}
