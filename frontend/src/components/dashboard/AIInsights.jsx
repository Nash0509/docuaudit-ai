import { motion } from "framer-motion";
import { AlertTriangle, ShieldAlert, TrendingUp, FileX } from "lucide-react";

const INSIGHT_CONFIGS = [
  { 
    match: r => r.risk_score >= 70, 
    colorVar: "danger", 
    icon: AlertTriangle,
    message: (count) => `${count} high-risk contract${count !== 1 ? 's' : ''} require immediate legal review.` 
  },
  { 
    match: r => r.risk_score >= 40 && r.risk_score < 70, 
    colorVar: "warn", 
    icon: ShieldAlert,
    message: (count) => `${count} contract${count !== 1 ? 's' : ''} flagged with moderate compliance warnings.` 
  },
  { 
    match: () => true, 
    colorVar: "success", 
    icon: TrendingUp,
    message: (count, reports) => `AI processed ${count} audit${count !== 1 ? 's' : ''} with ${reports.reduce((a, r) => a + (r.rules_checked || 0), 0)} rule evaluations.` 
  },
];

export default function AIInsights({ reports = [] }) {
  if (reports.length === 0) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "32px 0", gap: "10px", color: "var(--text-muted)", textAlign: "center"
      }}>
        <FileX size={24} strokeWidth={1.5} />
        <span style={{ fontSize: "13px", lineHeight: 1.6 }}>No audits found.<br />Upload and run your first audit to see insights.</span>
      </div>
    );
  }

  const insights = [
    { ...INSIGHT_CONFIGS[0], count: reports.filter(INSIGHT_CONFIGS[0].match).length },
    { ...INSIGHT_CONFIGS[1], count: reports.filter(INSIGHT_CONFIGS[1].match).length },
    { ...INSIGHT_CONFIGS[2], count: reports.length },
  ].filter(i => i.count > 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {insights.map(({ colorVar, icon: Icon, message, count }, i) => {
        const color = `var(--${colorVar})`;
        const colorLight = `var(--${colorVar}-light)`;
        const colorBorder = `var(--${colorVar}-border)`;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.35 }}
            style={{
              display: "flex", alignItems: "flex-start", gap: "12px",
              padding: "14px 16px", borderRadius: "12px",
              background: colorLight,
              border: `1px solid ${colorBorder}`,
            }}
          >
            <div style={{
              width: "28px", height: "28px", borderRadius: "8px", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "var(--bg-surface)", 
              border: `1px solid ${colorBorder}`,
              color: color,
            }}>
              <Icon size={14} />
            </div>
            <div>
              <span style={{ fontSize: "13px", color: "var(--text-primary)", fontWeight: "500", lineHeight: 1.5 }}>
                {message(count, reports)}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
