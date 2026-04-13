import useMediaQuery from "../../utils/useMediaQuery";
import {
  LayoutDashboard, FileText, ShieldCheck,
  BarChart2, Settings, User, Zap, ChevronLeft, ChevronRight
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useStore from "../../utils/Store";

const navItems = [
  { key: "dashboard", label: "Dashboard", path: "/", icon: LayoutDashboard },
  { key: "documents", label: "Documents", path: "/documents", icon: FileText, shortcut: "D" },
  { key: "reports", label: "Audit Reports", path: "/reports", icon: BarChart2 },
  { key: "rules", label: "Rules", path: "/rules", icon: ShieldCheck, shortcut: "R" },
  { key: "settings", label: "Settings", path: "/settings", icon: Settings },
  { key: "profile", label: "Profile", path: "/profile", icon: User, shortcut: "P" },
];

function NavItem({ item, active, onClick, minimized }) {
  const Icon = item.icon;

  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: minimized ? "center" : "space-between",
        padding: minimized ? "10px" : "8px 12px",
        borderRadius: "var(--radius-md)",
        color: active ? "var(--accent)" : "var(--text-muted)",
        cursor: "pointer",
        marginBottom: "6px",
        transition: "all 0.15s ease",
        fontSize: "14px",
        fontWeight: active ? "600" : "500",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        if (!active) { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--bg-surface-hover)"; }
      }}
      onMouseLeave={(e) => {
        if (!active) { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; }
      }}
      title={minimized ? item.label : undefined}
    >
      {active && (
        <motion.div
          layoutId="sidebar-active"
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--accent-light)",
            border: "1px solid var(--border-accent)",
            borderRadius: "var(--radius-md)",
            zIndex: 0,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "10px", position: "relative", zIndex: 1 }}>
        <Icon size={18} strokeWidth={active ? 2.5 : 2} style={{ color: active ? "var(--accent)" : "inherit" }} />
        {!minimized && <span>{item.label}</span>}
      </div>

      {!minimized && item.shortcut && (
        <div style={{ position: "relative", zIndex: 1 }}>
          <kbd style={{
            background: "var(--bg-surface-hover)",
            border: "1px solid var(--border)",
            borderRadius: "4px",
            padding: "2px 5px",
            fontSize: "10px",
            fontWeight: "600",
            color: "var(--text-muted)",
            fontFamily: "monospace"
          }}>
            ⌘{item.shortcut}
          </kbd>
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const setTopBar = useStore((state) => state.setTopBar);
  const user = useStore((state) => state.user);

  const isMobile = useMediaQuery("(max-width: 1024px)");
  const isSidebarOpen = useStore((state) => state.isSidebarOpen);
  const setIsSidebarOpen = useStore((state) => state.setIsSidebarOpen);
  
  const isSidebarMinimized = useStore((state) => state.isSidebarMinimized);
  const toggleSidebarMinimized = useStore((state) => state.toggleSidebarMinimized);
  
  // Force expand on mobile
  const minimized = isMobile ? false : isSidebarMinimized;
  const sidebarWidth = minimized ? 80 : 256;

  return (
    <motion.div
      initial={isMobile ? { x: "-100%" } : { x: 0, width: sidebarWidth }}
      animate={isMobile ? { x: isSidebarOpen ? 0 : "-100%" } : { x: 0, width: sidebarWidth }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      style={{
        flexShrink: 0,
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border)",
        height: "100vh",
        position: isMobile ? "fixed" : "sticky",
        top: 0,
        left: 0,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        boxShadow: isMobile && isSidebarOpen ? "20px 0 50px rgba(0,0,0,0.2)" : "none",
        overflow: "hidden"
      }}
    >
      <div style={{ padding: minimized ? "20px 12px" : "20px 20px", display: "flex", flexDirection: "column", height: "100%" }}>
        
        {/* Header / Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: minimized ? "center" : "space-between", marginBottom: 32 }}>
          <div
            onClick={() => { setTopBar("dashboard"); navigate("/"); if (isMobile) setIsSidebarOpen(false); }}
            style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 12px var(--accent-light)" }}>
              <ShieldCheck size={20} color="#fff" strokeWidth={2.5} />
            </div>
            {!minimized && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ whiteSpace: "nowrap" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                  DocuAudit
                </div>
                <div style={{ fontSize: 10, color: "var(--accent)", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  AI Framework
                </div>
              </motion.div>
            )}
          </div>
          
          {!minimized && !isMobile && (
            <button 
              onClick={toggleSidebarMinimized}
              style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", padding: 4, borderRadius: 6 }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-surface-hover)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {minimized && !isMobile && (
          <button 
            onClick={toggleSidebarMinimized}
            style={{ background: "var(--bg-surface-hover)", border: "1px solid var(--border)", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "8px", borderRadius: 8, marginBottom: 24, margin: "0 auto 24px auto" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.borderColor = "var(--border-hover)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
          >
            <ChevronRight size={16} />
          </button>
        )}

        {/* Nav section label */}
        {!minimized && (
          <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "0 12px", marginBottom: 8 }}>
            Overview
          </div>
        )}

        {/* Nav Items */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          {navItems.map((item) => (
            <NavItem
              key={item.key}
              item={item}
              active={location.pathname === item.path}
              minimized={minimized}
              onClick={() => {
                setTopBar(item.key);
                navigate(item.path);
                if (isMobile) setIsSidebarOpen(false);
              }}
            />
          ))}
        </div>

        {/* Bottom Status Block */}
        <div style={{ marginTop: "auto", paddingTop: 16 }}>
          {user?.is_subscribed ? (
            <div style={{
              padding: minimized ? "12px 0" : "14px", borderRadius: 14,
              background: "var(--accent-light)", border: "1px solid var(--border-accent)",
              display: "flex", flexDirection: minimized ? "column" : "row", alignItems: "center", gap: 10, justifyContent: minimized ? "center" : "flex-start"
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10, background: "var(--accent)", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px var(--accent-light)"
              }}>
                <ShieldCheck size={16} />
              </div>
              {!minimized && (
                <div style={{ overflow: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "var(--accent)", letterSpacing: "-0.01em" }}>Pro</div>
                    <div style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", background: "var(--accent)", color: "#fff", borderRadius: 10, textTransform: "uppercase" }}>Active</div>
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2, whiteSpace: "nowrap" }}>Unlimited Audits · All Features</div>
                </div>
              )}
            </div>
          ) : (
            <div
              onClick={() => { setTopBar("pricing"); navigate("/pricing"); }}
              style={{
                padding: minimized ? "12px 0" : "14px", borderRadius: 14,
                background: "var(--bg-surface-hover)", border: "1px solid var(--border)",
                cursor: "pointer", transition: "all 0.2s ease", textAlign: "center",
                display: "flex", flexDirection: "column", alignItems: "center"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-accent)"; e.currentTarget.style.background = "var(--accent-light)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-surface-hover)"; }}
              title={minimized ? "Upgrade to Pro" : undefined}
            >
              {minimized ? (
                <Zap size={18} color="var(--accent)" />
              ) : (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, width: "100%" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-primary)" }}>Free Tier</span>
                    <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", background: "var(--warn-light)", color: "var(--warn)", border: "1px solid var(--warn-border)", borderRadius: 5 }}>
                      {user?.audit_count || 0}/1 USED
                    </span>
                  </div>
                  <div style={{ width: "100%", height: 4, background: "var(--border)", borderRadius: 2, marginBottom: 10 }}>
                    <div style={{ height: "100%", borderRadius: 2, width: `${Math.min((user?.audit_count || 0) * 100, 100)}%`, background: "var(--warn)", transition: "width 0.5s ease" }} />
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 12, lineHeight: 1.4, textAlign: "left", width: "100%" }}>
                    Get unlimited audits, priority AI, and email reports.
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: 8, borderRadius: 8, background: "var(--accent)", color: "#fff", fontSize: 11, fontWeight: 700, width: "100%" }}>
                    <Zap size={12} /> Upgrade to Pro
                  </div>
                </>
              )}
            </div>
          )}

          {!minimized && (
            <div style={{ padding: "16px 4px 0", borderTop: "1px solid var(--border)", marginTop: 16 }}>
              <div style={{
                background: "var(--bg-surface-hover)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                boxShadow: "var(--shadow-sm)",
                position: "relative",
                overflow: "hidden"
              }}>
                {/* Status Dot and Label */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--success)", zIndex: 1 }} />
                      <span style={{ position: "absolute", width: 14, height: 14, borderRadius: "50%", background: "var(--success)", opacity: 0.3, animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite" }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                      Systems Healthy
                    </span>
                  </div>
                  <div style={{
                    fontSize: 9, 
                    fontWeight: 800, 
                    padding: "3px 8px", 
                    borderRadius: "6px", 
                    background: import.meta.env.MODE === 'production' ? "var(--info-light)" : "var(--warn-light)", 
                    color: import.meta.env.MODE === 'production' ? "var(--info)" : "var(--warn)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    border: `1px solid ${import.meta.env.MODE === 'production' ? 'var(--info-border)' : 'var(--warn-border)'}`
                  }}>
                    {import.meta.env.MODE === 'production' ? 'Production' : 'Dev Mode'}
                  </div>
                </div>

                <div style={{ fontSize: 10, color: "var(--text-muted)", lineHeight: 1.4, opacity: 0.8 }}>
                  {import.meta.env.MODE === 'production' 
                    ? "Connected to DocuAudit Cloud infrastructure. All services operational."
                    : "Running on local development server. Security sandbox active."
                  }
                </div>
                
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4, paddingTop: 8, borderTop: "1px dashed var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 4, background: "var(--bg-surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, color: "var(--text-muted)" }}>V</div>
                    <span style={{ fontSize: 10, color: "var(--text-secondary)", fontWeight: 700, fontFamily: "var(--font-mono)" }}>1.0.4</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600 }}>Stable Release</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
