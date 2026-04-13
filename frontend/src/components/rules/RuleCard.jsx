import { Edit, Trash2, Tag, Layers, Lock, MoreVertical } from "lucide-react";
import DropdownMenu from "../ui/DropdownMenu";

const SEVERITY_CFG = {
  HIGH: "bg-red-50 text-red-700 border-red-200",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
  LOW: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function RuleCard({ rule, onEdit, onDelete, isSystem }) {
  const isTemplate = rule.is_template;
  const actions = [
    { label: "Edit Rule", icon: <Edit size={14} />, onClick: () => onEdit(rule) },
    { type: "divider" },
    { label: "Delete Rule", icon: <Trash2 size={14} />, danger: true, onClick: () => onDelete(rule.id) },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col h-full hover:border-slate-300 hover:shadow-sm transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-sm font-semibold text-slate-800 leading-snug flex-1">{rule.name}</h3>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${SEVERITY_CFG[rule.severity] || SEVERITY_CFG.LOW}`}>
            {rule.severity || "LOW"}
          </span>
          {!isTemplate && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu items={actions} />
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-4">{rule.description}</p>

      {/* Footer Tags */}
      <div className="flex items-center gap-3 flex-wrap pt-3 border-t border-slate-100">
        {isTemplate && (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wide">
            <Lock size={9} /> System
          </span>
        )}
        {rule.category && (
          <span className="inline-flex items-center gap-1 text-xs text-slate-400">
            <Tag size={11} /> {rule.category}
          </span>
        )}
        {rule.industry && (
          <span className="inline-flex items-center gap-1 text-xs text-slate-400">
            <Layers size={11} /> {rule.industry}
          </span>
        )}
      </div>
    </div>
  );
}
