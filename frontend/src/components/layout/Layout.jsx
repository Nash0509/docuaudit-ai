import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { motion, AnimatePresence } from "framer-motion";
import CommandPalette from "./CommandPalette";
import { useLocation } from "react-router-dom";
import useMediaQuery from "../../utils/useMediaQuery";
import useStore from "../../utils/Store";

export default function Layout({ children }) {
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const isSidebarOpen = useStore((state) => state.isSidebarOpen);
  const setIsSidebarOpen = useStore((state) => state.setIsSidebarOpen);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-base)" }}>
      <CommandPalette />

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.3)", backdropFilter: "blur(4px)", zIndex: 45 }}
          />
        )}
      </AnimatePresence>

      <div className="sidebar no-print">
        <Sidebar />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <div className="topbar no-print">
          <Topbar />
        </div>
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: isMobile ? 20 : 32 }}
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
