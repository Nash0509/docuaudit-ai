import { Edit, Trash2, Tag, Layers, Lock, MoreVertical } from "lucide-react";
import Badge from "../ui/Badge";
import Card from "../ui/Card";
import DropdownMenu from "../ui/DropdownMenu";
import { useState } from "react";

export default function RuleCard({ rule, onEdit, onDelete, isSystem }) {
  const [isHovered, setIsHovered] = useState(false);
  const isTemplate = rule.is_template;

  const actions = [
    { label: "Edit Rule", icon: <Edit size={14} />, onClick: () => onEdit(rule) },
    { type: "divider" },
    { label: "Delete Rule", icon: <Trash2 size={14} />, danger: true, onClick: () => onDelete(rule.id) }
  ];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card hover={true} style={{ display: "flex", flexDirection: "column", padding: "20px", height: "100%" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "12px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-primary)", margin: 0, lineHeight: 1.4 }}>
            {rule.name}
          </h3>
          
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Badge text={rule.severity || "LOW"} />
            {!isTemplate && (
              <div style={{ opacity: isHovered ? 1 : 0, transition: "opacity var(--ease-out)" }}>
                <DropdownMenu items={actions} />
              </div>
            )}
          </div>
        </div>

        <p style={{ color: "var(--text-secondary)", fontSize: "13.5px", lineHeight: "1.6", margin: 0, flexGrow: 1, marginBottom: "20px" }}>
          {rule.description}
        </p>

        {/* Footer Tags */}
        <div style={{ display: "flex", gap: "12px", borderTop: "1px solid var(--border)", paddingTop: "14px", marginTop: "auto", alignItems: "center" }}>
          {isTemplate && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "600", color: "var(--text-muted)", background: "var(--bg-surface-hover)", padding: "2px 6px", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <Lock size={10} /> System Template
            </div>
          )}

          {rule.category && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--text-muted)", fontSize: "11px", fontWeight: "500" }}>
              <Tag size={12} /> {rule.category}
            </div>
          )}
          
          {rule.industry && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--text-muted)", fontSize: "11px", fontWeight: "500" }}>
              <Layers size={12} /> {rule.industry}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
