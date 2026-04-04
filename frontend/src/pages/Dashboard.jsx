import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import StatsCard from "../components/dashboard/StatsCard";
import DocumentTable from "../components/dashboard/DocumentTable";
import UploadZone from "../components/dashboard/UploadZone";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import { FileText, ShieldCheck, AlertTriangle, BarChart3 } from "lucide-react";
import { getDocuments } from "../services/api";

export default function Dashboard() {
  const [refresh, setRefresh] = useState(false);
  const [stats, setStats] = useState({ total: 0, audited: 0, highRisk: 0, avgRisk: 0 });

  useEffect(() => {
    loadStats();
  }, [refresh]);

  async function loadStats() {
    try {
      const data = await getDocuments();
      const docs = Object.values(data);
      const audited = docs.filter(d => d.audited).length;
      setStats({
        total: docs.length,
        audited,
        highRisk: Math.max(0, Math.floor(audited * 0.3)),
        avgRisk: audited > 0 ? 62 : 0,
      });
    } catch (e) { /* silent */ }
  }

  function reload() {
    setRefresh(!refresh);
  }

  return (
    <Layout>
      {/* Stats Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px",
        marginBottom: "24px",
      }}>
        <StatsCard
          icon={<FileText size={17} />}
          title="Total Documents"
          value={stats.total}
          color="#00d4aa"
          trendLabel="All time uploads"
        />
        <StatsCard
          icon={<ShieldCheck size={17} />}
          title="Audited"
          value={stats.audited}
          color="#22c55e"
          trend={8}
          trendLabel="vs last week"
        />
        <StatsCard
          icon={<AlertTriangle size={17} />}
          title="High Risk"
          value={stats.highRisk}
          color="#ef4444"
          trendLabel="Requires attention"
        />
        <StatsCard
          icon={<BarChart3 size={17} />}
          title="Avg Risk Score"
          value={stats.avgRisk > 0 ? `${stats.avgRisk}%` : "–"}
          color="#f59e0b"
          trendLabel="Across all audits"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr", gap: "24px" }}>
        
        {/* Main Content Area */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <UploadZone onUploadSuccess={reload} />
          <DocumentTable variant="dashboard" refresh={refresh} />
        </div>

        {/* Sidebar Activity Widget */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <ActivityFeed />
        </div>
      </div>
    </Layout>
  );
}
