import StatsCard from "./StatsCard";

import { FileText, ShieldCheck, AlertTriangle, BarChart3 } from "lucide-react";

export default function StatsPanel() {
  return (
    <div
      style={{
        display: "grid",

        gridTemplateColumns: "repeat(4,1fr)",

        gap: "20px",

        marginBottom: "30px",
      }}
    >
      <StatsCard
        icon={<FileText size={18} />}
        title="Documents"
        value="14"
        color="#00d4aa"
      />

      <StatsCard
        icon={<ShieldCheck size={18} />}
        title="Audited"
        value="9"
        color="#22c55e"
      />

      <StatsCard
        icon={<AlertTriangle size={18} />}
        title="High Risk"
        value="3"
        color="#ef4444"
      />

      <StatsCard
        icon={<BarChart3 size={18} />}
        title="Avg Risk"
        value="62"
        color="#f59e0b"
      />
    </div>
  );
}
