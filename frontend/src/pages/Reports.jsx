import Layout from "../components/layout/Layout";
import { useState, useEffect } from "react";
import { getAllAuditResult } from "../services/api";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import { motion } from "framer-motion";
import { FileText, ChevronRight, FileSearch } from "lucide-react";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const result = await getAllAuditResult();
        setReports(Array.isArray(result) ? result : result.results || []);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <Layout>
      <div style={{ maxWidth: "1200px", margin: "auto" }}>
        {/* HEADER & STATS */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", background: "var(--bg-surface)", padding: "24px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "4px", color: "var(--text-primary)" }}>Audit Reports</h1>
            <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "14px" }}>
              AI compliance analysis results and history.
            </p>
          </div>
          <div style={{ display: "flex", gap: "24px" }}>
            <Stat label="Total Audits" value={reports.length} color="var(--accent)" />
            <Stat label="High Risk" value={reports.filter((r) => r.risk_score >= 70).length} color="var(--danger)" />
            <Stat label="Low Risk" value={reports.filter((r) => r.risk_score < 40).length} color="var(--success)" />
          </div>
        </div>

        {/* TABLE */}
        <Card style={{ padding: "0", overflow: "hidden" }} hover={false}>
          {/* HEADER */}
          <div style={{
            display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr 1fr",
            padding: "16px 24px", fontSize: "11px", color: "var(--text-muted)",
            fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em",
            borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.015)"
          }}>
            <div>Document</div>
            <div>Risk Score</div>
            <div>Rules Run</div>
            <div>Audit Date</div>
            <div style={{ textAlign: "right" }}>Actions</div>
          </div>

          {/* BODY */}
          {loading ? (
             <div>
               {[...Array(5)].map((_, i) => (
                 <div key={i} style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr 1fr", gap: "16px", alignItems: "center" }}>
                   <Skeleton height="16px" style={{ width: "80%" }}/>
                   <Skeleton height="16px" style={{ width: "50%" }}/>
                   <Skeleton height="16px" style={{ width: "40%" }}/>
                   <Skeleton height="16px" style={{ width: "80%" }}/>
                   <Skeleton height="32px" style={{ width: "60px", justifySelf: "end" }}/>
                 </div>
               ))}
             </div>
          ) : reports.length === 0 ? (
            <div style={{ padding: "40px" }}>
              <EmptyState 
                icon={<FileSearch size={24} />}
                title="No reports generated"
                description="Upload a document and trigger an audit to generate your first AI compliance report."
                actionText="Go to Dashboard"
                onAction={() => navigate("/")}
                style={{ border: "none" }}
              />
            </div>
          ) : (
            reports.map((report) => (
              <ReportRow key={report.document} report={report} navigate={navigate} />
            ))
          )}
        </Card>
      </div>
    </Layout>
  );
}

function ReportRow({ report, navigate }) {
  const [isHovered, setIsHovered] = useState(false);

  const getRiskColor = (score) => {
    if (score >= 70) return "var(--danger)";
    if (score >= 40) return "var(--warn)";
    return "var(--success)";
  };
  
  const getRiskBg = (score) => {
    if (score >= 70) return "var(--danger-dim)";
    if (score >= 40) return "var(--warn-dim)";
    return "var(--success-dim)";
  };

  const riskColor = getRiskColor(report.risk_score);
  const riskBg = getRiskBg(report.risk_score);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/report/${report.document}`)}
      style={{
        display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr 1fr",
        padding: "16px 24px", borderBottom: "1px solid var(--border)",
        alignItems: "center", cursor: "pointer", transition: "background var(--ease-out)",
        background: isHovered ? "var(--bg-surface-hover)" : "transparent"
      }}
    >
      {/* DOCUMENT */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "10px", border: "1px solid var(--border)" }}>
           <FileText size={16} color="var(--text-secondary)" />
        </div>
        <div>
          <div style={{ fontWeight: "500", fontSize: "14px", color: "var(--text-primary)", marginBottom: "2px" }}>
            {report.filename || "Contract Document"}
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "monospace" }}>
            {report.document.substring(0, 16)}...
          </div>
        </div>
      </div>

      {/* RISK */}
      <div>
        <div style={{
          display: "inline-flex", padding: "4px 10px", borderRadius: "var(--radius-xl)",
          fontSize: "12px", fontWeight: "600",
          background: riskBg, color: riskColor, border: `1px solid ${riskColor}33`,
        }}>
          {report.risk_score}
        </div>
      </div>

      {/* RULES */}
      <div style={{ color: "var(--text-secondary)", fontSize: "14px", fontWeight: "500" }}>
        {report.rules_checked}
      </div>

      {/* DATE */}
      <div style={{ color: "var(--text-muted)", fontSize: "13px" }}>
        {report.uploaded_at ? new Date(report.uploaded_at).toLocaleDateString() : "Just now"}
      </div>

      {/* ACTION */}
      <div style={{ textAlign: "right", opacity: isHovered ? 1 : 0, transition: "opacity var(--ease-out)" }}>
        <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); navigate(`/report/${report.document}`); }} icon={<ChevronRight size={14}/>}>
          View
        </Button>
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={{ borderLeft: `2px solid ${color}`, paddingLeft: "12px" }}>
      <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
        {label}
      </div>
      <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--text-primary)", lineHeight: 1 }}>
        {value}
      </div>
    </div>
  );
}
