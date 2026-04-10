import {
  LayoutDashboard, FileText, ShieldCheck,
  BarChart2, Settings, User, Zap
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import useStore from "../../utils/Store";
import useShortcut from "../../utils/useShortcut";

const navItems = [
  { key: "dashboard", label: "Dashboard", path: "/", icon: LayoutDashboard },
  { key: "documents", label: "Documents", path: "/documents", icon: FileText, shortcut: "D" },
  { key: "reports", label: "Audit Reports", path: "/reports", icon: BarChart2 },
  { key: "rules", label: "Rules", path: "/rules", icon: ShieldCheck, shortcut: "R" },
  { key: "settings", label: "Settings", path: "/settings", icon: Settings },
  { key: "profile", label: "Profile", path: "/profile", icon: User, shortcut: "P" },
];

function NavItem({ item, active, onClick }) {
  const Icon = item.icon;
  
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 12px",
        borderRadius: "var(--radius-md)",
        color: active ? "var(--text-primary)" : "var(--text-muted)",
        cursor: "pointer",
        marginBottom: "4px",
        transition: "color 0.15s ease",
        fontSize: "14px",
        fontWeight: active ? "500" : "400",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        if (!active) { e.currentTarget.style.color = "var(--text-secondary)"; }
      }}
      onMouseLeave={(e) => {
        if (!active) { e.currentTarget.style.color = "var(--text-muted)"; }
      }}
    >
      {active && (
        <motion.div
          layoutId="sidebar-active"
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--bg-surface-hover)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            zIndex: 0,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
      
      <div style={{ display: "flex", alignItems: "center", gap: "10px", position: "relative", zIndex: 1 }}>
        <Icon size={16} strokeWidth={active ? 2.5 : 2} style={{ color: active ? "var(--accent)" : "inherit" }} />
        <span>{item.label}</span>
      </div>

      {item.shortcut && (
        <div style={{ position: "relative", zIndex: 1 }}>
          <kbd style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "4px",
            padding: "2px 5px",
            fontSize: "10px",
            fontWeight: "600",
            color: "var(--text-muted)",
            fontFamily: "monospace",
            opacity: active ? 1 : 0.5
          }}>
            ⌘{item.shortcut}
          </kbd>
        </div>
      )}
    </div>
  );
}

import useMediaQuery from "../../utils/useMediaQuery";

