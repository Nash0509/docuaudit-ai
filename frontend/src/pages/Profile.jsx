import Layout from "../components/layout/Layout";
import { useState, useEffect } from "react";
import { getCurrentUser, getAllAuditResult } from "../services/api";
import useStore from "../utils/Store";
import { User, Mail, Shield, ShieldCheck, Zap, Clock, TrendingUp, Award, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const S = {
  hero: {
    background: "var(--bg-surface)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    padding: "28px 32px",
    display: "flex",
    alignItems: "center",
    gap: 24,
    boxShadow: "var(--shadow-sm)",
    marginBottom: 20,
    flexWrap: "wrap",
  },
  avatar: {
    width: 72, height: 72, borderRadius: 18,
    background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 28, fontWeight: 900, color: "#fff",
    boxShadow: "0 8px 24px var(--accent-light)",
    flexShrink: 0,
  },
  statCard: {
    background: "var(--bg-surface)", border: "1px solid var(--border)",
    borderRadius: 14, padding: "20px 24px",
    boxShadow: "var(--shadow-sm)",
    transition: "box-shadow 0.2s ease",
  },
  iconBox: (bg, border) => ({
    width: 40, height: 40, borderRadius: 12,
    background: bg, border: `1px solid ${border}`,
    display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: 12,
  }),
  card: {
    background: "var(--bg-surface)", border: "1px solid var(--border)",
    borderRadius: 14, padding: "20px 24px",
    boxShadow: "var(--shadow-sm)",
  },
  sectionTitle: { fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 },
  activityRow: {
    display: "flex", alignItems: "center", gap: 14,
    padding: "10px 12px", borderRadius: 10,
    cursor: "pointer", transition: "background 0.15s",
    marginBottom: 4,
  },
};

function StatCard({ icon: Icon, label, value, iconColor, iconBg, iconBorder, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} style={S.statCard}>
      <div style={S.iconBox(iconBg, iconBorder)}>
        <Icon size={18} style={{ color: iconColor }} />
      </div>
      <div style={{ fontSize: 32, fontWeight: 900, color: "var(--text-primary)", lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
    </motion.div>
  );
}

function ActivityItem({ item, navigate }) {
  const score = item.risk_score || 0;
  
  const getSeverity = (score) => {
    if (score >= 70) return { label: "High", colorStr: "danger" };
    if (score >= 40) return { label: "Med", colorStr: "warn" };
    return { label: "Low", colorStr: "success" };
  };

  const sev = getSeverity(score);
  const colorToken = `var(--${sev.colorStr})`;
  const bgToken = `var(--${sev.colorStr}-light)`;
  const borderToken = `var(--${sev.colorStr}-border)`;

  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => navigate(`/report/${item.document}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ ...S.activityRow, background: hovered ? "var(--bg-surface-hover)" : "transparent" }}
    >
      <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--info-light)", border: "1px solid var(--info-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Shield size={15} style={{ color: "var(--info)" }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.filename || "Document"}</div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
          {item.uploaded_at ? new Date(item.uploaded_at).toLocaleDateString() : "—"} · {item.rules_checked || 0} rules
        </div>
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: bgToken, color: colorToken, border: `1px solid ${borderToken}`, flexShrink: 0 }}>
        {sev.label} · {score}
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
        setStats({ total: reports.length, highRisk: reports.filter(r => r.risk_score >= 70).length, latest: reports.slice(0, 4) });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return (
    <Layout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, gap: 10, color: "var(--text-muted)" }}>
        <Loader2 size={18} style={{ animation: "spin 1s linear infinite", color: "var(--accent)" }} />
        <span style={{ fontSize: 14 }}>Loading profile...</span>
      </div>
    </Layout>
  );

  const initials = user?.email?.[0]?.toUpperCase() || "U";

  return (
    <Layout>
      <div style={{ maxWidth: 960, margin: "0 auto", paddingBottom: 40 }}>
        {/* Hero Banner */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} style={S.hero}>
          <div style={S.avatar}>{initials}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                {user?.name || "DocuAudit User"}
              </span>
              {user?.is_subscribed ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, background: "var(--info-light)", border: "1px solid var(--info-border)", fontSize: 11, fontWeight: 700, color: "var(--info)" }}>
                  <ShieldCheck size={10} /> Pro Subscriber
                </span>
              ) : (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, background: "var(--warn-light)", border: "1px solid var(--warn-border)", fontSize: 11, fontWeight: 700, color: "var(--warn)" }}>
                  <Zap size={10} /> Free Tier
                </span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--text-secondary)" }}>
                <Mail size={13} style={{ color: "var(--accent)" }} /> {user?.email}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--text-secondary)" }}>
                <Shield size={13} style={{ color: "var(--success)" }} /> Verified Auditor
              </span>
            </div>
          </div>
          {!user?.is_subscribed && (
            <button onClick={() => navigate("/pricing")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 10, background: "var(--accent)", color: "#fff", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "var(--shadow-sm)", flexShrink: 0 }}>
              <Zap size={14} /> Upgrade to Pro
            </button>
          )}
        </motion.div>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
          <StatCard icon={TrendingUp} label="Total Audits" value={stats.total} iconColor="var(--info)" iconBg="var(--info-light)" iconBorder="var(--info-border)" delay={0.08} />
          <StatCard icon={Zap} label="High Risk Found" value={stats.highRisk} iconColor="var(--danger)" iconBg="var(--danger-light)" iconBorder="var(--danger-border)" delay={0.14} />
          <StatCard icon={Award} label="Compliance Level" value="Silver" iconColor="var(--warn)" iconBg="var(--warn-light)" iconBorder="var(--warn-border)" delay={0.20} />
        </div>

        {/* Bottom Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>
          {/* Recent Audits */}
          <div style={S.card}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={S.sectionTitle}>
                <Clock size={14} style={{ color: "var(--info)" }} /> Recent Audits
              </div>
              <button onClick={() => navigate("/reports")} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "var(--accent)", background: "none", border: "none", cursor: "pointer" }}>
                View all <ArrowRight size={11} />
              </button>
            </div>
            {stats.latest.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0", fontSize: 13, color: "var(--text-muted)" }}>No audit history yet.</div>
            ) : (
              stats.latest.map((item, i) => <ActivityItem key={i} item={item} navigate={navigate} />)
            )}
          </div>

          {/* Side Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Security */}
            <div style={S.card}>
              <div style={S.sectionTitle}><Shield size={14} style={{ color: "var(--accent)" }} /> Security Health</div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                  <span style={{ color: "var(--text-secondary)" }}>Audit Visibility</span>
                  <span style={{ fontWeight: 700, color: "var(--success)" }}>Secured</span>
                </div>
                <div style={{ height: 6, background: "var(--border)", borderRadius: 3 }}>
                  <div style={{ height: "100%", width: "85%", background: "linear-gradient(90deg, var(--accent) 0%, var(--accent-light) 100%)", borderRadius: 3 }} />
                </div>
              </div>
              <button onClick={() => navigate("/settings")} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", cursor: "pointer" }}>
                Security Settings <ArrowRight size={11} />
              </button>
            </div>

            {/* Usage */}
            <div style={S.card}>
              <div style={S.sectionTitle}>Usage Overview</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12, lineHeight: 1.5 }}>Your current processing footprint.</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                {[
                  ["Cloud Embeddings", `${stats.total * 5} vectors`],
                  ["AI Reasoning", "Active"],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <span style={{ color: "var(--text-secondary)" }}>{label}</span>
                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{val}</span>
                  </div>
                ))}
              </div>
              {!user?.is_subscribed && (
                <button onClick={() => navigate("/pricing")} style={{ width: "100%", padding: "8px", borderRadius: 8, background: "var(--accent)", color: "#fff", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer" }}>
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
