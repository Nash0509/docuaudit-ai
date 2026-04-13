import Layout from "../components/layout/Layout";
import { useState, useEffect } from "react";
import useStore from "../utils/Store";
import { getAllAuditResult } from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, BarChart3, ShieldAlert, ShieldCheck, Activity, ChevronRight, FolderOpen } from "lucide-react";
import useMediaQuery from "../utils/useMediaQuery";

function RiskBadge({ score }) {
  const cfg = score >= 70
    ? { bg: "var(--danger-light)", text: "var(--danger)", border: "var(--danger-border)", dot: "var(--danger)", label: "High" }
    : score >= 40
      ? { bg: "var(--warn-light)", text: "var(--warn)", border: "var(--warn-border)", dot: "var(--warn)", label: "Medium" }
      : { bg: "var(--success-light)", text: "var(--success)", border: "var(--success-border)", dot: "var(--success)", label: "Low" };
      
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot }} />
      {cfg.label} · {score}
    </span>
  );
}

function ReportRow({ report, navigate }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={() => navigate(`/report/${report.document}`)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr", alignItems: "center", gap: 16,
        padding: "16px 20px", borderBottom: `1px solid var(--border)`, cursor: "pointer",
        background: hover ? "var(--bg-surface-hover)" : "var(--bg-surface)", transition: "background 0.2s"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--info-light)", border: "1px solid var(--info-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <FileText size={15} color="var(--info)" />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.2 }}>{report.filename || "Contract"}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', marginTop: 2 }}>{report.document.substring(0, 8)}…</div>
        </div>
      </div>
      <RiskBadge score={report.risk_score} />
      <div style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>{report.rules_checked ?? "—"}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
          {report.uploaded_at ? new Date(report.uploaded_at).toLocaleDateString() : "Recently"}
        </span>
        <ChevronRight size={14} color={hover ? "var(--text-secondary)" : "var(--text-muted)"} style={{ transition: "color 0.2s" }} />
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr", gap: 16, padding: "16px 20px", borderBottom: `1px solid var(--border)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 8 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div className="skeleton" style={{ height: 14, width: 128, borderRadius: 4 }} />
          <div className="skeleton" style={{ height: 10, width: 80, borderRadius: 4 }} />
        </div>
      </div>
      {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 24, width: 80, borderRadius: 12 }} />)}
    </div>
  );
}

export default function Reports() {
  const setTopBar = useStore((state) => state.setTopBar);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTopBar("reports");
    (async () => {
      try {
        const result = await getAllAuditResult();
        setReports(Array.isArray(result) ? result : result.results || []);
      } catch (e) { console.log(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const totalAudits = reports.length;
  const highRisk = reports.filter((r) => r.risk_score >= 70).length;
  const lowRisk = reports.filter((r) => r.risk_score < 40).length;
  const avgScore = totalAudits > 0 ? Math.round(reports.reduce((a, r) => a + r.risk_score, 0) / totalAudits) : 0;

  const statCards = [
    { icon: Activity, label: "Total Audits", value: totalAudits, color: "var(--info)", bg: "var(--info-light)", border: "var(--info-border)" },
    { icon: ShieldAlert, label: "High Risk", value: highRisk, color: "var(--danger)", bg: "var(--danger-light)", border: "var(--danger-border)" },
    { icon: ShieldCheck, label: "Low Risk", value: lowRisk, color: "var(--success)", bg: "var(--success-light)", border: "var(--success-border)" },
    { icon: BarChart3, label: "Avg. Score", value: `${avgScore}%`, color: "var(--warn)", bg: "var(--warn-light)", border: "var(--warn-border)" },
  ];

  return (
    <Layout>
      <div style={{ maxWidth: 1024, margin: "0 auto", paddingBottom: 40, display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Page Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <BarChart3 size={18} color="var(--info)" />
              <h1 className="page-title">Audit Reports</h1>
            </div>
            <p className="page-sub">AI-generated compliance findings for your documents.</p>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 16 }}>
          {statCards.map(({ icon: Icon, label, value, color, bg, border }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="card" style={{ padding: "20px" }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 8, background: bg, border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Icon size={16} color={color} />
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{value}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Reports Table */}
        <div className="card" style={{ padding: 0 }}>
          {/* Column Header */}
          <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr", padding: "12px 20px", background: "var(--bg-surface-hover)", borderBottom: `1px solid var(--border)`, borderTopLeftRadius: 12, borderTopRightRadius: 12, fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            <div>Document</div>
            <div>Risk Score</div>
            <div>Rules Run</div>
            <div>Audit Date</div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <div style={{ minWidth: 640 }}>
              {loading ? (
                [...Array(4)].map((_, i) => <SkeletonRow key={i} />)
              ) : reports.length === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 24px", textAlign: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--bg-surface-hover)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    <FolderOpen size={24} color="var(--text-muted)" />
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>No reports yet</h3>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", maxWidth: 320 }}>Upload a document and run an audit to see your compliance reports here.</p>
                  <button onClick={() => navigate("/documents")} className="btn btn-secondary" style={{ marginTop: 24 }}>Go to Documents</button>
                </div>
              ) : (
                reports.map((report) => <ReportRow key={report.document} report={report} navigate={navigate} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
