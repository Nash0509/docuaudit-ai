import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getActivities } from "../../services/api";
import { UploadCloud, ShieldCheck, Trash2, AlertTriangle, Activity, Settings, FileText } from "lucide-react";

const EVENT_MAP = {
  upload:  { icon: UploadCloud,  color: "#6366F1", bg: "bg-indigo-50", border: "border-indigo-100" },
  audit:   { icon: ShieldCheck,   color: "#10B981", bg: "bg-emerald-50", border: "border-emerald-100" },
  delete:  { icon: Trash2,        color: "#EF4444", bg: "bg-red-50", border: "border-red-100" },
  alert:   { icon: AlertTriangle, color: "#F59E0B", bg: "bg-amber-50", border: "border-amber-100" },
  rule:    { icon: Settings,      color: "#8B5CF6", bg: "bg-violet-50", border: "border-violet-100" },
  report:  { icon: FileText,      color: "#3B82F6", bg: "bg-blue-50", border: "border-blue-100" },
  default: { icon: Activity,      color: "#64748B", bg: "bg-slate-50", border: "border-slate-200" },
};

function classify(action = "") {
  const a = action.toLowerCase();
  if (a.includes("upload") || a.includes("added")) return "upload";
  if (a.includes("audit") || a.includes("ran") || a.includes("completed")) return "audit";
  if (a.includes("delete") || a.includes("removed")) return "delete";
  if (a.includes("alert") || a.includes("risk")) return "alert";
  if (a.includes("rule")) return "rule";
  if (a.includes("report")) return "report";
  return "default";
}

function timeAgo(ts) {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="skeleton w-8 h-8 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="skeleton h-3 w-2/3 rounded" />
        <div className="skeleton h-2.5 w-1/3 rounded" />
      </div>
      <div className="skeleton h-2.5 w-10 rounded" />
    </div>
  );
}

export default function ActivityTimeline() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActivities()
      .then((d) => setItems(Array.isArray(d) ? d.slice(0, 8) : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="space-y-0.5">{[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}</div>;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-slate-400">
        No recent activity yet. Upload a document to get started.
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {items.map((item, i) => {
        const type = classify(item.action);
        const { icon: Icon, color, bg, border } = EVENT_MAP[type] || EVENT_MAP.default;
        const isLast = i === items.length - 1;

        return (
          <motion.div
            key={item.id || i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
            className={`flex items-center gap-3 py-3 ${!isLast ? "border-b border-slate-100" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${bg} ${border}`}
              style={{ color }}
            >
              <Icon size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-slate-700 font-medium truncate">{item.action}</div>
            </div>
            <div className="text-xs text-slate-400 flex-shrink-0">
              {item.timestamp ? timeAgo(item.timestamp) : "—"}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
