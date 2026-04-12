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
    <div className="flex min-h-screen bg-slate-50">
      <CommandPalette />

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[45]"
          />
        )}
      </AnimatePresence>

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar />
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={`flex-1 overflow-y-auto overflow-x-hidden ${isMobile ? "p-5" : "p-8"}`}
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
