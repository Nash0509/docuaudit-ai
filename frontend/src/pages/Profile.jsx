import Layout from "../components/layout/Layout";
import { useState, useEffect } from "react";
import { getCurrentUser, getAllAuditResult } from "../services/api";
import useStore from "../utils/Store";
import { User, Mail, Shield, ShieldCheck, Zap, Clock, TrendingUp, Award, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function StatCard({ icon: Icon, label, value, color, bg, border, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-all"
    >
      <div className={`w-10 h-10 rounded-xl ${bg} border ${border} flex items-center justify-center mb-3`}>
        <Icon size={18} style={{ color }} />
      </div>
      <div className="text-2xl font-black text-slate-900 mb-1">{value}</div>
      <div className="text-xs font-medium text-slate-400 uppercase tracking-wide leading-tight">{label}</div>
    </motion.div>
  );
}

function ActivityItem({ item }) {
  const navigate = useNavigate();
  const color = item.risk_score >= 70 ? "#EF4444" : item.risk_score >= 40 ? "#F59E0B" : "#10B981";
  const label = item.risk_score >= 70 ? "High" : item.risk_score >= 40 ? "Medium" : "Low";

  return (
    <div
      onClick={() => navigate(`/report/${item.document}`)}
      className="flex items-center gap-3.5 p-3.5 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50 cursor-pointer transition-all"
    >
      <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
        <Shield size={16} className="text-indigo-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-slate-800 truncate">{item.filename || "Document"}</div>
        <div className="text-xs text-slate-400 mt-0.5">
          {new Date(item.uploaded_at).toLocaleDateString()} · {item.rules_checked} rules checked
        </div>
      </div>
      <span
        className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
        style={{ background: `${color}12`, color, border: `1px solid ${color}30` }}
      >
        {label} · {item.risk_score}
      </span>
    </div>
  );
}

export default function Profile() {
  const setTopBar = useStore((state) => state.setTopBar);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ total: 0, highRisk: 0, latest: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTopBar("profile");
    (async () => {
      try {
        const [userData, auditData] = await Promise.all([getCurrentUser(), getAllAuditResult()]);
        setUser(userData);
        const reports = Array.isArray(auditData) ? auditData : (auditData.results || []);
        setStats({
          total: reports.length,
          highRisk: reports.filter((r) => (r.risk_score || 0) >= 70).length,
          latest: reports.slice(0, 3),
        });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center h-64 gap-2 text-slate-400">
        <Loader2 size={18} className="animate-spin text-indigo-500" />
        <span className="text-sm">Loading profile...</span>
      </div>
    </Layout>
  );

  const initials = user?.email?.[0]?.toUpperCase() || "U";

  return (
    <Layout>
      <div className="max-w-4xl space-y-6 pb-10">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-2xl p-7 flex items-center gap-6 shadow-sm"
        >
          <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-3xl font-black text-white flex-shrink-0 shadow-lg shadow-indigo-200">
            {initials}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1.5 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900">{user?.name || "DocuAudit User"}</h1>
              {user?.is_subscribed ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <ShieldCheck size={11} /> Pro Subscriber
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  <Zap size={11} /> Free Tier
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500 flex-wrap">
              <span className="flex items-center gap-1.5"><Mail size={13} className="text-indigo-400" />{user?.email}</span>
              <span className="flex items-center gap-1.5"><Shield size={13} className="text-emerald-500" />Verified Auditor</span>
            </div>
          </div>
          {!user?.is_subscribed && (
            <button
              onClick={() => navigate("/pricing")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors flex-shrink-0"
              style={{ fontFamily: "inherit" }}
            >
              <Zap size={14} /> Upgrade to Pro
            </button>
          )}
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard icon={TrendingUp} label="Total Audits Completed" value={stats.total} color="#6366F1" bg="bg-indigo-50" border="border-indigo-100" delay={0.1} />
          <StatCard icon={Zap} label="High Risk Clauses Found" value={stats.highRisk} color="#EF4444" bg="bg-red-50" border="border-red-100" delay={0.15} />
          <StatCard icon={Award} label="Compliance Level" value="Silver" color="#F59E0B" bg="bg-amber-50" border="border-amber-100" delay={0.2} />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-3 gap-5">
          {/* Recent Activity */}
          <div className="col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-indigo-500" />
                <h2 className="text-sm font-bold text-slate-800">Recent Audits</h2>
              </div>
              <button
                onClick={() => navigate("/reports")}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }}
              >
                View all <ArrowRight size={12} />
              </button>
            </div>
            {stats.latest.length === 0 ? (
              <div className="text-center py-8 text-sm text-slate-400">No audit history yet.</div>
            ) : (
              <div className="space-y-1.5">
                {stats.latest.map((item, i) => <ActivityItem key={i} item={item} />)}
              </div>
            )}
          </div>

          {/* Side Cards */}
          <div className="space-y-4">
            {/* Security */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={14} className="text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-800">Security Health</h3>
              </div>
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-500">Audit Visibility</span>
                  <span className="font-semibold text-emerald-600">Secured</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100">
                  <div className="h-full w-5/6 rounded-full bg-emerald-500" />
                </div>
              </div>
              <button
                onClick={() => navigate("/settings")}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                style={{ fontFamily: "inherit" }}
              >
                Security Settings <ArrowRight size={11} />
              </button>
            </div>

            {/* Usage */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-1">Usage</h3>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">Your current document processing footprint.</p>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Cloud Embeddings</span>
                  <span className="font-semibold text-slate-700">{stats.total * 5} vectors</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">AI Reasoning</span>
                  <span className="font-semibold text-emerald-600">Active</span>
                </div>
              </div>
              {!user?.is_subscribed && (
                <button
                  onClick={() => navigate("/pricing")}
                  className="w-full mt-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
                  style={{ fontFamily: "inherit" }}
                >
                  Unlock Unlimited
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
