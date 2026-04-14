import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../../utils/Store";
import useMediaQuery from "../../utils/useMediaQuery";
import { motion, AnimatePresence } from "framer-motion";
import { Search, LogOut, ChevronDown, AlertTriangle, User, Settings as SettingsIcon, Menu, Sun, Moon } from "lucide-react";
import NotificationBell from "../notifications/NotificationBell";
import DropdownMenu from "../ui/DropdownMenu";

const topBarData = {
  dashboard: { name: "Dashboard", description: "Audit overview and key performance metrics" },
  documents: { name: "Documents", description: "Secure storage and processing for your legal files" },
  reports: { name: "Audit Reports", description: "Deep-dive analysis and compliance findings" },
  rules: { name: "Compliance Rules", description: "Criteria and logic used for document evaluation" },
  settings: { name: "Settings", description: "Manage your system and personal preferences" },
  profile: { name: "Account Profile", description: "Manage your identity and authentication" },
  pricing: { name: "Premium Plans", description: "Scale your auditing with high-performance features" },
};

export default function Topbar() {
  const navigate = useNavigate();
  const { user, logout, theme, toggleTheme } = useStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const path = window.location.pathname.split("/").pop() || "dashboard";
  const data = topBarData[path] || topBarData.dashboard;

  const toggleSidebar = () => window.dispatchEvent(new CustomEvent("toggle-sidebar"));
  const initials = user?.email ? user.email.substring(0, 2).toUpperCase() : "AD";
  const handleLogout = () => { logout(); navigate("/auth"); };

  const userMenuItems = [
    { label: "Profile", icon: <User size={14} />, onClick: () => navigate("/profile") },
    { label: "Settings", icon: <SettingsIcon size={14} />, shortcut: "⌘S", onClick: () => navigate("/settings") },
    { type: "divider" },
    { label: "Sign out", icon: <LogOut size={14} />, danger: true, onClick: () => setShowLogoutConfirm(true) },
  ];

  const userTrigger = (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, padding: "6px 12px", borderRadius: 8, cursor: "pointer", transition: "all 0.2s",
      background: userMenuOpen ? "var(--bg-surface-hover)" : "var(--bg-surface)", border: `1px solid ${userMenuOpen ? "var(--border-hover)" : "var(--border)"}`
    }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
        {initials}
      </div>
      <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>{user?.email?.split("@")[0] || "User"}</span>
      <ChevronDown
        size={14}
        color="var(--text-muted)"
        style={{ transform: userMenuOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
      />
    </div>
  );

  return (
    <>
      <div style={{
        height: 64, position: "sticky", top: 0, zIndex: 20, background: "var(--bg-surface)", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "0 16px" : "0 28px"
      }}>
        {/* Left: Hamburger + Page title */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isMobile && (
            <button
              onClick={toggleSidebar}
              style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-surface)", padding: 0, cursor: "pointer" }}
            >
              <Menu size={18} color="var(--text-primary)" />
            </button>
          )}
          <div>
            <div style={{ fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.2, fontSize: isMobile ? 15 : 16 }}>
              {data?.name || "Dashboard"}
            </div>
            {!isMobile && (
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{data?.description || "Audit overview"}</div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {!isMobile ? (
            <div
              onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }))}
              style={{ 
                display: "flex", alignItems: "center", gap: 8, height: 38,
                background: "var(--bg-surface-hover)", border: "1px solid var(--border)", 
                padding: "0 14px", borderRadius: 10, cursor: "pointer", transition: "all 0.2s" 
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.background = "var(--bg-surface-elevated)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-surface-hover)"; }}
            >
              <Search size={14} color="var(--text-muted)" />
              <span style={{ fontSize: 13, color: "var(--text-muted)", width: 140 }}>Quick Search...</span>
              <kbd style={{ 
                fontSize: 10, fontFamily: "var(--font-mono)", padding: "2px 6px", borderRadius: 4, 
                border: "1px solid var(--border)", background: "var(--bg-surface)", color: "var(--text-muted)",
                boxShadow: "0 1px 0 var(--border)"
              }}>⌘K</kbd>
            </div>
          ) : (
            <button
              onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }))}
              style={{ 
                width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", 
                borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-surface)", padding: 0, cursor: "pointer" 
              }}
            >
              <Search size={16} color="var(--text-muted)" />
            </button>
          )}

          <button
            onClick={toggleTheme}
            style={{ 
              width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", 
              borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-surface)", padding: 0, cursor: "pointer", 
              color: "var(--text-muted)", transition: "all 0.2s" 
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-surface-hover)"; e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.borderColor = "var(--border-hover)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-surface)"; e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <NotificationBell />

          <DropdownMenu
            items={userMenuItems}
            trigger={userTrigger}
            align="right"
            onOpenChange={(open) => setUserMenuOpen(open)}
          />
        </div>
      </div>

      {/* Logout Confirm Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", zIndex: 9998 }}
            />
            <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, pointerEvents: "none" }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                style={{ width: 320, background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 16, boxShadow: "var(--shadow-elevated)", pointerEvents: "auto", overflow: "hidden" }}
              >
                <div style={{ padding: "28px 28px 20px", textAlign: "center" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--danger-light)", border: "1px solid var(--danger-border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <AlertTriangle size={22} color="var(--danger)" />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>Sign out of DocuAudit AI?</h3>
                  <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.5, marginBottom: 0 }}>
                    You'll need to sign back in to access your documents and audit reports.
                  </p>
                </div>
                <div style={{ display: "flex", gap: 10, padding: "0 28px 24px" }}>
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: "10px 16px" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="btn btn-danger"
                    style={{ flex: 1, padding: "10px 16px" }}
                  >
                    Sign Out
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
