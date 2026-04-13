import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import useStore from "../utils/Store";
import { getAuditResult } from "../services/api";
import { Download, AlertCircle, ChevronDown, CheckCircle, XCircle, AlertTriangle, ArrowLeft, Printer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function RiskGaugeSimple({ score }) {
  const color = score >= 70 ? "var(--danger)" : score >= 40 ? "var(--warn)" : "var(--success)";
  const label = score >= 70 ? "High Risk" : score >= 40 ? "Medium Risk" : "Low Risk";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{
        width: 128, height: 128, borderRadius: "50%", border: `4px solid ${color}`, opacity: 0.8,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
      }}>
        <div style={{ fontSize: 36, fontWeight: 900, color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>Score</div>
      </div>
      <span style={{ fontSize: 14, fontWeight: 600, color }}>{label}</span>
    </div>
  );
}

function FilterTab({ text, count, active, onClick, colorStr }) {
  const colorMap = {
    info: { main: "var(--info)", bg: "var(--info-light)", border: "var(--info-border)" },
    danger: { main: "var(--danger)", bg: "var(--danger-light)", border: "var(--danger-border)" },
    warn: { main: "var(--warn)", bg: "var(--warn-light)", border: "var(--warn-border)" },
    success: { main: "var(--success)", bg: "var(--success-light)", border: "var(--success-border)" }
  };
  const themeColors = colorMap[colorStr] || colorMap.info;
  const color = themeColors.main;

  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, fontSize: 14, fontWeight: 600, transition: "all 0.2s",
        background: active ? themeColors.bg : "transparent",
        color: active ? color : "var(--text-secondary)",
        border: `1px solid ${active ? themeColors.border : "transparent"}`,
        cursor: "pointer"
      }}
    >
      {text}
      <span style={{ padding: "2px 8px", borderRadius: 12, fontSize: 12, background: active ? color : "var(--border)", color: active ? "#fff" : "var(--text-muted)" }}>
        {count}
      </span>
    </button>
  );
}

