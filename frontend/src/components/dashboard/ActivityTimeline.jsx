import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getActivities } from "../../services/api";
import { UploadCloud, ShieldCheck, Trash2, AlertTriangle, Activity, Settings, FileText } from "lucide-react";

const EVENT_MAP = {
  upload: { icon: UploadCloud, color: "#00d4aa" },
  audit:  { icon: ShieldCheck,  color: "#22c55e" },
  delete: { icon: Trash2,       color: "#ef4444" },
  alert:  { icon: AlertTriangle, color: "#f59e0b" },
  rule:   { icon: Settings,     color: "#6366f1" },
  report: { icon: FileText,     color: "#3b82f6" },
  default:{ icon: Activity,     color: "#475569" },
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
    <div style={{ display: "flex", gap: "14px", alignItems: "center", padding: "8px 0" }}>
      <div className="skeleton" style={{ width: "32px", height: "32px", borderRadius: "10px", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div className="skeleton" style={{ width: "65%", height: "11px", borderRadius: "4px", marginBottom: "6px" }} />
        <div className="skeleton" style={{ width: "35%", height: "9px", borderRadius: "4px" }} />
      </div>
      <div className="skeleton" style={{ width: "40px", height: "9px", borderRadius: "4px" }} />
    </div>
  );
}

export default function ActivityTimeline() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActivities()
      .then(d => setItems(Array.isArray(d) ? d.slice(0, 8) : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ display: "flex", flexDirection: "column" }}>{[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}</div>;
  }

  if (items.length === 0) {
    return <div style={{ padding: "24px 0", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>No recent activity yet.</div>;
  }

  return (
    <div style={{ position: "relative" }}>
      {/* Vertical connector */}
      <div style={{
        position: "absolute", left: "15px", top: "16px",
        width: "1px", bottom: "16px",
        background: "linear-gradient(to bottom, rgba(255,255,255,0.08) 0%, transparent 100%)",
      }} />

      <div style={{ display: "flex", flexDirection: "column" }}>
        {items.map((item, i) => {
          const type = classify(item.action);
          const { icon: Icon, color } = EVENT_MAP[type] || EVENT_MAP.default;
          const isLast = i === items.length - 1;

          return (
            <motion.div
              key={item.id || i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              style={{
                display: "flex", gap: "14px", alignItems: "center",
                padding: "10px 0",
                borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.03)",
              }}
            >
              <div style={{
                width: "32px", height: "32px", borderRadius: "10px", flexShrink: 0,
                background: `${color}18`, border: `1px solid ${color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color, zIndex: 1,
              }}>
                <Icon size={13} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: "13px", fontWeight: "500", color: "var(--text-primary)",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {item.action}
                </div>
              </div>

              <div style={{ fontSize: "11px", color: "var(--text-muted)", flexShrink: 0 }}>
                {item.timestamp ? timeAgo(item.timestamp) : "—"}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
