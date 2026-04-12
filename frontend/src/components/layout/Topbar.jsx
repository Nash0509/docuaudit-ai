import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../../utils/Store";
import useMediaQuery from "../../utils/useMediaQuery";
import { motion, AnimatePresence } from "framer-motion";
import { Search, LogOut, ChevronDown, AlertTriangle, User, Settings as SettingsIcon, Menu } from "lucide-react";
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
  const { user, logout } = useStore();
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
    <div className={`
      flex items-center gap-2.5 px-3 py-1.5 rounded-lg border cursor-pointer transition-all
      ${userMenuOpen ? "bg-slate-100 border-slate-300" : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300"}
    `}>
      <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
        {initials}
      </div>
      <span className="text-sm font-medium text-slate-700">{user?.email?.split("@")[0] || "User"}</span>
      <ChevronDown
        size={14}
        className="text-slate-400"
        style={{ transform: userMenuOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
      />
    </div>
  );

  return (
    <>
      <div className={`
        h-16 sticky top-0 z-20 bg-white border-b border-slate-200
        flex items-center justify-between
        ${isMobile ? "px-4" : "px-7"}
      `}>
        {/* Left: Hamburger + Page title */}
        <div className="flex items-center gap-3">
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
            >
              <Menu size={18} className="text-slate-600" />
            </button>
          )}
          <div>
            <div className={`font-semibold text-slate-900 leading-tight ${isMobile ? "text-[15px]" : "text-[16px]"}`}>
              {data.name}
            </div>
            {!isMobile && (
              <div className="text-[12px] text-slate-400 mt-0.5">{data.description}</div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          {!isMobile ? (
            <div
              onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }))}
              className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:border-slate-300 px-3 py-2 rounded-lg cursor-pointer transition-all"
            >
              <Search size={14} className="text-slate-400" />
              <span className="text-sm text-slate-400" style={{ width: "140px" }}>Search...</span>
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-200 bg-white text-slate-400">⌘K</kbd>
            </div>
          ) : (
            <button
              onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }))}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
            >
              <Search size={16} className="text-slate-500" />
            </button>
          )}

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
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
            />
            <div className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="w-80 bg-white border border-slate-200 rounded-2xl shadow-xl pointer-events-auto overflow-hidden"
              >
                <div className="p-7 pb-5 text-center">
                  <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={22} className="text-red-500" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">Sign out of DocuAudit AI?</h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    You'll need to sign back in to access your documents and audit reports.
                  </p>
                </div>
                <div className="flex gap-2.5 px-7 pb-6">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 py-2.5 px-4 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    style={{ fontFamily: "inherit" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-sm font-medium text-white transition-colors"
                    style={{ fontFamily: "inherit" }}
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
