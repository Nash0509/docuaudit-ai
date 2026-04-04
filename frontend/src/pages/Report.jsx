import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import RiskGauge from "../components/ui/RiskGuage";
import { getAuditResult } from "../services/api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import RuleCard from "../components/report/RuleCard";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import { Download, AlertCircle, SearchX } from "lucide-react";

export default function Report() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const reportRef = useRef(null);

  useEffect(() => { loadReport(); }, [id]);

  async function loadReport() {
    try {
      const data = await getAuditResult(id);
      setReport(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  async function exportPDF() {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`audit-${id}.pdf`);
  }

  if (loading) return (
    <Layout>
      <div style={{ maxWidth: "1200px", margin: "auto", display: "flex", flexDirection: "column", gap: "32px", width: "100%" }}>
        <Skeleton height="100px" />
        <div style={{ display: "flex", gap: "24px" }}>
          <Skeleton height="180px" style={{ flex: "0 0 320px" }} />
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
             <Skeleton height="180px" />
             <Skeleton height="180px" />
             <Skeleton height="180px" />
          </div>
        </div>
        <Skeleton height="300px" />
      </div>
    </Layout>
  );

  if (!report) return (
    <Layout>
      <div style={{ maxWidth: "800px", margin: "auto", paddingTop: "40px" }}>
        <EmptyState 
          icon={<AlertCircle size={24} />}
          title="Report Not Found"
          description="The audit report you are looking for does not exist or has been deleted."
        />
      </div>
    </Layout>
  );

  const filteredResults = report.results.filter((r) => {
    if (filter === "ALL") return true;
    return r.status === filter;
  });

  return (
    <Layout>
      <div ref={reportRef} style={{ maxWidth: "1200px", margin: "auto" }}>
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", padding: "24px 32px", background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "4px", color: "var(--text-primary)", lineHeight: 1.2 }}>
              {report?.filename || "Audit Report"}
            </h1>
            <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "8px" }}>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "monospace", background: "var(--bg-surface-hover)", padding: "2px 8px", borderRadius: "4px", border: "1px solid var(--border)" }}>
                ID: {report.document.substring(0, 8)}...
              </span>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                {new Date(report.uploaded_at).toLocaleString()}
              </span>
            </div>
          </div>
          <Button variant="primary" onClick={exportPDF} icon={<Download size={16} />}>
            Export PDF
          </Button>
        </div>

        {/* SUMMARY DASHBOARD */}
        <div style={{ display: "flex", gap: "24px", marginBottom: "32px" }}>
          {/* Risk Card */}
          <Card style={{ flex: "0 0 320px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px" }}>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Calculated Risk Score</div>
            <RiskGauge score={report.risk_score} />
          </Card>
          
          {/* Stats Grid */}
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            <StatCard label="Total Rules Checked" value={report.rules_checked} color="var(--accent)" />
            <StatCard label="Compliance Failures" value={report.results.filter((r) => r.status === "FAIL").length} color="var(--danger)" />
            <StatCard label="Review Warnings" value={report.results.filter((r) => r.status === "WARN").length} color="var(--warn)" />
          </div>
        </div>

        {/* FILTER TABS */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", borderBottom: "1px solid var(--border)", paddingBottom: "16px" }}>
          <FilterTab text="All Results" count={report.results.length} active={filter === "ALL"} onClick={() => setFilter("ALL")} color="var(--accent)" />
          <FilterTab text="Failures" count={report.results.filter(r => r.status === "FAIL").length} active={filter === "FAIL"} onClick={() => setFilter("FAIL")} color="var(--danger)" />
          <FilterTab text="Warnings" count={report.results.filter(r => r.status === "WARN").length} active={filter === "WARN"} onClick={() => setFilter("WARN")} color="var(--warn)" />
          <FilterTab text="Passed" count={report.results.filter(r => r.status === "PASS").length} active={filter === "PASS"} onClick={() => setFilter("PASS")} color="var(--success)" />
        </div>

        {/* RULE RESULTS */}
        <div>
          {filteredResults.length === 0 ? (
            <EmptyState 
              icon={<SearchX size={20} />}
              title="No rules found"
              description={`There are no rules matching the current filter criterion.`}
            />
          ) : (
            filteredResults.map((r) => <RuleCard key={r.rule_id} rule={r} />)
          )}
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ label, value, color }) {
  return (
    <Card style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "24px 32px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: "100px", height: "100px", borderRadius: "50%", background: `${color}10`, filter: "blur(30px)", pointerEvents: "none", transform: "translate(30%, -30%)" }} />
      <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>{label}</div>
      <div style={{ fontSize: "42px", fontWeight: "700", color: "var(--text-primary)", lineHeight: 1 }}>{value}</div>
    </Card>
  );
}

function FilterTab({ text, count, active, onClick, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: "8px",
        padding: "8px 16px", borderRadius: "var(--radius-xl)", cursor: "pointer", fontSize: "13px", fontWeight: "600",
        background: active ? `${color}15` : "transparent",
        color: active ? color : "var(--text-secondary)",
        border: `1px solid ${active ? `${color}40` : "transparent"}`,
        transition: "background var(--ease-out)"
      }}
    >
      {text}
      <span style={{ 
        background: active ? color : "var(--bg-surface-hover)", 
        color: active ? "var(--bg-base)" : "var(--text-muted)", 
        padding: "2px 8px", borderRadius: "10px", fontSize: "11px" 
      }}>
        {count}
      </span>
    </button>
  );
}
