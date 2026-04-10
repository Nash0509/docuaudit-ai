import { Search, LogOut, ChevronDown, AlertTriangle, User, Settings as SettingsIcon, Menu } from "lucide-react";
import useMediaQuery from "../../utils/useMediaQuery";

// ... inside Topbar component ...

export default function Topbar() {
  const topBarKey = useStore((state) => state.topBar);
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const toggleSidebar = useStore((state) => state.toggleSidebar);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const data = topBarData[topBarKey] || {};
  const initials = user?.email ? user.email[0].toUpperCase() : "U";

  // ... (handleLogout and userMenuItems remain same)


  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const userMenuItems = [
    { 
      label: 'Profile', 
      icon: <User size={14} />, 
      onClick: () => navigate('/profile')
    },
    { 
      label: 'Settings', 
      icon: <SettingsIcon size={14} />, 
      shortcut: '⌘S',
      onClick: () => navigate('/settings') 
    },
    { type: 'divider' },
    { 
      label: 'Sign out', 
      icon: <LogOut size={14} />, 
      danger: true,
      onClick: () => setShowLogoutConfirm(true) 
    },
  ];

  const userTrigger = (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      background: userMenuOpen ? "var(--bg-surface-hover)" : "var(--bg-surface)",
      border: `1px solid ${userMenuOpen ? 'rgba(255, 255, 255, 0.2)' : 'var(--border)'}`,
      padding: "6px 12px 6px 6px",
      borderRadius: "12px",
      cursor: "pointer",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: userMenuOpen ? '0 4px 20px rgba(0, 0, 0, 0.2)' : 'none',
    }}
      onMouseEnter={(e) => { 
        if (!userMenuOpen) {
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)"; 
          e.currentTarget.style.background = "var(--bg-surface-hover)";
        }
      }}
      onMouseLeave={(e) => { 
        if (!userMenuOpen) {
          e.currentTarget.style.borderColor = "var(--border)"; 
          e.currentTarget.style.background = "var(--bg-surface)";
        }
      }}
    >
      <div style={{
        width: "28px",
        height: "28px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #00d4aa, #2563eb)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "12px",
        fontWeight: "800",
        color: "#020617",
        flexShrink: 0,
        boxShadow: userMenuOpen ? '0 0 12px rgba(0, 212, 170, 0.4)' : 'none',
        transition: 'all 0.2s ease',
      }}>
        {initials}
      </div>
      <span style={{ fontSize: "13px", color: userMenuOpen ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: "600", transition: 'color 0.2s' }}>
        {user?.email?.split("@")[0] || "User"}
      </span>
      <ChevronDown 
        size={14} 
        color={userMenuOpen ? "var(--text-primary)" : "var(--text-muted)"} 
        style={{ 
            transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: userMenuOpen ? 1 : 0.6
        }} 
      />
    </div>
  );

  return (
    <>
      <div style={{
        height: "64px",
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "rgba(2, 6, 23, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: isMobile ? "0 16px" : "0 28px",
      }}>
        {/* Left: Hamburger + Page title */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {isMobile && (
            <div 
              onClick={toggleSidebar}
              style={{
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                cursor: "pointer",
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
              }}
            >
              <Menu size={20} color="var(--text-primary)" />
            </div>
          )}
          
          <div>
            <div style={{ fontSize: isMobile ? "15px" : "17px", fontWeight: "700", color: "var(--text-primary)", lineHeight: 1 }}>
              {data.name}
            </div>
            {!isMobile && (
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                {data.description}
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Search — collapses on mobile */}
          {!isMobile ? (
            <div
              onClick={() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
              }}
              style={{
                display: "flex",
                alignItems: "center",
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                padding: "8px 12px",
                borderRadius: "var(--radius-md)",
                gap: "8px",
                cursor: "pointer",
                transition: "all 0.15s",
                userSelect: "none",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.background = "var(--bg-surface-hover)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-surface)"; }}
            >
              <Search size={14} color="var(--text-muted)" />
              <span style={{
                color: "var(--text-muted)",
                fontSize: "13px",
                fontFamily: "inherit",
                width: "140px",
              }}>Search...</span>
              <span style={{
                fontSize: "10px",
                color: "var(--text-muted)",
                background: "var(--bg-surface-hover)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                padding: "1px 5px",
                fontFamily: "monospace",
              }}>⌘K</span>
            </div>
          ) : (
            <div 
              onClick={() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
              }}
              style={{
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                cursor: "pointer",
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
              }}
            >
              <Search size={18} color="var(--text-muted)" />
            </div>
          )}

          {/* Notifications */}
          <NotificationBell />

          {/* User Menu Dropdown */}
          <DropdownMenu 
            items={userMenuItems} 
            trigger={userTrigger}
            align="right"
            onOpenChange={(open) => setUserMenuOpen(open)}
          />
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setShowLogoutConfirm(false)}
              style={{
                position: "fixed", inset: 0,
                background: "rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(4px)",
                zIndex: 9998,
              }}
            />
            {/* Modal */}
            <div style={{
              position: "fixed", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 9999, pointerEvents: "none",
            }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  width: "380px",
                  background: "rgba(15, 23, 42, 0.98)",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)",
                  overflow: "hidden",
                  pointerEvents: "auto",
                }}
              >
                {/* Header icon */}
                <div style={{ padding: "28px 28px 0", display: "flex", justifyContent: "center" }}>
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "50%",
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--danger)",
                  }}>
                    <AlertTriangle size={22} />
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: "20px 28px 8px", textAlign: "center" }}>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "var(--text-primary)" }}>
                    Sign out of DocuAudit AI?
                  </h3>
                  <p style={{ margin: "8px 0 0", fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                    You'll need to sign back in to access your documents, rules, and audit reports.
                  </p>
                </div>

                {/* Actions */}
                <div style={{ padding: "20px 28px 24px", display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    style={{
                      flex: 1,
                      padding: "10px 16px",
                      borderRadius: "8px",
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border)",
                      color: "var(--text-primary)",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      fontFamily: "inherit",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-surface-hover)"; e.currentTarget.style.borderColor = "var(--border-hover)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-surface)"; e.currentTarget.style.borderColor = "var(--border)"; }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    style={{
                      flex: 1,
                      padding: "10px 16px",
                      borderRadius: "8px",
                      background: "var(--danger)",
                      border: "1px solid transparent",
                      color: "#fff",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      fontFamily: "inherit",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
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
