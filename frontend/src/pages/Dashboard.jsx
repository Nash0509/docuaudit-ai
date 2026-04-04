import { useState } from "react";

import Layout from "../components/layout/Layout";

import MetricCard from "../components/dashboard/Metriccard";

import UploadCard from "../components/dashboard/UploadCard";

import DocumentTable from "../components/dashboard/DocumentTable";

import ActivityPanel from "../components/dashboard/ActivityPanel";

import { FileText, BarChart3, ShieldAlert, Upload } from "lucide-react";

import UploadZone from "../components/dashboard/UploadZone";

import StatsPanel from "../components/dashboard/StatsPanel";

export default function Dashboard() {
  const [refresh, setRefresh] = useState(false);

  function reload() {
    setRefresh(!refresh);
  }

  return (
    <Layout>
      <StatsPanel />

      <div style={{ marginBottom: "30px" }}>
        <UploadZone onUploadSuccess={reload}/>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <DocumentTable variant="dashboard" refresh={refresh}/>
      </div>

      <div>
        <ActivityPanel />
      </div>
    </Layout>
  );
}
