import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function StatCard({ icon, title, value, trend, trendLabel, color, index = 0 }) {
  const hasTrend = trend !== undefined && trend !== null;
  const isPositive = trend > 0;
  const isNeutral = trend === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      style={{
        position: "relative",
        padding: "28px",
        borderRadius: "18px",
        border: "1px solid rgba(255,255,255,0.07)",
        background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
        overflow: "hidden",
        cursor: "default",
      }}
    >
      {/* Ambient background glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 80px 80px at top right, ${color}20, transparent)`,
      }} />

      {/* Top bar accent line */}
      <div style={{
        position: "absolute", top: 0, left: "28px", right: "28px", height: "1px",
        background: `linear-gradient(90deg, transparent, ${color}60, transparent)`,
      }} />

      {/* Icon + label row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div style={{
          width: "40px", height: "40px", borderRadius: "12px",
          background: `${color}18`,
          border: `1px solid ${color}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: color,
        }}>
          {icon}
        </div>
        {hasTrend && (
          <div style={{
            display: "flex", alignItems: "center", gap: "4px",
            padding: "4px 10px", borderRadius: "20px",
            background: isNeutral ? "rgba(255,255,255,0.05)"
              : isPositive ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
            color: isNeutral ? "var(--text-muted)"
              : isPositive ? "var(--success)" : "var(--danger)",
            fontSize: "12px", fontWeight: "600", fontVariantNumeric: "tabular-nums",
          }}>
            {isNeutral ? <Minus size={11} /> : isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {isPositive ? "+" : ""}{trend}
          </div>
        )}
      </div>

      {/* Value */}
      <div style={{
        fontSize: "36px", fontWeight: "800", color: "#fff",
        letterSpacing: "-0.04em", lineHeight: 1, marginBottom: "6px",
        fontVariantNumeric: "tabular-nums",
      }}>
        {value}
      </div>

      {/* Label */}
      <div style={{ fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)" }}>
        {title}
      </div>
      {trendLabel && <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>{trendLabel}</div>}
    </motion.div>
  );
}
