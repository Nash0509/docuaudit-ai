import { useEffect, useState, lazy, Suspense } from "react";
import useStore from "../utils/Store";
import Layout from "../components/layout/Layout";
import StatCard from "../components/dashboard/StatCard";
import RiskPanel from "../components/dashboard/RiskPanel";
import AIInsights from "../components/dashboard/AIInsights";
import QuickActions from "../components/dashboard/QuickActions";
import ActivityTimeline from "../components/dashboard/ActivityTimeline";
import { motion } from "framer-motion";
import {
  FileText, ShieldCheck, AlertTriangle, BarChart3,
  Brain, Zap, Clock, TrendingUp
} from "lucide-react";
import { getDocuments, getAllAuditResult, getRules } from "../services/api";
import Background3D from "../components/dashboard/Background3D";

// ─────────────────────────────────────────
// SECTION HEADER
// ─────────────────────────────────────────
function SectionHeader({ icon, label, sublabel }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ color: "var(--accent)", opacity: 0.8 }}>{icon}</div>
        <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)", letterSpacing: "-0.01em" }}>{label}</span>
      </div>
      {sublabel && <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{sublabel}</span>}
    </div>
  );
}

// ─────────────────────────────────────────
// GLASS PANEL
// ─────────────────────────────────────────
function Panel({ children, style = {}, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "20px",
        padding: "24px",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────
export default function Dashboard() {
  const setTopBar = useStore(s => s.setTopBar);
  const user = useStore(s => s.user);

  const [stats, setStats] = useState({ total: 0, audited: 0, highRisk: 0, avgRisk: 0 });
  const [riskData, setRiskData] = useState({ low: 0, medium: 0, high: 0 });
  const [reports, setReports] = useState([]);
  const [complianceScore, setComplianceScore] = useState(0);

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
      const audited = docs.filter(d => d.audited).length;
      const high = audits.filter(r => (r.risk_score || 0) >= 70).length;
      const medium = audits.filter(r => (r.risk_score || 0) >= 40 && (r.risk_score || 0) < 70).length;
      const low = audits.filter(r => (r.risk_score || 0) < 40).length;
      const totalScore = audits.reduce((a, r) => a + (r.risk_score || 0), 0);
      const avg = audits.length > 0 ? Math.round(totalScore / audits.length) : 0;
      const score = avg > 0 ? Math.max(0, 100 - avg) : 0;

      setStats({ total: docs.length, audited, highRisk: high, avgRisk: avg });
      setRiskData({ low, medium, high });
      setReports(audits);
      setComplianceScore(score);
    } catch (e) { console.error(e); }
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const username = user?.email?.split("@")[0] || "there";

  return (
    <Layout>
      <Background3D />
      <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "1400px", position: "relative", zIndex: 1 }}>

        {/* ══════════════════════════════════════════ */}
        {/* HERO GREETING BAR                         */}
        {/* ══════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "relative",
            padding: "28px 36px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, rgba(0,212,170,0.08) 0%, rgba(99,102,241,0.06) 60%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid rgba(0,212,170,0.15)",
            overflow: "hidden",
          }}
        >
          {/* Decorative blobs */}
          <div style={{ position: "absolute", top: "-60px", right: "10%", width: "200px", height: "200px", background: "radial-gradient(circle, rgba(0,212,170,0.12), transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-80px", right: "30%", width: "180px", height: "180px", background: "radial-gradient(circle, rgba(99,102,241,0.1), transparent 70%)", pointerEvents: "none" }} />

          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "13px", color: "var(--accent)", fontWeight: "600", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "6px" }}>
                DocuAudit AI · Command Center
              </div>
              <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#fff", margin: 0, letterSpacing: "-0.03em" }}>
                {greeting}, {username} 👋
              </h1>
              <p style={{ margin: "6px 0 0", fontSize: "14px", color: "var(--text-secondary)" }}>
                You have <strong style={{ color: "var(--text-primary)" }}>{stats.highRisk}</strong> high-risk contract{stats.highRisk !== 1 ? "s" : ""} requiring attention.
              </p>
            </div>

            {/* Compliance score badge */}
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              width: "100px", height: "100px", borderRadius: "50%",
              border: "2px solid rgba(0,212,170,0.3)",
              background: "rgba(0,212,170,0.06)",
              boxShadow: "0 0 40px rgba(0,212,170,0.12)",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "28px", fontWeight: "800", color: "var(--accent)", lineHeight: 1, letterSpacing: "-0.04em" }}>
                {complianceScore}
              </div>
              <div style={{ fontSize: "9px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "2px" }}>
                Score
              </div>
            </div>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════ */}
        {/* ROW 1 — STAT CARDS                        */}
        {/* ══════════════════════════════════════════ */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
          <StatCard icon={<FileText size={16} />} title="Total Documents" value={stats.total} color="#00d4aa" trendLabel="All time" index={0} />
          <StatCard icon={<ShieldCheck size={16} />} title="Audits Completed" value={stats.audited} color="#22c55e" trend={stats.audited} trendLabel="processed" index={1} />
          <StatCard icon={<AlertTriangle size={16} />} title="High Risk" value={stats.highRisk} color="#ef4444" trendLabel="Need attention" index={2} />
          <StatCard icon={<BarChart3 size={16} />} title="Avg Risk Score" value={stats.avgRisk > 0 ? `${stats.avgRisk}` : "—"} color="#f59e0b" trendLabel={stats.avgRisk > 0 ? "out of 100" : "No audits yet"} index={3} />
        </div>

        {/* ══════════════════════════════════════════ */}
        {/* ROW 2 — RISK INTELLIGENCE (3 columns)     */}
        {/* ══════════════════════════════════════════ */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>

          {/* COL 1 — Compliance Score + Distribution */}
          <Panel delay={0.15}>
            <SectionHeader icon={<TrendingUp size={14} />} label="Compliance Health" sublabel="Real-time posture" />

            <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginTop: "16px" }}>
              {/* Massive Score Snapshot */}
              <div style={{ 
                textAlign: "center", padding: "32px", 
                borderRadius: "20px", background: "rgba(255,255,255,0.015)", 
                border: "1px solid rgba(255,255,255,0.05)",
                boxShadow: "inset 0 0 40px rgba(255,255,255,0.01)"
              }}>
                <div style={{ fontSize: "64px", fontWeight: "900", color: "var(--accent)", letterSpacing: "-0.05em", lineHeight: 1 }}>
                  {complianceScore}
                </div>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "12px" }}>
                  Compliance Score
                </div>
              </div>

              <RiskPanel data={riskData} />
            </div>
          </Panel>

          {/* COL 2 — AI Insights */}
          <Panel delay={0.22}>
            <SectionHeader icon={<Brain size={14} />} label="AI Intelligence" sublabel={`${reports.length} audits`} />
            <AIInsights reports={reports} />
          </Panel>

          {/* COL 3 — Quick Actions */}
          <Panel delay={0.3}>
            <SectionHeader icon={<Zap size={14} />} label="Quick Actions" />
            <QuickActions />
          </Panel>
        </div>

        {/* ══════════════════════════════════════════ */}
        {/* ROW 3 — ACTIVITY TIMELINE                 */}
        {/* ══════════════════════════════════════════ */}
        <Panel delay={0.38} style={{ paddingBottom: "8px" }}>
          <SectionHeader icon={<Clock size={14} />} label="Recent Activity" sublabel="Last 8 events" />
          <ActivityTimeline />
        </Panel>

      </div>
    </Layout>
  );
}
