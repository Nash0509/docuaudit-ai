import { useNavigate, useLocation } from "react-router-dom";
import useStore from "../../utils/Store";

function NavItem({ text, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "10px",
        borderRadius: "8px",
        background: active ? "rgba(0,212,170,0.08)" : "transparent",
        color: active ? "#e2e8f0" : "#64748b",
        cursor: "pointer",
        marginBottom: "10px",
        transition: "0.2s",
      }}
      onMouseEnter={(e) => {
        if (!active)
          e.currentTarget.style.background = "rgba(255,255,255,0.03)";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = "transparent";
      }}
    >
      {text}
    </div>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const setTopBar = useStore((state) => state.setTopBar);

  const navItems = [
    {
      key: "dashboard",
      text: "Dashboard",
      path: "/",
      description: "AI contract intelligence overview",
    },

    {
      key: "documents",
      text: "Documents",
      path: "/documents",
      description: "Manage and audit contracts",
    },

    {
      key: "reports",
      text: "Audit Reports",
      path: "/reports",
      description: "View compliance analysis results",
    },

    {
      key: "settings",
      text: "Settings",
      path: "/settings",
      description: "Application configuration",
    },
  ];

  return (
    <div
      style={{
        width: "250px",
        background: "#020617",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        padding: "28px",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      <div
        style={{
          fontSize: "22px",
          fontWeight: "700",
          marginBottom: "40px",
        }}
      >
        DocuAudit
        <span style={{ color: "#00d4aa" }}>AI</span>
      </div>

      {navItems.map((item) => (
        <NavItem
          key={item.key}
          text={item.text}
          active={location.pathname === item.path}
          onClick={() => {
            setTopBar(item.key);
            navigate(item.path);
          }}
        />
      ))}
    </div>
  );
}