function RuleCard({ rule }) {
  const [open, setOpen] = useState(false);
  const statusCfg = {
    FAIL: { bg: "var(--danger-light)", text: "var(--danger)", border: "var(--danger-border)", icon: <XCircle size={14} color="var(--danger)" /> },
    WARN: { bg: "var(--warn-light)", text: "var(--warn)", border: "var(--warn-border)", icon: <AlertTriangle size={14} color="var(--warn)" /> },
    PASS: { bg: "var(--success-light)", text: "var(--success)", border: "var(--success-border)", icon: <CheckCircle size={14} color="var(--success)" /> },
  };
  const cfg = statusCfg[rule.status] || statusCfg.PASS;
  const sevCfg = {
    HIGH: { text: "var(--danger)", bg: "var(--danger-light)", border: "var(--danger-border)" },
    MEDIUM: { text: "var(--warn)", bg: "var(--warn-light)", border: "var(--warn-border)" },
    LOW: { text: "var(--text-muted)", bg: "var(--border)", border: "var(--border-hover)" }
  };
  const sCfg = sevCfg[rule.severity] || sevCfg.LOW;

  return (
    <div
      onClick={() => setOpen(!open)}
      className="rule-card"
      style={{
        background: "var(--bg-surface)", border: `1px solid ${open ? "var(--border-hover)" : "var(--border)"}`, borderRadius: 12, marginBottom: 12, overflow: "hidden", cursor: "pointer", transition: "all 0.2s", boxShadow: open ? "var(--shadow-sm)" : "none"
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "16px 20px", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
          <ChevronDown size={15} color="var(--text-muted)" style={{ flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(0deg)" : "rotate(-90deg)" }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{rule.rule_name}</div>
            {!open && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{rule.finding || "No finding details provided."}</div>}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}>
            {cfg.icon} {rule.status}
          </span>
          {rule.severity && (
            <span style={{ display: "inline-flex", padding: "4px 8px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: sCfg.bg, color: sCfg.text, border: `1px solid ${sCfg.border}` }}>
              {rule.severity}
            </span>
          )}
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: "hidden" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "4px 20px 20px", borderTop: "1px solid var(--border)", background: "var(--bg-surface-hover)", display: "flex", flexDirection: "column", gap: 16 }}>
              {rule.finding && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Finding</div>
                  <p style={{ fontSize: 14, color: "var(--text-primary)", lineHeight: 1.6, margin: 0 }}>{rule.finding}</p>
                </div>
              )}
              {rule.citation && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Document Citation</div>
                  <blockquote style={{ fontSize: 14, color: "var(--text-muted)", fontStyle: "italic", borderLeft: "2px solid var(--info)", paddingLeft: 12, margin: 0, lineHeight: 1.6 }}>
                    "{rule.citation}"
                  </blockquote>
                </div>
              )}
              {rule.suggestion && (
                <div style={{ background: "var(--info-light)", border: "1px solid var(--info-border)", borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--info)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>AI Suggestion</div>
                  <p style={{ fontSize: 14, color: "var(--info)", lineHeight: 1.6, margin: 0 }}>{rule.suggestion}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Report() {
  const setTopBar = useStore((state) => state.setTopBar);
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const reportRef = useRef(null);

  useEffect(() => {
    setTopBar("reports");
    (async () => {
      try { setReport(await getAuditResult(id)); }
      catch (e) { console.log(e); }
      finally { setLoading(false); }
    })();
  }, [id]);

  function exportPDF() {
    window.print();
  }

  if (loading) return (
    <Layout>
      <div style={{ maxWidth: 896, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
        {[120, 80, 260, 200, 200].map((h, i) => <div key={i} className="skeleton" style={{ height: h, borderRadius: 12 }} />)}
      </div>
    </Layout>
  );

  if (!report) return (
    <Layout>
      <div style={{ maxWidth: 450, margin: "40px auto 0", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: "var(--bg-surface-hover)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <AlertCircle size={28} color="var(--text-muted)" />
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>Report Not Found</h2>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 20 }}>This audit report may have been deleted or doesn't exist.</p>
        <button onClick={() => navigate("/reports")} className="btn btn-primary" style={{ padding: "10px 16px" }}>Back to Reports</button>
      </div>
    </Layout>
  );

  const filteredResults = report.results.filter((r) => filter === "ALL" || r.status === filter);

  return (
    <Layout>
      <div ref={reportRef} style={{ maxWidth: 896, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24, paddingBottom: 40 }}>
        {/* Header */}
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div>
            <button onClick={() => navigate("/reports")} className="no-print" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", marginBottom: 12 }}>
              <ArrowLeft size={13} /> Back to Reports
            </button>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 8px 0" }}>{report?.filename || "Audit Report"}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 12, fontFamily: 'ui-monospace, monospace', padding: "4px 8px", borderRadius: 4, background: "var(--bg-surface-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                ID: {(report.document || id).substring(0, 8)}…
              </span>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{new Date(report.uploaded_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            </div>
          </div>
          <button onClick={exportPDF} className="btn btn-secondary no-print" style={{ flexShrink: 0 }}>
            <Printer size={15} /> Export PDF
          </button>
        </div>

        {/* Summary Dashboard */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 200px", background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", itemsCenter: "center", justifyContent: "center", minHeight: 180 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16, textAlign: "center" }}>Risk Score</p>
            <RiskGaugeSimple score={report.risk_score} />
          </div>
          <div style={{ flex: "3 1 400px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              { label: "Rules Checked", value: report.rules_checked },
              { label: "Failures", value: report.results.filter((r) => r.status === "FAIL").length },
              { label: "Warnings", value: report.results.filter((r) => r.status === "WARN").length },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>{label}</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: "var(--text-primary)" }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 16, borderBottom: "1px solid var(--border)", flexWrap: "wrap" }}>
          <FilterTab text="All Results" count={report.results.length} active={filter === "ALL"} onClick={() => setFilter("ALL")} colorStr="info" />
          <FilterTab text="Failures" count={report.results.filter((r) => r.status === "FAIL").length} active={filter === "FAIL"} onClick={() => setFilter("FAIL")} colorStr="danger" />
          <FilterTab text="Warnings" count={report.results.filter((r) => r.status === "WARN").length} active={filter === "WARN"} onClick={() => setFilter("WARN")} colorStr="warn" />
          <FilterTab text="Passed" count={report.results.filter((r) => r.status === "PASS").length} active={filter === "PASS"} onClick={() => setFilter("PASS")} colorStr="success" />
        </div>

        {/* Rule Cards */}
        <div>
          {filteredResults.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)", fontSize: 14 }}>No rules match the selected filter.</div>
          ) : (
            filteredResults.map((r) => <RuleCard key={r.rule_id} rule={r} />)
          )}
        </div>
      </div>
    </Layout>
  );
}
