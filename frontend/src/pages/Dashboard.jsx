import { useEffect, useState } from "react";
import useStore from "../utils/Store";
import Layout from "../components/layout/Layout";
import { motion } from "framer-motion";
import { FileText, ShieldCheck, AlertTriangle, BarChart3, TrendingUp, Clock, ArrowUpRight, Brain, Zap } from "lucide-react";
import { getDocuments, getAllAuditResult } from "../services/api";
import ActivityTimeline from "../components/dashboard/ActivityTimeline";
import useMediaQuery from "../utils/useMediaQuery";
import { useNavigate } from "react-router-dom";

const S = {
  card: {
    background: "var(--bg-surface)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: "20px",
    boxShadow: "var(--shadow-sm)",
  },
  sectionTitle: { fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 8, marginBottom: 16 },
  flexCenter: { display: "flex", alignItems: "center", justifyContent: "center" },
  flexBetween: { display: "flex", alignItems: "center", justifyContent: "space-between" },
};

function StatCard({ icon: Icon, title, value, color, sub, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      style={{ ...S.card, display: "flex", flexDirection: "column" }}
    >
      <div style={{ ...S.flexBetween, marginBottom: 16 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: `${color}15`, ...S.flexCenter }}>
          <Icon size={18} style={{ color }} />
        </div>
        <ArrowUpRight size={14} color="var(--text-muted)" />
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}>{title}</div>
      {sub && <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{sub}</div>}
    </motion.div>
  );
}

function RiskBar({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  const colors = {
    high: { bar: "var(--danger)", badge: { bg: "var(--danger-light)", color: "var(--danger)", border: "var(--danger-border)" } },
    medium: { bar: "var(--warn)", badge: { bg: "var(--warn-light)", color: "var(--warn)", border: "var(--warn-border)" } },
    low: { bar: "var(--success)", badge: { bg: "var(--success-light)", color: "var(--success)", border: "var(--success-border)" } },
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
      <div style={{ width: 80, fontSize: 12, fontWeight: 500, color: "var(--text-muted)", flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1, height: 6, borderRadius: 3, background: "var(--bg-surface-hover)", position: "relative", overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          style={{ position: "absolute", top: 0, left: 0, height: "100%", borderRadius: 3, background: colors[color].bar }}
        />
      </div>
      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 12, background: colors[color].badge.bg, color: colors[color].badge.color, border: `1px solid ${colors[color].badge.border}` }}>
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
  const scoreColor = complianceScore >= 70 ? "var(--success)" : complianceScore >= 40 ? "var(--warn)" : "var(--danger)";

  return (
    <Layout>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24, paddingBottom: 40 }}>
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ ...S.card, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 32px" }}
        >
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
              DocuAudit AI · Control Center
            </p>
            <h1 className="stat-number" style={{ fontSize: 24, marginBottom: 4 }}>{greeting}, {username} 👋</h1>
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}>
              {stats.highRisk > 0
                ? <span>You have <span style={{ fontWeight: 600, color: "var(--danger)" }}>{stats.highRisk} high-risk</span> document{stats.highRisk !== 1 ? "s" : ""} requiring review.</span>
                : "All documents are in compliance. Keep up the great work."
              }
            </p>
          </div>
          {!isMobile && (
            <div style={{ ...S.flexCenter, flexDirection: "column", width: 80, height: 80, borderRadius: "50%", border: `2px solid ${scoreColor}`, opacity: 0.8 }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: scoreColor, lineHeight: 1 }}>{complianceScore}</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2 }}>Score</div>
            </div>
          )}
        </motion.div>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 16 }}>
          <StatCard icon={FileText} title="Total Documents" value={stats.total} color="var(--accent)" sub="in your library" index={0} />
          <StatCard icon={ShieldCheck} title="Audited" value={stats.audited} color="var(--success)" sub="completed audits" index={1} />
          <StatCard icon={AlertTriangle} title="High Risk" value={stats.highRisk} color="var(--danger)" sub="need review" index={2} />
          <StatCard icon={BarChart3} title="Avg. Risk Score" value={`${stats.avgRisk}%`} color="var(--warn)" sub="across all audits" index={3} />
        </div>

        {/* Middle Row */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 20 }}>
          {/* Risk Distribution */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={S.card}>
            <div style={S.sectionTitle}>
              <TrendingUp size={16} color="var(--accent)" /> Risk Distribution
            </div>
            <RiskBar label="High Risk" count={riskData.high} total={riskData.high + riskData.medium + riskData.low} color="high" />
            <RiskBar label="Medium" count={riskData.medium} total={riskData.high + riskData.medium + riskData.low} color="medium" />
            <RiskBar label="Low Risk" count={riskData.low} total={riskData.high + riskData.medium + riskData.low} color="low" />
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={S.card}>
            <div style={S.sectionTitle}>
              <Zap size={16} color="var(--accent)" /> Quick Actions
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Upload Document", sub: "Add a new contract", path: "/documents", color: "var(--accent)", bg: "var(--accent-light)", border: "var(--border-accent)" },
                { label: "Run Audit", sub: "Start compliance check", path: "/documents", color: "var(--warn)", bg: "var(--warn-light)", border: "var(--warn-border)" },
                { label: "View Reports", sub: "Review findings", path: "/reports", color: "var(--success)", bg: "var(--success-light)", border: "var(--success-border)" },
              ].map(({ label, sub, path, color, bg, border }) => (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 14px", borderRadius: 10, background: bg, border: `1px solid ${border}`,
                    cursor: "pointer", textAlign: "left", transition: "all 0.15s"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(0.97)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.filter = "brightness(1)"; }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color }}>{label}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{sub}</div>
                  </div>
                  <ArrowUpRight size={14} color="var(--text-muted)" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* AI Compliance Score */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={S.card}>
            <div style={S.sectionTitle}>
              <Brain size={16} color="var(--accent)" /> AI Health Score
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px 0" }}>
              <div style={{
                width: 110, height: 110, borderRadius: "50%", border: `4px solid ${scoreColor}`, opacity: 0.8,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: 16
              }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: scoreColor, lineHeight: 1 }}>{complianceScore}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>Score</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                  {complianceScore >= 70 ? "Healthy" : complianceScore >= 40 ? "Moderate Risk" : "Action Required"}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                  {complianceScore >= 70 ? "Documents are largely compliant" : "Review flagged documents promptly"}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Activity Timeline */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} style={S.card}>
          <div style={S.sectionTitle}>
            <Clock size={16} color="var(--accent)" /> Recent Activity
          </div>
          <ActivityTimeline />
        </motion.div>
      </div>
    </Layout>
  );
}
