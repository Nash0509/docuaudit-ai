import { Search, Bell, LogOut, ChevronDown } from "lucide-react";
import useStore from "../../utils/Store";
import { useNavigate } from "react-router-dom";

const topBarData = {
  dashboard: { name: "Dashboard", description: "AI contract intelligence overview" },
  documents: { name: "Documents", description: "Manage and audit your contracts" },
  reports: { name: "Audit Reports", description: "View compliance analysis results" },
  rules: { name: "Rules", description: "Manage compliance rules" },
  settings: { name: "Settings", description: "Application configuration" },
};

export default function Topbar() {
  const topBarKey = useStore((state) => state.topBar);
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const navigate = useNavigate();

  const data = topBarData[topBarKey] || {};
  const initials = user?.email ? user.email[0].toUpperCase() : "U";

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
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
      padding: "0 28px",
    }}>
      {/* Left: Page title */}
      <div>
        <div style={{ fontSize: "17px", fontWeight: "700", color: "var(--text-primary)", lineHeight: 1 }}>
          {data.name}
        </div>
        <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
          {data.description}
        </div>
      </div>

      {/* Right: Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Search */}
        <div style={{
          display: "flex",
          alignItems: "center",
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          padding: "8px 12px",
          borderRadius: "var(--radius-md)",
          gap: "8px",
          transition: "all 0.2s",
        }}
          onFocus={() => {}}
        >
          <Search size={14} color="var(--text-muted)" />
          <input
            placeholder="Search..."
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              width: "140px",
              fontSize: "13px",
              fontFamily: "inherit",
            }}
          />
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

        {/* Notifications */}
        <div
          style={{
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            cursor: "pointer",
            position: "relative",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.background = "var(--bg-surface-hover)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-surface)"; }}
        >
          <Bell size={15} color="var(--text-secondary)" />
          {/* Notification dot */}
          <div style={{
            position: "absolute",
            top: "7px",
            right: "7px",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "var(--accent)",
            border: "1.5px solid var(--bg-base)",
          }} />
        </div>

        {/* User avatar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          padding: "5px 10px 5px 5px",
          borderRadius: "var(--radius-md)",
          cursor: "pointer",
          transition: "all 0.15s",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-hover)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
        >
          <div style={{
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #00d4aa, #2563eb)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            fontWeight: "700",
            color: "#020617",
            flexShrink: 0,
          }}>
            {initials}
          </div>
          <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: "500" }}>
            {user?.email?.split("@")[0] || "User"}
          </span>
          <ChevronDown size={12} color="var(--text-muted)" />
        </div>

        {/* Logout */}
        <div
          onClick={handleLogout}
          title="Sign out"
          style={{
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--danger-dim)",
            border: "1px solid rgba(239, 68, 68, 0.15)",
            borderRadius: "var(--radius-md)",
            cursor: "pointer",
            color: "var(--danger)",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "var(--danger-dim)"; }}
        >
          <LogOut size={15} />
        </div>
      </div>
    </div>
  );
}
