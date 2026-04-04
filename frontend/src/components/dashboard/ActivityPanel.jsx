import Card from "../ui/Card";

import ActivityItem from "./ActivityItem";

import { Upload, ShieldCheck, AlertTriangle, FileText } from "lucide-react";

export default function ActivityPanel() {
  return (
    <Card>
      <div
        style={{
          fontWeight: "600",

          marginBottom: "14px",
        }}
      >
        Recent Activity
      </div>

      <ActivityItem
        icon={<Upload size={15} />}
        text="Vendor Agreement uploaded"
        time="2 min ago"
        color="#00d4aa"
      />

      <ActivityItem
        icon={<ShieldCheck size={15} />}
        text="Audit completed"
        time="10 min ago"
        color="#22c55e"
      />

      <ActivityItem
        icon={<AlertTriangle size={15} />}
        text="Medium risk detected"
        time="25 min ago"
        color="#f59e0b"
      />

      <ActivityItem
        icon={<FileText size={15} />}
        text="Document indexed"
        time="1 hr ago"
        color="#64748b"
      />
    </Card>
  );
}
