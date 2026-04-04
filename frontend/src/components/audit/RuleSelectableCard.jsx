import { CheckCircle2, Circle, Tag, Layers } from "lucide-react";
import Badge from "../ui/Badge";
import { motion } from "framer-motion";

export default function RuleSelectableCard({ rule, isSelected, onToggle }) {
  return (
    <motion.div
      onClick={() => onToggle(rule.id)}
      whileHover={{ x: 2 }}
      transition={{ duration: 0.15 }}
      style={{
        background: isSelected ? "rgba(0, 212, 170, 0.06)" : "var(--bg-surface)",
        border: `1px solid ${isSelected ? "var(--border-accent)" : "var(--border)"}`,
        borderRadius: "var(--radius-md)",
        padding: "14px 16px",
        display: "flex",
        gap: "14px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: isSelected ? "var(--shadow-glow)" : "none",
      }}
    >
      {/* Checkbox icon */}
      <div style={{ marginTop: "2px", flexShrink: 0 }}>
        {isSelected ? (
          <CheckCircle2 color="var(--accent)" size={18} />
        ) : (
          <Circle color="var(--text-muted)" size={18} />
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px", minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
          <h4 style={{
            margin: 0,
            fontSize: "14px",
            fontWeight: "600",
            color: isSelected ? "var(--text-primary)" : "var(--text-secondary)",
            transition: "color 0.2s",
          }}>
            {rule.name}
          </h4>
          <Badge text={rule.severity || "LOW"} dot={false} style={{ flexShrink: 0 }} />
        </div>

        <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.5" }}>
          {rule.description}
        </p>

        <div style={{ display: "flex", gap: "10px", marginTop: "2px", flexWrap: "wrap" }}>
          {rule.category && (
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--text-muted)", fontWeight: "500" }}>
              <Tag size={11} /> {rule.category}
            </span>
          )}
          {rule.industry && (
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--text-muted)", fontWeight: "500" }}>
              <Layers size={11} /> {rule.industry}
            </span>
          )}
          <span style={{
            fontSize: "11px",
            color: isSelected ? "var(--accent)" : "var(--text-muted)",
            marginLeft: "auto",
            fontWeight: "600",
            transition: "color 0.2s",
          }}>
            {rule.is_template ? (rule.industry ? "Industry" : "System") : "Custom"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
