import { Edit, Trash2, Tag, Layers, Lock } from "lucide-react";
import DropdownMenu from "../ui/DropdownMenu";

const SEVERITY_CFG = {
  HIGH: { bg: "var(--danger-light)", text: "var(--danger)", border: "var(--danger-border)" },
  MEDIUM: { bg: "var(--warn-light)", text: "var(--warn)", border: "var(--warn-border)" },
  LOW: { bg: "var(--bg-surface-hover)", text: "var(--text-secondary)", border: "var(--border)" },
};

export default function RuleCard({ rule, onEdit, onDelete, isSystem }) {
  const isTemplate = rule.is_template;
  const actions = [
    { label: "Edit Rule", icon: <Edit size={14} />, onClick: () => onEdit(rule) },
    { type: "divider" },
    { label: "Delete", icon: <Trash2 size={14} />, danger: true, onClick: () => onDelete(rule.id) },
  ];
  
  const sevCfg = SEVERITY_CFG[rule.severity] || SEVERITY_CFG.LOW;

  return (
    <div
      className="card"
      style={{ padding: 20, display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", position: "relative" }}
      onMouseEnter={(e) => {
        if (!isTemplate) {
          const menu = e.currentTarget.querySelector('.rule-actions');
          if (menu) menu.style.opacity = 1;
        }
      }}
      onMouseLeave={(e) => {
        if (!isTemplate) {
          const menu = e.currentTarget.querySelector('.rule-actions');
          if (menu) menu.style.opacity = 0;
        }
      }}
    >
      <div>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", margin: 0, lineHeight: 1.4 }}>{rule.name}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <span style={{ display: "inline-flex", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600, background: sevCfg.bg, color: sevCfg.text, border: `1px solid ${sevCfg.border}` }}>
              {rule.severity || "LOW"}
            </span>
          </div>
        </div>
        <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5, margin: "0 0 16px 0" }}>{rule.description}</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {isTemplate && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, color: "var(--text-muted)", background: "var(--bg-surface-hover)", padding: "2px 6px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <Lock size={9} /> System
            </span>
          )}
          {rule.category && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-muted)" }}>
              <Tag size={11} /> {rule.category}
            </span>
          )}
          {rule.industry && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-muted)" }}>
              <Layers size={11} /> {rule.industry}
            </span>
          )}
        </div>
        
        {!isTemplate && (
          <div className="rule-actions" style={{ opacity: 0, transition: "opacity 0.2s" }}>
            <DropdownMenu items={actions} />
          </div>
        )}
      </div>
    </div>
  );
}
