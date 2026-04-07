import { motion } from "framer-motion";

const tiers = [
  { label: "Low Risk", key: "low", color: "#22c55e", glow: "rgba(34,197,94,0.15)" },
  { label: "Medium Risk", key: "medium", color: "#f59e0b", glow: "rgba(245,158,11,0.15)" },
  { label: "High Risk", key: "high", color: "#ef4444", glow: "rgba(239,68,68,0.15)" },
];

export default function RiskPanel({ data }) {
  const total = Math.max((data.low || 0) + (data.medium || 0) + (data.high || 0), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {tiers.map(({ label, key, color, glow }, i) => {
        const count = data[key] || 0;
        const pct = Math.round((count / total) * 100);

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", flexDirection: "column", gap: "6px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: color, boxShadow: `0 0 8px ${color}80`
                }} />
                <span style={{ fontSize: "12px", fontWeight: "500", color: "var(--text-secondary)" }}>{label}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)" }}>{count}</span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", width: "32px", textAlign: "right" }}>{pct}%</span>
              </div>
            </div>
            {/* Track */}
            <div style={{
              height: "5px", borderRadius: "3px",
              background: "rgba(255,255,255,0.05)",
              overflow: "hidden",
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  height: "100%", borderRadius: "3px",
                  background: `linear-gradient(90deg, ${color}, ${color}aa)`,
                  boxShadow: `0 0 10px ${color}60`,
                }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
