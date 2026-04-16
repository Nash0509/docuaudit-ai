import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import useStore from "../utils/Store";
import { getAuditResult } from "../services/api";
import useMediaQuery from "../utils/useMediaQuery";
import {
  AlertCircle, ChevronDown, CheckCircle, XCircle,
  AlertTriangle, ArrowLeft, Printer, Shield, FileText, TrendingUp
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

/* ─────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────── */
function AnimatedNumber({ value, duration = 1.2 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    const step = end / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [value]);
  return <>{display}</>;
}

/* ─────────────────────────────────────────────
   PREMIUM RISK GAUGE
───────────────────────────────────────────── */
function RiskGauge({ score }) {
  const clampedScore = Math.min(100, Math.max(0, score));
  const isHigh = clampedScore >= 70;
  const isMed = clampedScore >= 40;

  const label = isHigh ? "High Risk" : isMed ? "Medium Risk" : "Low Risk";
  const accentColor = isHigh ? "#f87171" : isMed ? "#fb923c" : "#34d399";
  const glowColor = isHigh
    ? "rgba(248,113,113,0.35)"
    : isMed
      ? "rgba(251,146,60,0.35)"
      : "rgba(52,211,153,0.35)";

  // SVG arc math
  const R = 52;
  const cx = 70;
  const cy = 72;
  const startAngle = -210;
  const totalAngle = 240;
  const angle = startAngle + (clampedScore / 100) * totalAngle;

  function polarToXY(deg, r) {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function describeArc(startDeg, endDeg, r) {
    const s = polarToXY(startDeg, r);
    const e = polarToXY(endDeg, r);
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  }

  const trackEnd = startAngle + totalAngle;
  const needle = polarToXY(angle, 38);
  const needleBase1 = polarToXY(angle + 90, 5);
  const needleBase2 = polarToXY(angle - 90, 5);

  return (
    <div className="gauge-wrapper" style={{ position: "relative", width: 140, height: 140 }}>
      {/* Glow */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        boxShadow: `0 0 40px 12px ${glowColor}`,
        pointerEvents: "none", zIndex: 0,
      }} />
      <svg width={140} height={140} viewBox="0 0 140 140" style={{ position: "relative", zIndex: 1 }}>
        <defs>
          <linearGradient id="track-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="50%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#f87171" />
          </linearGradient>
          <filter id="blur-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Track background */}
        <path
          d={describeArc(startAngle, trackEnd, R)}
          fill="none"
          stroke="var(--gauge-track)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Colored progress arc */}
        <motion.path
          d={describeArc(startAngle, trackEnd, R)}
          fill="none"
          stroke="url(#track-grad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * R}
          initial={{ strokeDashoffset: 2 * Math.PI * R }}
          animate={{ strokeDashoffset: 2 * Math.PI * R * (1 - clampedScore / 100) }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          style={{ filter: "url(#blur-glow)" }}
        />
        {/* Needle */}
        <motion.polygon
          points={`${needle.x},${needle.y} ${needleBase1.x},${needleBase1.y} ${needleBase2.x},${needleBase2.y}`}
          fill={accentColor}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.4 }}
        />
        {/* Center hub */}
        <circle cx={cx} cy={cy} r={6} fill={accentColor} />
        <circle cx={cx} cy={cy} r={3} fill="var(--gauge-hub)" />

        {/* Score text */}
        <text x={cx} y={cy + 22} textAnchor="middle" fontSize="22" fontWeight="700"
          fill={accentColor} fontFamily="'DM Mono', monospace">{clampedScore}</text>
        <text x={cx} y={cy + 36} textAnchor="middle" fontSize="9" fontWeight="600"
          fill="var(--text-muted)" letterSpacing="0.1em" textTransform="uppercase">{label.toUpperCase()}</text>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, delay = 0, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="stat-card"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        borderRadius: 18,
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      whileHover={{ y: -3, boxShadow: "var(--card-shadow-hover)" }}
    >
      {/* Subtle accent glow top-right */}
      <div style={{
        position: "absolute", top: -20, right: -20,
        width: 80, height: 80, borderRadius: "50%",
        background: accent || "var(--accent-glow)",
        filter: "blur(28px)", opacity: 0.5, pointerEvents: "none",
      }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</span>
        {Icon && (
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "var(--icon-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon size={15} color="var(--text-muted)" />
          </div>
        )}
      </div>
      <div style={{ fontSize: 38, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1, letterSpacing: "-0.02em", fontFamily: "'DM Mono', monospace" }}>
        <AnimatedNumber value={value} />
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   FILTER TAB
───────────────────────────────────────────── */
function FilterTab({ text, count, active, onClick, color }) {
  const colors = {
    all: { fg: "#818cf8", bg: "rgba(129,140,248,0.12)", border: "rgba(129,140,248,0.3)" },
    fail: { fg: "#f87171", bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.3)" },
    warn: { fg: "#fb923c", bg: "rgba(251,146,60,0.12)", border: "rgba(251,146,60,0.3)" },
    pass: { fg: "#34d399", bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.3)" },
  };
  const c = colors[color] || colors.all;
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600,
        background: active ? c.bg : "transparent",
        color: active ? c.fg : "var(--text-muted)",
        border: `1px solid ${active ? c.border : "transparent"}`,
        cursor: "pointer", transition: "all 0.18s ease",
      }}
    >
      {text}
      <span style={{
        padding: "2px 8px", borderRadius: 20, fontSize: 11,
        background: active ? c.fg : "var(--pill-bg)",
        color: active ? "#fff" : "var(--text-muted)",
        transition: "all 0.18s ease",
      }}>
        {count}
      </span>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   RULE CARD
───────────────────────────────────────────── */
function RuleCard({ rule, index }) {
  const [open, setOpen] = useState(false);

  const statusMap = {
    FAIL: { bg: "rgba(248,113,113,0.12)", text: "#f87171", border: "rgba(248,113,113,0.3)", icon: <XCircle size={13} />, label: "Fail" },
    WARN: { bg: "rgba(251,146,60,0.12)", text: "#fb923c", border: "rgba(251,146,60,0.3)", icon: <AlertTriangle size={13} />, label: "Warn" },
    PASS: { bg: "rgba(52,211,153,0.12)", text: "#34d399", border: "rgba(52,211,153,0.3)", icon: <CheckCircle size={13} />, label: "Pass" },
  };
  const sevMap = {
    HIGH: { text: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.25)" },
    MEDIUM: { text: "#fb923c", bg: "rgba(251,146,60,0.1)", border: "rgba(251,146,60,0.25)" },
    LOW: { text: "var(--text-muted)", bg: "var(--pill-bg)", border: "var(--card-border)" },
  };
  const s = statusMap[rule.status] || statusMap.PASS;
  const sv = sevMap[rule.severity] || sevMap.LOW;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => setOpen(!open)}
      style={{
        background: "var(--card-bg)",
        border: `1px solid ${open ? "var(--card-border-active)" : "var(--card-border)"}`,
        borderRadius: 16,
        marginBottom: 10,
        overflow: "hidden",
        cursor: "pointer",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        boxShadow: open ? "var(--card-shadow)" : "none",
      }}
      whileHover={{ boxShadow: "var(--card-shadow)" }}
    >
      {/* Card Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "16px 20px", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
          <motion.div
            animate={{ rotate: open ? 0 : -90 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ flexShrink: 0, color: "var(--text-muted)" }}
          >
            <ChevronDown size={15} />
          </motion.div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.4 }}>{rule.rule_name}</div>
            {!open && (
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {rule.finding || "No finding details provided."}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
            background: s.bg, color: s.text, border: `1px solid ${s.border}`,
          }}>
            {s.icon} {s.label}
          </span>
          {rule.severity && (
            <span style={{
              padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
              background: sv.bg, color: sv.text, border: `1px solid ${sv.border}`,
            }}>
              {rule.severity}
            </span>
          )}
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              padding: "16px 20px 20px",
              borderTop: "1px solid var(--card-border)",
              background: "var(--card-inner-bg)",
              display: "flex", flexDirection: "column", gap: 16,
            }}>
              {rule.finding && (
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 7 }}>Finding</div>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>{rule.finding}</p>
                </div>
              )}
              {rule.citation && (
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 7 }}>Document Citation</div>
                  <blockquote style={{
                    fontSize: 13.5, color: "var(--text-muted)", fontStyle: "italic",
                    borderLeft: "2px solid var(--accent-indigo)", paddingLeft: 14,
                    margin: 0, lineHeight: 1.7, borderRadius: 0,
                  }}>
                    "{rule.citation}"
                  </blockquote>
                </div>
              )}
              {rule.recommendation && (
                <div style={{
                  background: "var(--suggestion-bg)",
                  border: "1px solid var(--suggestion-border)",
                  borderRadius: 10, padding: "12px 14px",
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--accent-indigo)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>AI Recommendation</div>
                  <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>{rule.recommendation}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   SKELETON LOADER
───────────────────────────────────────────── */
function Skeleton({ height, borderRadius = 12, style = {} }) {
  return (
    <div style={{
      height, borderRadius,
      background: "var(--skeleton-bg)",
      backgroundImage: "linear-gradient(90deg, var(--skeleton-bg) 0%, var(--skeleton-shine) 50%, var(--skeleton-bg) 100%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.6s infinite",
      ...style,
    }} />
  );
}

/* ─────────────────────────────────────────────
   MAIN REPORT PAGE
───────────────────────────────────────────── */
export default function Report() {
  const setTopBar = useStore((state) => state.setTopBar);
  const globalTheme = useStore((state) => state.theme);
  const toggleGlobalTheme = useStore((state) => state.toggleTheme);
  
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    setTopBar("reports");
    (async () => {
      try { setReport(await getAuditResult(id)); }
      catch (e) { console.log(e); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const filteredResults = report?.results?.filter((r) => filter === "ALL" || r.status === filter) ?? [];

  const isDark = globalTheme === "dark";

  const cssVars = isDark
    ? {
      "--page-bg": "#0c0c0e",
      "--card-bg": "rgba(255,255,255,0.04)",
      "--card-inner-bg": "rgba(255,255,255,0.025)",
      "--card-border": "rgba(255,255,255,0.09)",
      "--card-border-active": "rgba(255,255,255,0.18)",
      "--card-shadow": "0 8px 32px rgba(0,0,0,0.5)",
      "--card-shadow-hover": "0 16px 48px rgba(0,0,0,0.6)",
      "--text-primary": "#f1f0f0",
      "--text-secondary": "#a0a0b0",
      "--text-muted": "#5a5a70",
      "--icon-bg": "rgba(255,255,255,0.07)",
      "--pill-bg": "rgba(255,255,255,0.07)",
      "--gauge-track": "rgba(255,255,255,0.08)",
      "--gauge-hub": "#0c0c0e",
      "--accent-indigo": "#818cf8",
      "--accent-glow": "rgba(129,140,248,0.25)",
      "--suggestion-bg": "rgba(129,140,248,0.08)",
      "--suggestion-border": "rgba(129,140,248,0.2)",
      "--skeleton-bg": "rgba(255,255,255,0.05)",
      "--skeleton-shine": "rgba(255,255,255,0.1)",
      "--divider": "rgba(255,255,255,0.07)",
      "--header-bg": "rgba(12,12,14,0.85)",
      "--mono-font": "'DM Mono', monospace",
    }
    : {
      "--page-bg": "#f4f3f0",
      "--card-bg": "#ffffff",
      "--card-inner-bg": "#f9f8f6",
      "--card-border": "rgba(0,0,0,0.08)",
      "--card-border-active": "rgba(0,0,0,0.16)",
      "--card-shadow": "0 4px 20px rgba(0,0,0,0.08)",
      "--card-shadow-hover": "0 12px 36px rgba(0,0,0,0.14)",
      "--text-primary": "#111118",
      "--text-secondary": "#4a4a60",
      "--text-muted": "#9090a8",
      "--icon-bg": "rgba(0,0,0,0.05)",
      "--pill-bg": "rgba(0,0,0,0.06)",
      "--gauge-track": "rgba(0,0,0,0.08)",
      "--gauge-hub": "#f4f3f0",
      "--accent-indigo": "#6366f1",
      "--accent-glow": "rgba(99,102,241,0.18)",
      "--suggestion-bg": "rgba(99,102,241,0.06)",
      "--suggestion-border": "rgba(99,102,241,0.18)",
      "--skeleton-bg": "#e8e7e3",
      "--skeleton-shine": "#f0efeb",
      "--divider": "rgba(0,0,0,0.07)",
      "--header-bg": "rgba(244,243,240,0.85)",
      "--mono-font": "'DM Mono', monospace",
    };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        * { font-family: 'DM Sans', sans-serif; }
        .rule-card:hover { border-color: var(--card-border-active) !important; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--divider); border-radius: 4px; }
      `}</style>

      <div style={{ ...cssVars, background: "var(--page-bg)", minHeight: "100vh", color: "var(--text-primary)" }}>
        <Layout>
          {loading ? (
            <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 0", display: "flex", flexDirection: "column", gap: 18 }}>
              <Skeleton height={96} borderRadius={18} />
              <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 14 }}>
                <Skeleton height={180} borderRadius={18} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                  {[0, 1, 2].map(i => <Skeleton key={i} height={180} borderRadius={18} />)}
                </div>
              </div>
              {[220, 180, 180].map((h, i) => <Skeleton key={i} height={h} borderRadius={16} />)}
            </div>
          ) : !report ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ maxWidth: 420, margin: "80px auto", textAlign: "center" }}
            >
              <div style={{ width: 72, height: 72, borderRadius: 20, background: "var(--card-bg)", border: "1px solid var(--card-border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <AlertCircle size={28} color="var(--text-muted)" />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>Report Not Found</h2>
              <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24 }}>This report may have been deleted or doesn't exist.</p>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/reports")}
                style={{ padding: "10px 20px", borderRadius: 10, background: "var(--accent-indigo)", color: "#fff", border: "none", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
              >
                Back to Reports
              </motion.button>
            </motion.div>
          ) : (
            <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 0 64px", display: "flex", flexDirection: "column", gap: 20 }}>

              {/* ── Header Card ── */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--card-border)",
                  borderRadius: 20,
                  padding: "22px 28px",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 20,
                  backdropFilter: "blur(12px)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Top gradient line */}
                <div style={{
                  position: "absolute", top: 0, left: 28, right: 28, height: 1,
                  background: "linear-gradient(90deg, transparent, var(--accent-indigo), transparent)",
                  opacity: 0.5,
                }} />

                <div>
                  <motion.button
                    whileHover={{ x: -3 }}
                    onClick={() => navigate("/reports")}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      fontSize: 12, color: "var(--text-muted)", background: "none",
                      border: "none", cursor: "pointer", marginBottom: 14, padding: 0,
                    }}
                  >
                    <ArrowLeft size={13} /> Back to Reports
                  </motion.button>

                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--suggestion-bg)", border: "1px solid var(--suggestion-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <FileText size={16} color="var(--accent-indigo)" />
                    </div>
                    <h1 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", margin: 0, lineHeight: 1.3 }}>
                      {report?.filename || "Audit Report"}
                    </h1>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{
                      fontSize: 11, fontFamily: "var(--mono-font)", padding: "4px 10px",
                      borderRadius: 6, background: "var(--icon-bg)", color: "var(--text-muted)",
                      border: "1px solid var(--card-border)",
                    }}>
                      {(report.document || id).substring(0, 8)}…
                    </span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {new Date(report.uploaded_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {/* Theme toggle */}
                  <motion.button
                    whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                    onClick={toggleGlobalTheme}
                    style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: "var(--icon-bg)", border: "1px solid var(--card-border)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", fontSize: 16,
                    }}
                  >
                    {isDark ? "☀️" : "🌙"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => window.print()}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "9px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                      background: "var(--suggestion-bg)", border: "1px solid var(--suggestion-border)",
                      color: "var(--accent-indigo)", cursor: "pointer",
                    }}
                  >
                    <Printer size={14} /> Export PDF
                  </motion.button>
                </div>
              </motion.div>

              {/* ── Summary Row ── */}
              <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 16 }}>
                {/* Risk Gauge Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--card-border)",
                    borderRadius: 20,
                    padding: "24px 20px",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
                    position: "relative", overflow: "hidden",
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Risk Score</div>
                  <RiskGauge score={report.risk_score} />
                </motion.div>

                {/* Stat Cards */}
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", 
                  gap: 14,
                  flex: 1 
                }}>
                  <StatCard label="Rules Checked" value={report?.rules_checked || 0} icon={Shield} delay={0.15} accent="rgba(129,140,248,0.2)" />
                  <StatCard label="Failures" value={report?.results?.filter(r => r.status === "FAIL").length || 0} icon={XCircle} delay={0.22} accent="rgba(248,113,113,0.2)" />
                  <StatCard label="Warnings" value={report?.results?.filter(r => r.status === "WARN").length || 0} icon={AlertTriangle} delay={0.29} accent="rgba(251,146,60,0.2)" />
                </div>
              </div>

              {/* ── Filter Tabs ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  paddingBottom: 16, borderBottom: "1px solid var(--divider)", flexWrap: "wrap",
                }}
              >
                <FilterTab text="All Results" count={report.results.length} active={filter === "ALL"} onClick={() => setFilter("ALL")} color="all" />
                <FilterTab text="Failures" count={report.results.filter(r => r.status === "FAIL").length} active={filter === "FAIL"} onClick={() => setFilter("FAIL")} color="fail" />
                <FilterTab text="Warnings" count={report.results.filter(r => r.status === "WARN").length} active={filter === "WARN"} onClick={() => setFilter("WARN")} color="warn" />
                <FilterTab text="Passed" count={report.results.filter(r => r.status === "PASS").length} active={filter === "PASS"} onClick={() => setFilter("PASS")} color="pass" />
              </motion.div>

              {/* ── Rule Cards ── */}
              <div>
                <AnimatePresence mode="wait">
                  {filteredResults.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ textAlign: "center", padding: "48px 0", color: "var(--text-muted)", fontSize: 14 }}
                    >
                      No rules match the selected filter.
                    </motion.div>
                  ) : (
                    <motion.div key={filter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                      {filteredResults.map((r, i) => <RuleCard key={r.rule_id} rule={r} index={i} />)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          )}
        </Layout>
      </div>
    </>
  );
}
