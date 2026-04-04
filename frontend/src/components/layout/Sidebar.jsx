import {
  LayoutDashboard, FileText, ShieldCheck,
  BarChart2, Settings
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

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const setTopBar = useStore((state) => state.setTopBar);

  useShortcut(['Control', 'd'], () => { setTopBar("documents"); navigate("/documents"); });
  useShortcut(['Control', 'r'], () => { setTopBar("rules"); navigate("/rules"); });

  return (
    <div style={{
      width: "240px",
      flexShrink: 0,
      background: "rgba(2, 6, 23, 0.95)",
      borderRight: "1px solid var(--border)",
      padding: "20px 16px",
      height: "100vh",
      position: "sticky",
      top: 0,
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Logo */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "32px",
        padding: "4px 12px",
      }}>
        <div style={{
          width: "32px",
          height: "32px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, #00d4aa, #2563eb)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          fontWeight: "700",
          color: "#020617",
          flexShrink: 0,
        }}>
          D
        </div>
        <div>
          <div style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-primary)", lineHeight: 1, letterSpacing: "-0.02em" }}>
            DocuAudit
          </div>
          <div style={{ fontSize: "10px", color: "var(--accent)", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            AI Framework
          </div>
        </div>
      </div>

      {/* Nav section label */}
      <div style={{
        fontSize: "10px",
        color: "var(--text-muted)",
        fontWeight: "600",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "0 12px",
        marginBottom: "8px",
      }}>
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
            }}
          />
        ))}
      </div>

      {/* Bottom version tag */}
      <div style={{
        padding: "16px 12px 0",
        borderTop: "1px dashed var(--border)",
        marginTop: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "4px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--success)" }} />
          <div style={{ fontSize: "12px", fontWeight: "500", color: "var(--text-secondary)" }}>Systems Local</div>
        </div>
        <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "monospace" }}>v1.0.3 · Stable</div>
      </div>
    </div>
  );
}
