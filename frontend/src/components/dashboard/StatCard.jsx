import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function StatCard({ icon, title, value, trend, trendLabel, colorVar, index = 0 }) {
  const hasTrend = trend !== undefined && trend !== null;
  const isPositive = trend > 0;
  const isNeutral = trend === 0;

  // colorVar is expected to be like 'var(--accent)' or 'var(--success)'
  const color = `var(--${colorVar})`;
  const colorLight = `var(--${colorVar}-light)`;
  const colorBorder = `var(--${colorVar}-border)`;

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
        border: "1px solid var(--border)",
        background: "var(--bg-surface)",
        boxShadow: "var(--shadow-sm)",
        overflow: "hidden",
        cursor: "default",
        transition: "all 0.2s ease"
      }}
    >
      {/* Ambient background glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 80px 80px at top right, ${colorLight}, transparent)`,
        opacity: 0.5
      }} />

      {/* Top bar accent line */}
      <div style={{
        position: "absolute", top: 0, left: "28px", right: "28px", height: "1px",
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        opacity: 0.3
      }} />

      {/* Icon + label row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div style={{
          width: "40px", height: "40px", borderRadius: "12px",
          background: colorLight,
          border: `1px solid ${colorBorder}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: color,
        }}>
          {icon}
        </div>
        {hasTrend && (
          <div style={{
            display: "flex", alignItems: "center", gap: "4px",
            padding: "4px 10px", borderRadius: "20px",
            background: isNeutral ? "var(--bg-surface-hover)"
              : isPositive ? "var(--success-light)" : "var(--danger-light)",
            color: isNeutral ? "var(--text-muted)"
              : isPositive ? "var(--success)" : "var(--danger)",
            fontSize: "12px", fontWeight: "600", fontVariantNumeric: "tabular-nums",
            border: `1px solid ${isNeutral ? 'var(--border)' : isPositive ? 'var(--success-border)' : 'var(--danger-border)'}`
          }}>
            {isNeutral ? <Minus size={11} /> : isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {isPositive ? "+" : ""}{trend}
          </div>
        )}
      </div>

      {/* Value */}
      <div style={{
        fontSize: "36px", fontWeight: "800", color: "var(--text-primary)",
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
