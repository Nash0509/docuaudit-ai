import Card from "../ui/Card";
import ActivityItem from "./ActivityItem";
import { Upload, ShieldCheck, AlertTriangle, FileText, Activity } from "lucide-react";

export default function ActivityPanel() {
  return (
    <Card style={{ padding: "0", overflow: "hidden" }} hover={false}>
      <div style={{
        padding: "20px 24px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: "rgba(255,255,255,0.01)",
      }}>
        <div style={{ background: "rgba(255,255,255,0.05)", padding: "6px", borderRadius: "8px", border: "1px solid var(--border)" }}>
          <Activity size={16} color="var(--text-secondary)" />
        </div>
        <div style={{ fontWeight: "600", fontSize: "15px", color: "var(--text-primary)" }}>
          Recent Activity
        </div>
      </div>

      <div style={{ padding: "8px" }}>
        <ActivityItem
          icon={<Upload size={14} />}
          text="MSA Agreement uploaded and queued for processing"
          time="2 min ago"
          color="#00d4aa"
        />
        <ActivityItem
          icon={<ShieldCheck size={14} />}
          text="Compliance audit completed for Vendor Contract"
          time="10 min ago"
          color="#22c55e"
        />
        <ActivityItem
          icon={<AlertTriangle size={14} />}
          text="Medium risk liability clause detected in NDA"
          time="25 min ago"
          color="#f59e0b"
        />
        <ActivityItem
          icon={<FileText size={14} />}
          text="Sales Agreement indexed into vector database"
          time="1 hr ago"
          color="#64748b"
        />
      </div>
    </Card>
  );
}
