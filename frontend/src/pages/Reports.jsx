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
    ? { cls: "bg-red-50 text-red-700 border-red-200", label: "High" }
    : score >= 40
      ? { cls: "bg-amber-50 text-amber-700 border-amber-200", label: "Medium" }
      : { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Low" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${score >= 70 ? "bg-red-500" : score >= 40 ? "bg-amber-400" : "bg-emerald-500"}`} />
      {cfg.label} · {score}
    </span>
  );
}

function ReportRow({ report, navigate }) {
  return (
    <div
      onClick={() => navigate(`/report/${report.document}`)}
      className="grid items-center gap-4 px-5 py-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors group"
      style={{ gridTemplateColumns: "2.5fr 1fr 1fr 1fr" }}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
          <FileText size={15} className="text-indigo-500" />
        </div>
        <div>
          <div className="text-sm font-medium text-slate-800 leading-tight">{report.filename || "Contract"}</div>
          <div className="text-xs text-slate-400 font-mono mt-0.5">{report.document.substring(0, 8)}…</div>
        </div>
      </div>
      <RiskBadge score={report.risk_score} />
      <div className="text-sm text-slate-600 font-medium">{report.rules_checked ?? "—"}</div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">
          {report.uploaded_at ? new Date(report.uploaded_at).toLocaleDateString() : "Recently"}
        </span>
        <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="grid gap-4 px-5 py-4 border-b border-slate-100" style={{ gridTemplateColumns: "2.5fr 1fr 1fr 1fr" }}>
      {[80, 48, 36, 64].map((w, i) => <div key={i} className={`skeleton h-5 rounded`} style={{ width: `${w}%` }} />)}
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
    { icon: Activity, label: "Total Audits", value: totalAudits, color: "#6366F1", bg: "bg-indigo-50", border: "border-indigo-100", text: "text-indigo-600" },
    { icon: ShieldAlert, label: "High Risk", value: highRisk, color: "#EF4444", bg: "bg-red-50", border: "border-red-100", text: "text-red-600" },
    { icon: ShieldCheck, label: "Low Risk", value: lowRisk, color: "#10B981", bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-600" },
    { icon: BarChart3, label: "Avg. Score", value: `${avgScore}%`, color: "#6366F1", bg: "bg-indigo-50", border: "border-indigo-100", text: "text-indigo-600" },
  ];

  return (
    <Layout>
      <div className="max-w-5xl space-y-6">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 size={18} className="text-indigo-500" />
              <h1 className="text-lg font-bold text-slate-900">Audit Reports</h1>
            </div>
            <p className="text-sm text-slate-500">AI-generated compliance findings for your documents.</p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className={`grid gap-4 ${isMobile ? "grid-cols-2" : "grid-cols-4"}`}>
          {statCards.map(({ icon: Icon, label, value, bg, border, text }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm hover:border-slate-300 transition-all"
            >
              <div className={`w-9 h-9 rounded-lg ${bg} border ${border} flex items-center justify-center mb-3`}>
                <Icon size={16} className={text} />
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Reports Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {/* Column Header */}
          <div className="grid gap-4 px-5 py-3 border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider" style={{ gridTemplateColumns: "2.5fr 1fr 1fr 1fr" }}>
            <div>Document</div>
            <div>Risk Score</div>
            <div>Rules Run</div>
            <div>Audit Date</div>
          </div>

          <div className="overflow-x-auto">
            <div style={{ minWidth: "640px" }}>
              {loading ? (
                [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
              ) : reports.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                    <FolderOpen size={24} className="text-slate-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-1">No reports yet</h3>
                  <p className="text-xs text-slate-400 max-w-xs">Upload a document and run an audit to see your compliance reports here.</p>
                  <button
                    onClick={() => navigate("/documents")}
                    className="mt-4 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                    style={{ fontFamily: "inherit" }}
                  >
                    Go to Documents
                  </button>
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
