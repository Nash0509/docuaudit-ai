import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { UploadCloud, Activity, ShieldPlus, FileText, ArrowRight } from "lucide-react";

const ACTIONS = [
  { label: "Upload Document", description: "Add a new contract", icon: UploadCloud, path: "/documents", colorVar: "info" },
  { label: "Run Audit", description: "Start a compliance check", icon: Activity, path: "/documents", colorVar: "warn" },
  { label: "Create Rule", description: "Define a new check", icon: ShieldPlus, path: "/rules", colorVar: "success" },
  { label: "View Reports", description: "Review audit results", icon: FileText, path: "/reports", colorVar: "accent" },
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {ACTIONS.map(({ label, description, icon: Icon, path, colorVar }, i) => {
        const color = `var(--${colorVar})`;
        const colorLight = `var(--${colorVar}-light)`;
        const colorBorder = `var(--${colorVar}-border)`;

        return (
          <motion.button
            key={label}
            onClick={() => navigate(path)}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ x: 4 }}
            style={{
              display: "flex", alignItems: "center", gap: "14px",
              padding: "14px 16px", borderRadius: "12px",
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              cursor: "pointer", textAlign: "left", width: "100%",
              transition: "border-color 0.2s, background 0.2s",
              boxShadow: "var(--shadow-sm)"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = color;
              e.currentTarget.style.background = "var(--bg-surface-hover)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.background = "var(--bg-surface)";
            }}
          >
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
              background: colorLight, border: `1px solid ${colorBorder}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: color, transition: "box-shadow 0.2s",
            }}>
              <Icon size={16} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)" }}>{label}</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "1px" }}>{description}</div>
            </div>
            <ArrowRight size={14} color="var(--text-muted)" />
          </motion.button>
        );
      })}
    </div>
  );
}
