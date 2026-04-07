import Layout from "../components/layout/Layout";
import { useState, useEffect } from "react";
import useStore from "../utils/Store";
import { getAllAuditResult } from "../services/api";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import { motion } from "framer-motion";
import { FileText, ChevronRight, FileSearch, BarChart3, ShieldAlert, ShieldCheck, Activity } from "lucide-react";

export default function Reports() {
  const setTopBar = useStore(state => state.setTopBar);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTopBar("reports");
    async function load() {
      try {
        const result = await getAllAuditResult();
        setReports(Array.isArray(result) ? result : result.results || []);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalAudits = reports.length;
  const highRisk = reports.filter((r) => r.risk_score >= 70).length;
  const lowRisk = reports.filter((r) => r.risk_score < 40).length;
  const medRisk = totalAudits - highRisk - lowRisk;
  const avgScore = totalAudits > 0 ? Math.round(reports.reduce((a, r) => a + r.risk_score, 0) / totalAudits) : 0;

  return (
    <Layout>
      <div style={{ maxWidth: "1200px", margin: "auto" }}>
        {/* PREMIUM HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            marginBottom: "32px",
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--border)",
            background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(2, 6, 23, 0.98) 100%)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Ambient glows */}
          <div style={{ position: "absolute", top: "-60px", right: "-40px", width: "250px", height: "250px", borderRadius: "50%", background: "rgba(0, 212, 170, 0.06)", filter: "blur(80px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-40px", left: "10%", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(37, 99, 235, 0.05)", filter: "blur(70px)", pointerEvents: "none" }} />

          {/* Title Section */}
          <div style={{ padding: "28px 32px 0", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "10px",
                background: "linear-gradient(135deg, rgba(0,212,170,0.15), rgba(37,99,235,0.15))",
                border: "1px solid rgba(0, 212, 170, 0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <BarChart3 size={18} color="var(--accent)" />
              </div>
              <div>
                <h1 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                  Audit Reports
                </h1>
                <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "13px" }}>
                  AI compliance analysis results and history
                </p>
              </div>
            </div>
          </div>

          {/* Stat Cards Grid */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px",
            padding: "24px 32px 28px", position: "relative", zIndex: 1,
          }}>
            <StatCard
              icon={<Activity size={18} />}
              label="Total Audits"
              value={totalAudits}
              accentColor="#00d4aa"
              gradientFrom="rgba(0, 212, 170, 0.12)"
              gradientTo="rgba(0, 212, 170, 0.03)"
              borderColor="rgba(0, 212, 170, 0.18)"
              delay={0}
            />
            <StatCard
              icon={<ShieldAlert size={18} />}
              label="High Risk"
              value={highRisk}
              accentColor="#ef4444"
              gradientFrom="rgba(239, 68, 68, 0.12)"
              gradientTo="rgba(239, 68, 68, 0.03)"
              borderColor="rgba(239, 68, 68, 0.18)"
              delay={0.05}
            />
            <StatCard
              icon={<ShieldCheck size={18} />}
              label="Low Risk"
              value={lowRisk}
              accentColor="#22c55e"
              gradientFrom="rgba(34, 197, 94, 0.12)"
              gradientTo="rgba(34, 197, 94, 0.03)"
              borderColor="rgba(34, 197, 94, 0.18)"
              delay={0.1}
            />
            <StatCard
              icon={<BarChart3 size={18} />}
              label="Avg. Score"
              value={avgScore}
              accentColor="#3b82f6"
              gradientFrom="rgba(59, 130, 246, 0.12)"
              gradientTo="rgba(59, 130, 246, 0.03)"
              borderColor="rgba(59, 130, 246, 0.18)"
              suffix="%"
              delay={0.15}
            />
          </div>

          {/* Bottom progress bar (visual flourish) */}
          <div style={{ height: "3px", background: "rgba(255,255,255,0.03)", position: "relative", overflow: "hidden" }}>
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: totalAudits > 0 ? "100%" : "0%" }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              style={{
                height: "100%",
                background: "linear-gradient(90deg, #00d4aa, #2563eb, #00d4aa)",
                backgroundSize: "200% 100%",
                animation: "gradientShift 3s ease infinite",
                borderRadius: "0 2px 2px 0",
              }}
            />
          </div>
        </motion.div>

        {/* TABLE */}
        <Card style={{ padding: "0", overflow: "hidden" }} hover={false}>
          {/* HEADER */}
          <div style={{
            display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr",
            padding: "16px 24px", fontSize: "11px", color: "var(--text-muted)",
            fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em",
            borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.015)"
          }}>
            <div>Document</div>
            <div>Risk Score</div>
            <div>Rules Run</div>
            <div>Audit Date</div>
          </div>

          {/* BODY */}
          {loading ? (
              <div>
                {[...Array(5)].map((_, i) => (
                  <div key={i} style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr", gap: "16px", alignItems: "center" }}>
                    <Skeleton height="16px" style={{ width: "80%" }}/>
                    <Skeleton height="16px" style={{ width: "50%" }}/>
                    <Skeleton height="16px" style={{ width: "40%" }}/>
                    <Skeleton height="16px" style={{ width: "80%" }}/>
                  </div>
                ))}
              </div>
          ) : reports.length === 0 ? (
            <div style={{ padding: "40px" }}>
              <EmptyState 
                icon={<FileSearch size={24} />}
                title="No reports generated"
                description="Upload a document and trigger an audit to generate your first AI compliance report."
                actionText="Go to Dashboard"
                onAction={() => navigate("/")}
                style={{ border: "none" }}
              />
            </div>
          ) : (
            reports.map((report) => (
              <ReportRow key={report.document} report={report} navigate={navigate} />
            ))
          )}
        </Card>
      </div>

      {/* Inline keyframes for gradient animation */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </Layout>
  );
}

function ReportRow({ report, navigate }) {
  const [isHovered, setIsHovered] = useState(false);

  const getRiskColor = (score) => {
    if (score >= 70) return "var(--danger)";
    if (score >= 40) return "var(--warn)";
    return "var(--success)";
  };
  
  const getRiskBg = (score) => {
    if (score >= 70) return "var(--danger-dim)";
    if (score >= 40) return "var(--warn-dim)";
    return "var(--success-dim)";
  };

  const riskColor = getRiskColor(report.risk_score);
  const riskBg = getRiskBg(report.risk_score);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/report/${report.document}`)}
      style={{
        display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr",
        padding: "16px 24px", borderBottom: "1px solid var(--border)",
        alignItems: "center", cursor: "pointer", transition: "background var(--ease-out)",
        background: isHovered ? "var(--bg-surface-hover)" : "transparent"
      }}
    >
      {/* DOCUMENT */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "10px", border: "1px solid var(--border)" }}>
           <FileText size={16} color="var(--text-secondary)" />
        </div>
        <div>
          <div style={{ fontWeight: "500", fontSize: "14px", color: "var(--text-primary)", marginBottom: "2px" }}>
            {report.filename || "Contract Document"}
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "monospace" }}>
            {report.document.substring(0, 16)}...
          </div>
        </div>
      </div>

      {/* RISK */}
      <div>
        <div style={{
          display: "inline-flex", padding: "4px 10px", borderRadius: "var(--radius-xl)",
          fontSize: "12px", fontWeight: "600",
          background: riskBg, color: riskColor, border: `1px solid ${riskColor}33`,
        }}>
          {report.risk_score}
        </div>
      </div>

      {/* RULES */}
      <div style={{ color: "var(--text-secondary)", fontSize: "14px", fontWeight: "500" }}>
        {report.rules_checked}
      </div>

      {/* DATE */}
      <div style={{ color: "var(--text-muted)", fontSize: "13px" }}>
        {report.uploaded_at ? new Date(report.uploaded_at).toLocaleDateString() : "Just now"}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, accentColor, gradientFrom, gradientTo, borderColor, suffix = "", delay = 0 }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderRadius: "var(--radius-lg)",
        border: `1px solid ${isHovered ? borderColor : "var(--border)"}`,
        background: `linear-gradient(145deg, ${gradientFrom}, ${gradientTo})`,
        padding: "20px",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        transition: "border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: isHovered ? `0 8px 24px ${gradientFrom}` : "none",
      }}
    >
      {/* Subtle corner glow on hover */}
      <div style={{
        position: "absolute", top: "-20px", right: "-20px",
        width: "80px", height: "80px", borderRadius: "50%",
        background: accentColor, opacity: isHovered ? 0.08 : 0.03,
        filter: "blur(25px)", transition: "opacity 0.3s ease",
        pointerEvents: "none",
      }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", position: "relative", zIndex: 1 }}>
        <div style={{
          width: "34px", height: "34px", borderRadius: "9px",
          background: `linear-gradient(135deg, ${gradientFrom}, transparent)`,
          border: `1px solid ${borderColor}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: accentColor,
        }}>
          {icon}
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{
          fontSize: "28px", fontWeight: "800", color: "var(--text-primary)",
          letterSpacing: "-0.03em", lineHeight: 1,
          marginBottom: "4px",
        }}>
          {value}{suffix}
        </div>
        <div style={{
          fontSize: "12px", color: "var(--text-muted)", fontWeight: "500",
          textTransform: "uppercase", letterSpacing: "0.04em",
        }}>
          {label}
        </div>
      </div>

      {/* Accent bottom line */}
      <div style={{
        position: "absolute", bottom: 0, left: "20px", right: "20px", height: "2px",
        background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        opacity: isHovered ? 0.5 : 0.15,
        transition: "opacity 0.3s ease",
      }} />
    </motion.div>
  );
}