// ... inside Sidebar component ...

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const setTopBar = useStore((state) => state.setTopBar);
  const user = useStore((state) => state.user);
  
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const isSidebarOpen = useStore((state) => state.isSidebarOpen);
  const setIsSidebarOpen = useStore((state) => state.setIsSidebarOpen);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div 
        onClick={() => {
          setTopBar("dashboard");
          navigate("/");
          if (isMobile) setIsSidebarOpen(false);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "32px",
          padding: "8px 12px",
          borderRadius: "12px",
          cursor: "pointer",
          transition: "background 0.2s ease, transform 0.1s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        <img 
          src="/logo.png" 
          alt="DocuAudit Logo" 
          style={{ width: "32px", height: "32px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0, 212, 170, 0.2)", flexShrink: 0 }} 
        />
        <div>
          <div style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            DocuAudit
          </div>
          <div style={{ fontSize: "10px", color: "var(--accent)", fontWeight: "800", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            AI Framework
          </div>
        </div>
      </div>

      {/* Nav section label */}
      <div style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0 12px", marginBottom: "8px" }}>
        Overview
      </div>

      {/* Nav Items */}
      <div style={{ flex: 1 }}>
        {navItems.map((item) => (
          <NavItem
            key={item.key}
            item={item}
            active={location.pathname === item.path}
            onClick={() => {
              setTopBar(item.key);
              navigate(item.path);
              if (isMobile) setIsSidebarOpen(false);
            }}
          />
        ))}
      </div>
      {/* ... rest of content handled in full code below ... */}
    </>
  );

  return (
    <motion.div
      initial={isMobile ? { x: "-100%" } : { x: 0 }}
      animate={isMobile ? { x: isSidebarOpen ? 0 : "-100%" } : { x: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      style={{
        width: "240px",
        flexShrink: 0,
        background: "rgba(2, 6, 23, 0.98)",
        borderRight: "1px solid var(--border)",
        padding: "20px 16px",
        height: "100vh",
        position: isMobile ? "fixed" : "sticky",
        top: 0,
        left: 0,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        boxShadow: isMobile && isSidebarOpen ? "20px 0 50px rgba(0,0,0,0.5)" : "none",
      }}
    >
      {sidebarContent}
      {/* ... bottom items moved into sidebarContent for clarity ... */}


      {/* Bottom Upgrade / Status block */}
      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
        
        {user?.is_subscribed ? (
          /* PRO BADGE */
          <div style={{
            position: "relative",
            padding: "14px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, rgba(0,212,170,0.12) 0%, rgba(37,99,235,0.08) 100%)",
            border: "1px solid rgba(0,212,170,0.25)",
            overflow: "hidden",
          }}>
            {/* shimmer line at top */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(0,212,170,0.8), transparent)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "30px", height: "30px", borderRadius: "10px", flexShrink: 0,
                background: "linear-gradient(135deg, #00d4aa, #2563eb)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 12px rgba(0,212,170,0.4)"
              }}>
                <ShieldCheck size={15} color="#fff" />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ fontSize: "13px", fontWeight: "800", color: "#fff", letterSpacing: "-0.01em" }}>Pro</div>
                  <div style={{
                    fontSize: "9px", fontWeight: "700", padding: "1px 5px",
                    background: "linear-gradient(90deg,#00d4aa,#2563eb)", color: "#000",
                    borderRadius: "4px", letterSpacing: "0.05em", textTransform: "uppercase"
                  }}>Active</div>
                </div>
                <div style={{ fontSize: "10px", color: "rgba(0,212,170,0.7)", marginTop: "1px" }}>Unlimited Audits · All Features</div>
              </div>
            </div>
          </div>
        ) : (
          /* FREE TIER UPGRADE CARD */
          <div
            onClick={() => { setTopBar("pricing"); navigate("/pricing"); }}
            style={{
              position: "relative",
              padding: "14px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.08)",
              cursor: "pointer",
              overflow: "hidden",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(0,212,170,0.3)";
              e.currentTarget.style.background = "rgba(0,212,170,0.04)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.background = "rgba(255,255,255,0.025)";
            }}
          >
            {/* usage bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-primary)", letterSpacing: "0.01em" }}>Free Tier</span>
              <span style={{
                fontSize: "9px", fontWeight: "700", padding: "2px 7px",
                background: (user?.audit_count || 0) >= 1 ? "rgba(239,68,68,0.15)" : "rgba(251,191,36,0.15)",
                color: (user?.audit_count || 0) >= 1 ? "#f87171" : "#fbbf24",
                border: `1px solid ${(user?.audit_count || 0) >= 1 ? "rgba(239,68,68,0.3)" : "rgba(251,191,36,0.3)"}`,
                borderRadius: "5px", letterSpacing: "0.03em"
              }}>
                {user?.audit_count || 0}/1 USED
              </span>
            </div>
            {/* progress bar */}
            <div style={{ height: "3px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", marginBottom: "10px" }}>
              <div style={{
                height: "100%", borderRadius: "2px",
                width: `${Math.min((user?.audit_count || 0) * 100, 100)}%`,
                background: (user?.audit_count || 0) >= 1
                  ? "linear-gradient(90deg,#ef4444,#f97316)"
                  : "linear-gradient(90deg,#fbbf24,#f59e0b)",
                transition: "width 0.5s ease"
              }} />
            </div>
            <div style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "10px", lineHeight: 1.5 }}>
              Get unlimited audits, priority AI, and email reports.
            </div>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "5px",
              padding: "7px", borderRadius: "8px",
              background: "linear-gradient(135deg,rgba(0,212,170,0.15),rgba(37,99,235,0.1))",
              border: "1px solid rgba(0,212,170,0.2)",
              fontSize: "11px", fontWeight: "700", color: "var(--accent)",
            }}>
              <Zap size={11} /> Upgrade to Pro · ₹99/mo
            </div>
          </div>
        )}

        <div style={{ padding: "10px 0 0", borderTop: "1px dashed var(--border)", display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--success)", boxShadow: "0 0 4px var(--success)" }} />
            <div style={{ fontSize: "11px", fontWeight: "500", color: "var(--text-secondary)" }}>Systems Local</div>
          </div>
          <div style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "monospace" }}>v1.0.3 · Stable</div>
        </div>
      </div>
    </div>
  );
}
