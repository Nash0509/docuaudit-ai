import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatsCard({ icon, title, value, colorVar = "accent", trend, trendLabel }) {
  const color = `var(--${colorVar})`;
  const colorLight = `var(--${colorVar}-light)`;
  const colorBorder = `var(--${colorVar}-border)`;

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
        boxShadow: "var(--shadow-sm)"
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
        background: colorLight,
        filter: "blur(20px)",
        pointerEvents: "none",
        opacity: 0.5
      }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <div style={{
          width: "38px",
          height: "38px",
          borderRadius: "10px",
          background: colorLight,
          border: `1px solid ${colorBorder}`,
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
            background: trend > 0 ? "var(--success-light)" : "var(--danger-light)",
            border: `1px solid ${trend > 0 ? "var(--success-border)" : "var(--danger-border)"}`,
            padding: "2px 7px",
            borderRadius: "20px",
            fontWeight: "600"
          }}>
            {trend > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {trend > 0 ? "+" : ""}{trend}%
          </div>
        )}
      </div>

      <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: "700", marginBottom: "6px" }}>
        {title}
      </div>
      <div style={{ fontSize: "30px", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1 }}>
        {value}
      </div>
      {trendLabel && (
        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px" }}>{trendLabel}</div>
      )}
    </motion.div>
  );
}
