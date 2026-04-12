import useMediaQuery from "../../utils/useMediaQuery";
import {
  LayoutDashboard, FileText, ShieldCheck,
  BarChart2, Settings, User, Zap, Shield
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import useStore from "../../utils/Store";
import useShortcut from "../../utils/useShortcut";

const navGroups = [
  {
    label: "Core",
    items: [
      { key: "dashboard", label: "Dashboard", path: "/", icon: LayoutDashboard },
      { key: "documents", label: "Documents", path: "/documents", icon: FileText, shortcut: "D" },
      { key: "reports", label: "Audit Reports", path: "/reports", icon: BarChart2 },
    ]
  },
  {
    label: "Configure",
    items: [
      { key: "rules", label: "Rules", path: "/rules", icon: ShieldCheck, shortcut: "R" },
      { key: "settings", label: "Settings", path: "/settings", icon: Settings },
      { key: "profile", label: "Profile", path: "/profile", icon: User, shortcut: "P" },
    ]
  }
];

function NavItem({ item, active, onClick }) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm
        transition-all duration-150 cursor-pointer border-none text-left font-medium
        ${active
          ? "bg-indigo-50 text-indigo-700"
          : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
        }
      `}
      style={{ fontFamily: "inherit" }}
    >
      <span className="flex items-center gap-2.5">
        <Icon
          size={16}
          strokeWidth={active ? 2.5 : 2}
          className={active ? "text-indigo-600" : "text-slate-400"}
        />
        {item.label}
      </span>
      {item.shortcut && (
        <kbd className={`
          text-[10px] font-mono px-1.5 py-0.5 rounded border
          ${active ? "bg-indigo-100 border-indigo-200 text-indigo-500" : "bg-slate-100 border-slate-200 text-slate-400"}
        `}>
          ⌘{item.shortcut}
        </kbd>
      )}
      {active && (
        <motion.div
          layoutId="sidebar-active-indicator"
          className="absolute left-0 w-0.5 h-6 bg-indigo-600 rounded-r-full"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      )}
    </button>
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

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        onClick={() => { setTopBar("dashboard"); navigate("/"); if (isMobile) setIsSidebarOpen(false); }}
        className="flex items-center gap-3 mb-8 px-3 py-2 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
          <Shield size={16} color="white" strokeWidth={2.5} />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900 leading-tight tracking-tight">DocuAudit</div>
          <div className="text-[10px] font-semibold text-indigo-500 tracking-widest uppercase">AI Platform</div>
        </div>
      </div>

      {/* Nav Groups */}
      <div className="flex-1 space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-1.5">
              {group.label}
            </p>
            <div className="space-y-0.5 relative">
              {group.items.map((item) => (
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
          </div>
        ))}
      </div>

      {/* Bottom Status */}
      <div className="mt-auto space-y-3">
        {user?.is_subscribed ? (
          <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={14} color="white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-indigo-800">Pro Plan</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-600 text-white uppercase tracking-wide">Active</span>
                </div>
                <p className="text-[10px] text-indigo-400 mt-0.5">Unlimited Audits · All Features</p>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => { setTopBar("pricing"); navigate("/pricing"); }}
            className="p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:border-indigo-200 hover:bg-indigo-50 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700">Free Plan</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${(user?.audit_count || 0) >= 1 ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}>
                {user?.audit_count || 0}/1 used
              </span>
            </div>
            <div className="h-1 rounded-full bg-slate-200 mb-2">
              <div
                className={`h-full rounded-full transition-all duration-500 ${(user?.audit_count || 0) >= 1 ? "bg-red-500" : "bg-amber-400"}`}
                style={{ width: `${Math.min((user?.audit_count || 0) * 100, 100)}%` }}
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600">
              <Zap size={11} />
              Upgrade to Pro · ₹99/mo
            </div>
          </div>
        )}

        <div className="px-3 pt-2 border-t border-slate-100 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
          <div>
            <div className="text-[11px] font-medium text-slate-600">All Systems Online</div>
            <div className="text-[10px] text-slate-400 font-mono">v1.0.3 · Stable</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={isMobile ? { x: "-100%" } : { x: 0 }}
      animate={isMobile ? { x: isSidebarOpen ? 0 : "-100%" } : { x: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="flex-shrink-0 bg-white border-r border-slate-200 p-5 h-screen sticky top-0"
      style={{
        width: "240px",
        position: isMobile ? "fixed" : "sticky",
        top: 0,
        left: 0,
        zIndex: 100,
        boxShadow: isMobile && isSidebarOpen ? "4px 0 24px rgba(0,0,0,0.08)" : "none",
      }}
    >
      {sidebarContent}
    </motion.div>
  );
}
