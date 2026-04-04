import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { motion, AnimatePresence } from "framer-motion";
import CommandPalette from "./CommandPalette";
import { useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const location = useLocation();
  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "var(--bg-base)",
      color: "var(--text-primary)",
    }}>
      {/* Global Modals & Utilities */}
      <CommandPalette />

      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <Topbar />

        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              flex: 1,
              padding: "24px 32px",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
