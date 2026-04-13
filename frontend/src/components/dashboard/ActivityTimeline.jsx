import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getActivities } from "../../services/api";
import { UploadCloud, ShieldCheck, Trash2, AlertTriangle, Activity, Settings, FileText } from "lucide-react";

const EVENT_MAP = {
  upload:  { icon: UploadCloud,  color: "var(--info)", bg: "var(--info-light)", border: "var(--info-border)" },
  audit:   { icon: ShieldCheck,  color: "var(--success)", bg: "var(--success-light)", border: "var(--success-border)" },
  delete:  { icon: Trash2,       color: "var(--danger)", bg: "var(--danger-light)", border: "var(--danger-border)" },
  alert:   { icon: AlertTriangle,color: "var(--warn)", bg: "var(--warn-light)", border: "var(--warn-border)" },
  rule:    { icon: Settings,     color: "var(--accent)", bg: "var(--accent-light)", border: "var(--border-accent)" },
  report:  { icon: FileText,     color: "var(--info)", bg: "var(--info-light)", border: "var(--info-border)" },
  default: { icon: Activity,     color: "var(--text-muted)", bg: "var(--bg-surface-hover)", border: "var(--border)" },
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
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0" }}>
      <div className="skeleton" style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <div className="skeleton" style={{ height: 12, width: "66%", borderRadius: 4 }} />
        <div className="skeleton" style={{ height: 10, width: "33%", borderRadius: 4 }} />
      </div>
      <div className="skeleton" style={{ height: 10, width: 40, borderRadius: 4 }} />
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
    return <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>{[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}</div>;
  }

  if (items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "32px 0", fontSize: 14, color: "var(--text-muted)" }}>
        No recent activity yet. Upload a document to get started.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
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
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
              borderBottom: isLast ? "none" : "1px solid var(--border)"
            }}
          >
            <div
              style={{
                width: 32, height: 32, borderRadius: "50%", background: bg, border: `1px solid ${border}`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color
              }}
            >
              <Icon size={14} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, color: "var(--text-primary)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {item.action}
              </div>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", flexShrink: 0 }}>
              {item.timestamp ? timeAgo(item.timestamp) : "—"}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
