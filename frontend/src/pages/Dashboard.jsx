import { useEffect, useState } from "react";
import useStore from "../utils/Store";
import Layout from "../components/layout/Layout";
import { motion } from "framer-motion";
import {
  FileText, ShieldCheck, AlertTriangle, BarChart3,
  TrendingUp, Clock, ArrowUpRight, Brain, Zap
} from "lucide-react";
import { getDocuments, getAllAuditResult } from "../services/api";
import ActivityTimeline from "../components/dashboard/ActivityTimeline";
import useMediaQuery from "../utils/useMediaQuery";
import { useNavigate } from "react-router-dom";

function StatCard({ icon: Icon, title, value, color, sub, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: `${color}15` }}
        >
          <Icon size={17} style={{ color }} />
        </div>
        <ArrowUpRight size={14} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
      </div>
      <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-slate-500">{title}</div>
      {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
    </motion.div>
  );
}

function RiskBar({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  const colors = {
    high: { bar: "bg-red-500", badge: "bg-red-50 text-red-600 border-red-100" },
    medium: { bar: "bg-amber-400", badge: "bg-amber-50 text-amber-600 border-amber-100" },
    low: { bar: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  };
  return (
    <div className="flex items-center gap-3">
      <div className="w-20 text-xs font-medium text-slate-500 flex-shrink-0">{label}</div>
      <div className="flex-1 h-1.5 rounded-full bg-slate-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className={`h-full rounded-full ${colors[color].bar}`}
        />
      </div>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colors[color].badge}`}>
        {count}
      </span>
    </div>
  );
}

export default function Dashboard() {
  const setTopBar = useStore((s) => s.setTopBar);
  const user = useStore((s) => s.user);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [stats, setStats] = useState({ total: 0, audited: 0, highRisk: 0, avgRisk: 0 });
  const [riskData, setRiskData] = useState({ low: 0, medium: 0, high: 0 });
  const [complianceScore, setComplianceScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTopBar("dashboard");
    loadData();
  }, []);

  async function loadData() {
    try {
      const [docsRaw, auditRaw] = await Promise.all([
        getDocuments().catch(() => ({})),
        getAllAuditResult().catch(() => []),
      ]);
      const docs = Object.values(docsRaw || {});
      const audits = Array.isArray(auditRaw) ? auditRaw : (auditRaw?.results || []);
      const audited = docs.filter((d) => d.audited).length;
      const high = audits.filter((r) => (r.risk_score || 0) >= 70).length;
      const medium = audits.filter((r) => (r.risk_score || 0) >= 40 && (r.risk_score || 0) < 70).length;
      const low = audits.filter((r) => (r.risk_score || 0) < 40).length;
      const avg = audits.length > 0 ? Math.round(audits.reduce((a, r) => a + (r.risk_score || 0), 0) / audits.length) : 0;
      setStats({ total: docs.length, audited, highRisk: high, avgRisk: avg });
      setRiskData({ low, medium, high });
      setComplianceScore(avg > 0 ? Math.max(0, 100 - avg) : 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const username = user?.email?.split("@")[0] || "there";
  const scoreColor = complianceScore >= 70 ? "#10B981" : complianceScore >= 40 ? "#F59E0B" : "#EF4444";

  return (
    <Layout>
      <div className="max-w-6xl space-y-6">

        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-slate-200 rounded-xl p-6 flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-1">DocuAudit AI · Control Center</p>
            <h1 className="text-xl font-bold text-slate-900">{greeting}, {username} 👋</h1>
            <p className="text-sm text-slate-500 mt-1">
              {stats.highRisk > 0
                ? <span>You have <span className="font-semibold text-red-500">{stats.highRisk} high-risk</span> document{stats.highRisk !== 1 ? "s" : ""} requiring review.</span>
                : "All documents are in compliance. Keep up the great work."
              }
            </p>
          </div>
          <div className="flex-shrink-0 text-center hidden sm:block">
            <div className="w-20 h-20 rounded-full border-2 flex flex-col items-center justify-center"
              style={{ borderColor: `${scoreColor}40`, background: `${scoreColor}08` }}>
              <div className="text-2xl font-black" style={{ color: scoreColor }}>{complianceScore}</div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Score</div>
            </div>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className={`grid gap-4 ${isMobile ? "grid-cols-2" : "grid-cols-4"}`}>
          <StatCard icon={FileText} title="Total Documents" value={stats.total} color="#6366F1" sub="in your library" index={0} />
          <StatCard icon={ShieldCheck} title="Audited" value={stats.audited} color="#10B981" sub="completed audits" index={1} />
          <StatCard icon={AlertTriangle} title="High Risk" value={stats.highRisk} color="#EF4444" sub="need review" index={2} />
          <StatCard icon={BarChart3} title="Avg. Risk Score" value={`${stats.avgRisk}%`} color="#F59E0B" sub="across all audits" index={3} />
        </div>

        {/* Middle Row */}
        <div className={`grid gap-5 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>

          {/* Risk Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-slate-200 rounded-xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={15} className="text-indigo-500" />
              <span className="text-sm font-semibold text-slate-700">Risk Distribution</span>
            </div>
            <div className="space-y-3">
              <RiskBar label="High Risk" count={riskData.high} total={riskData.high + riskData.medium + riskData.low} color="high" />
              <RiskBar label="Medium" count={riskData.medium} total={riskData.high + riskData.medium + riskData.low} color="medium" />
              <RiskBar label="Low Risk" count={riskData.low} total={riskData.high + riskData.medium + riskData.low} color="low" />
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white border border-slate-200 rounded-xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap size={15} className="text-indigo-500" />
              <span className="text-sm font-semibold text-slate-700">Quick Actions</span>
            </div>
            <div className="space-y-2">
              {[
                { label: "Upload Document", sub: "Add a new contract", path: "/documents", color: "indigo" },
                { label: "Run Audit", sub: "Start compliance check", path: "/documents", color: "amber" },
                { label: "View Reports", sub: "Review findings", path: "/reports", color: "emerald" },
              ].map(({ label, sub, path, color }) => (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-3 rounded-lg border text-left
                    transition-all duration-150 hover:shadow-sm
                    ${color === "indigo" ? "border-indigo-100 bg-indigo-50 hover:bg-indigo-100" :
                      color === "amber" ? "border-amber-100 bg-amber-50 hover:bg-amber-100" :
                      "border-emerald-100 bg-emerald-50 hover:bg-emerald-100"}
                  `}
                  style={{ fontFamily: "inherit" }}
                >
                  <div>
                    <div className={`text-sm font-semibold ${color === "indigo" ? "text-indigo-700" : color === "amber" ? "text-amber-700" : "text-emerald-700"}`}>{label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{sub}</div>
                  </div>
                  <ArrowUpRight size={14} className="text-slate-400" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* AI Compliance Score */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-slate-200 rounded-xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Brain size={15} className="text-indigo-500" />
              <span className="text-sm font-semibold text-slate-700">AI Health Score</span>
            </div>
            <div className="flex flex-col items-center justify-center py-4">
              <div
                className="w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center mb-3"
                style={{ borderColor: `${scoreColor}30`, background: `${scoreColor}08` }}
              >
                <div className="text-4xl font-black" style={{ color: scoreColor }}>{complianceScore}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-slate-700">
                  {complianceScore >= 70 ? "Healthy" : complianceScore >= 40 ? "Moderate Risk" : "Action Required"}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {complianceScore >= 70 ? "Documents are largely compliant" : "Review flagged documents promptly"}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white border border-slate-200 rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock size={15} className="text-indigo-500" />
            <span className="text-sm font-semibold text-slate-700">Recent Activity</span>
          </div>
          <ActivityTimeline />
        </motion.div>

      </div>
    </Layout>
  );
}
