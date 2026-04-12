import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import useStore from "../utils/Store";
import { getAuditResult } from "../services/api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Download, AlertCircle, ChevronDown, CheckCircle, XCircle, AlertTriangle, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function RiskGaugeSimple({ score }) {
  const color = score >= 70 ? "#EF4444" : score >= 40 ? "#F59E0B" : "#10B981";
  const label = score >= 70 ? "High Risk" : score >= 40 ? "Medium Risk" : "Low Risk";
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center"
        style={{ borderColor: `${color}30`, background: `${color}08` }}>
        <div className="text-4xl font-black" style={{ color }}>{score}</div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</div>
      </div>
      <span className="text-sm font-semibold" style={{ color }}>{label}</span>
    </div>
  );
}

function FilterTab({ text, count, active, onClick, color }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all border`}
      style={{
        background: active ? `${color}12` : "transparent",
        color: active ? color : "#64748B",
        borderColor: active ? `${color}30` : "transparent",
        fontFamily: "inherit"
      }}
    >
      {text}
      <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: active ? color : "#F1F5F9", color: active ? "#fff" : "#94A3B8" }}>
        {count}
      </span>
    </button>
  );
}

function RuleCard({ rule }) {
  const [open, setOpen] = useState(false);
  const statusCfg = {
    FAIL: { cls: "bg-red-50 text-red-700 border-red-200", icon: <XCircle size={14} className="text-red-500" />, dot: "bg-red-500" },
    WARN: { cls: "bg-amber-50 text-amber-700 border-amber-200", icon: <AlertTriangle size={14} className="text-amber-500" />, dot: "bg-amber-400" },
    PASS: { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <CheckCircle size={14} className="text-emerald-500" />, dot: "bg-emerald-500" },
  };
  const cfg = statusCfg[rule.status] || statusCfg.PASS;
  const sevCfg = { HIGH: "text-red-600 bg-red-50 border-red-200", MEDIUM: "text-amber-600 bg-amber-50 border-amber-200", LOW: "text-slate-500 bg-slate-50 border-slate-200" };

  return (
    <div
      className={`bg-white border rounded-xl mb-3 overflow-hidden cursor-pointer hover:border-slate-300 transition-all ${open ? "border-slate-300 shadow-sm" : "border-slate-200"}`}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-start justify-between px-5 py-4 gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <ChevronDown size={15} className="text-slate-400 flex-shrink-0 transition-transform" style={{ transform: open ? "rotate(0deg)" : "rotate(-90deg)" }} />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-800">{rule.rule_name}</div>
            {!open && <div className="text-xs text-slate-400 mt-0.5 truncate">{rule.finding || "No finding details provided."}</div>}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}>
            {cfg.icon} {rule.status}
          </span>
          {rule.severity && (
            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold border ${sevCfg[rule.severity] || sevCfg.LOW}`}>
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
            className="overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50 space-y-4">
              {rule.finding && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Finding</div>
                  <p className="text-sm text-slate-700 leading-relaxed">{rule.finding}</p>
                </div>
              )}
              {rule.citation && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Document Citation</div>
                  <blockquote className="text-sm text-slate-600 italic border-l-2 border-indigo-400 pl-3 leading-relaxed">
                    "{rule.citation}"
                  </blockquote>
                </div>
              )}
              {rule.suggestion && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3">
                  <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest mb-1">AI Suggestion</div>
                  <p className="text-sm text-indigo-800 leading-relaxed">{rule.suggestion}</p>
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

  async function exportPDF() {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
    const w = pdf.internal.pageSize.getWidth();
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, w, (canvas.height * w) / canvas.width);
    pdf.save(`audit-${id}.pdf`);
  }

  if (loading) return (
    <Layout>
      <div className="max-w-4xl space-y-5">
        {[120, 80, 260, 200, 200].map((h, i) => <div key={i} className="skeleton rounded-xl" style={{ height: `${h}px` }} />)}
      </div>
    </Layout>
  );

  if (!report) return (
    <Layout>
      <div className="max-w-lg mx-auto pt-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={28} className="text-slate-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Report Not Found</h2>
        <p className="text-sm text-slate-500 mb-5">This audit report may have been deleted or doesn't exist.</p>
        <button onClick={() => navigate("/reports")} className="px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors" style={{ fontFamily: "inherit" }}>
          Back to Reports
        </button>
      </div>
    </Layout>
  );

  const filteredResults = report.results.filter((r) => filter === "ALL" || r.status === filter);

  return (
    <Layout>
      <div ref={reportRef} className="max-w-4xl space-y-6">
        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-start justify-between gap-4">
          <div>
            <button onClick={() => navigate("/reports")} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 mb-3 transition-colors" style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }}>
              <ArrowLeft size={13} /> Back to Reports
            </button>
            <h1 className="text-xl font-bold text-slate-900 mb-2">{report?.filename || "Audit Report"}</h1>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono px-2 py-1 rounded bg-slate-100 text-slate-500 border border-slate-200">
                ID: {(report.document || id).substring(0, 8)}…
              </span>
              <span className="text-xs text-slate-400">{new Date(report.uploaded_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            </div>
          </div>
          <button
            onClick={exportPDF}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex-shrink-0"
            style={{ fontFamily: "inherit" }}
          >
            <Download size={15} /> Export PDF
          </button>
        </div>

        {/* Summary Dashboard */}
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-4 md:col-span-1 bg-white border border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-4">Risk Score</p>
            <RiskGaugeSimple score={report.risk_score} />
          </div>
          <div className="col-span-4 md:col-span-3 grid grid-cols-3 gap-4">
            {[
              { label: "Rules Checked", value: report.rules_checked, color: "#6366F1", cls: "text-indigo-600 bg-indigo-50 border-indigo-100" },
              { label: "Failures", value: report.results.filter((r) => r.status === "FAIL").length, color: "#EF4444", cls: "text-red-600 bg-red-50 border-red-100" },
              { label: "Warnings", value: report.results.filter((r) => r.status === "WARN").length, color: "#F59E0B", cls: "text-amber-600 bg-amber-50 border-amber-100" },
            ].map(({ label, value, cls }) => (
              <div key={label} className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">{label}</div>
                <div className="text-4xl font-black text-slate-900">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 pb-4 border-b border-slate-200 flex-wrap">
          <FilterTab text="All Results" count={report.results.length} active={filter === "ALL"} onClick={() => setFilter("ALL")} color="#6366F1" />
          <FilterTab text="Failures" count={report.results.filter((r) => r.status === "FAIL").length} active={filter === "FAIL"} onClick={() => setFilter("FAIL")} color="#EF4444" />
          <FilterTab text="Warnings" count={report.results.filter((r) => r.status === "WARN").length} active={filter === "WARN"} onClick={() => setFilter("WARN")} color="#F59E0B" />
          <FilterTab text="Passed" count={report.results.filter((r) => r.status === "PASS").length} active={filter === "PASS"} onClick={() => setFilter("PASS")} color="#10B981" />
        </div>

        {/* Rule Cards */}
        <div>
          {filteredResults.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">No rules match the selected filter.</div>
          ) : (
            filteredResults.map((r) => <RuleCard key={r.rule_id} rule={r} />)
          )}
        </div>
      </div>
    </Layout>
  );
}
