import Layout from "../components/layout/Layout";
import { useState, useEffect } from "react";
import { getCurrentUser, getAllAuditResult } from "../services/api";
import useStore from "../utils/Store";
import Card from "../components/ui/Card";
import { User, Mail, Shield, ShieldCheck, Zap, Clock, TrendingUp, Award, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const setTopBar = useStore(state => state.setTopBar);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setTopBar("profile");
  }, []);
  const [stats, setStats] = useState({ total: 0, highRisk: 0, latest: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const [userData, auditData] = await Promise.all([
          getCurrentUser(),
          getAllAuditResult()
        ]);
        setUser(userData);
        
        const reports = Array.isArray(auditData) ? auditData : (auditData.results || []);
        const highRisk = reports.filter(r => (r.risk_score || 0) >= 70).length;
        
        setStats({
          total: reports.length,
          highRisk,
          latest: reports.slice(0, 3)
        });
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  if (loading) return (
    <Layout>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
        <div className="skeleton" style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div style={{ maxWidth: "1000px", margin: "0 auto", paddingBottom: "60px" }}>
        
        {/* HERO HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            position: "relative",
            padding: "48px",
            borderRadius: "32px",
            background: "linear-gradient(135deg, rgba(0, 212, 170, 0.1) 0%, rgba(15, 23, 42, 0.4) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            marginBottom: "32px",
            overflow: "hidden"
          }}
        >
          {/* Background Glow */}
          <div style={{
            position: "absolute", top: "-50px", right: "-50px", width: "300px", height: "300px",
            background: "radial-gradient(circle, rgba(0, 212, 170, 0.15) 0%, transparent 70%)",
            filter: "blur(40px)",
            zIndex: 0
          }} />

          <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "32px" }}>
            <div style={{ 
              width: "120px", height: "120px", borderRadius: "40px",
              background: "linear-gradient(225deg, var(--accent) 0%, #009977 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "48px", fontWeight: "700", color: "#fff",
              boxShadow: "0 20px 40px rgba(0, 212, 170, 0.3)",
              border: "4px solid rgba(255, 255, 255, 0.1)"
            }}>
              {user?.email?.[0].toUpperCase()}
            </div>
            
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#fff", margin: 0, letterSpacing: "-0.03em" }}>
                  {user?.name || "Premium User"}
                </h1>
                {user?.is_subscribed ? (
                  <div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                    <div style={{ 
                      display: "flex", alignItems: "center", gap: "6px",
                      padding: "4px 12px 4px 6px", borderRadius: "20px",
                      background: "linear-gradient(135deg, rgba(0,212,170,0.15), rgba(37,99,235,0.1))",
                      border: "1px solid rgba(0,212,170,0.3)",
                      boxShadow: "0 0 12px rgba(0,212,170,0.15)"
                    }}>
                      <div style={{ width: "18px", height: "18px", borderRadius: "6px", background: "linear-gradient(135deg,#00d4aa,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <ShieldCheck size={10} color="#fff" />
                      </div>
                      <span style={{ fontSize: "11px", fontWeight: "800", color: "#fff", letterSpacing: "0.04em", textTransform: "uppercase" }}>Pro Subscriber</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ 
                    display: "flex", alignItems: "center", gap: "6px",
                    padding: "4px 10px", borderRadius: "20px",
                    background: "rgba(251,191,36,0.08)",
                    border: "1px solid rgba(251,191,36,0.2)"
                  }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fbbf24" }} />
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "#fbbf24", letterSpacing: "0.04em", textTransform: "uppercase" }}>Free Tier</span>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", color: "var(--text-secondary)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "15px" }}>
                  <Mail size={16} color="var(--accent)" />
                  {user?.email}
                </div>
                <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--border)" }} />
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "15px" }}>
                  <Shield size={16} color="var(--success)" />
                  Verified Auditor
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* STATS GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginBottom: "40px" }}>
          <StatCard 
            icon={<TrendingUp size={24} color="var(--accent)" />}
            label="Total Intelligence Audits"
            value={stats.total}
            delay={0.1}
          />
          <StatCard 
            icon={<Zap size={24} color="var(--danger)" />}
            label="High Risk Clauses Found"
            value={stats.highRisk}
            delay={0.2}
          />
          <StatCard 
            icon={<Award size={24} color="var(--warn)" />}
            label="Compliance Score"
            value="Silver"
            delay={0.3}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: "24px" }}>
          {/* LATEST ACTIVITY */}
          <Card style={{ padding: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Clock size={20} color="var(--accent)" />
                <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", margin: 0 }}>Recent Activity</h2>
              </div>
              <a href="/reports" style={{ fontSize: "13px", color: "var(--accent)", textDecoration: "none", fontWeight: "600" }}>
                View All History
              </a>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {stats.latest.length === 0 ? (
                <div style={{ padding: "40px 0", textAlign: "center", color: "var(--text-muted)" }}>
                  No recent audit activities recorded.
                </div>
              ) : (
                stats.latest.map((item, idx) => (
                  <ActivityItem key={idx} item={item} />
                ))
              )}
            </div>
          </Card>

          {/* SIDEBAR CARDS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* SECURITY CARD */}
            <Card style={{ 
              padding: "24px", 
              background: "linear-gradient(to bottom right, var(--bg-surface), rgba(0, 212, 170, 0.05))" 
            }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#fff", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
                <Shield size={18} color="var(--accent)" />
                Security Health
              </h3>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                   <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Audit Visibility</span>
                   <span style={{ fontSize: "13px", color: "var(--success)", fontWeight: "600" }}>Secured</span>
                </div>
                <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "3px" }}>
                   <div style={{ width: "85%", height: "100%", background: "var(--success)", borderRadius: "3px" }} />
                </div>
              </div>
              <a href="/settings" style={{ 
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                width: "100%", padding: "12px", borderRadius: "12px", background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--border)", color: "#fff", fontSize: "14px", fontWeight: "600",
                textDecoration: "none", transition: "0.2s"
              }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                Update Security Settings <ArrowRight size={14} />
              </a>
            </Card>

            {/* USAGE CARD */}
            <Card style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#fff", marginBottom: "8px" }}>Usage Overview</h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>Your current document processing footprint.</p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                <UsageRow label="Cloud Embeddings" value={`${stats.total * 5}/Unlimited`} />
                <UsageRow label="AI reasoning cycles" value="High Performance" />
              </div>

              {!user?.is_subscribed && (
                <button
                  onClick={() => navigate("/pricing")}
                  style={{
                    width: "100%", padding: "12px", borderRadius: "12px",
                    background: "var(--accent)", color: "#020617",
                    border: "none", fontSize: "14px", fontWeight: "700",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
                  }}
                >
                  Upgrade to Pro <Zap size={14} />
                </button>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ icon, label, value, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card hover={false} style={{ padding: "24px", textAlign: "center" }}>
        <div style={{ 
          width: "48px", height: "48px", borderRadius: "16px", background: "rgba(255,255,255,0.03)",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px"
        }}>
          {icon}
        </div>
        <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
          {label}
        </div>
        <div style={{ fontSize: "28px", fontWeight: "800", color: "#fff" }}>
          {value}
        </div>
      </Card>
    </motion.div>
  );
}

function ActivityItem({ item }) {
  return (
    <div style={{ 
      display: "flex", alignItems: "center", gap: "16px", padding: "12px", 
      borderRadius: "16px", background: "rgba(255,255,255,0.015)", border: "1px solid transparent",
      transition: "0.2s"
    }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}>
      <div style={{ 
        width: "40px", height: "40px", borderRadius: "12px", background: "rgba(0, 212, 170, 0.1)",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <User size={18} color="var(--accent)" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "14px", fontWeight: "600", color: "#fff" }}>
          Audit: {item.filename}
        </div>
        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
          {new Date(item.uploaded_at).toLocaleDateString()} • {item.rules_checked} rules validated
        </div>
      </div>
      <div style={{ 
        padding: "4px 8px", borderRadius: "8px", background: item.risk_score >= 70 ? "var(--danger-dim)" : "var(--success-dim)",
        color: item.risk_score >= 70 ? "var(--danger)" : "var(--success)", fontSize: "12px", fontWeight: "700"
      }}>
        Score: {item.risk_score}
      </div>
    </div>
  );
}

function UsageRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{label}</span>
      <span style={{ fontSize: "13px", fontWeight: "600", color: "#fff" }}>{value}</span>
    </div>
  );
}
