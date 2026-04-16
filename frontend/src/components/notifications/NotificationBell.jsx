import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import NotificationPanel from './NotificationPanel';
import { getUnreadCount } from '../../services/api';
import useMediaQuery from '../../utils/useMediaQuery';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pulse, setPulse] = useState(false);
  const prevCountRef = useRef(0);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const containerRef = useRef(null);

  const fetchCount = async () => {
    try {
      const data = await getUnreadCount();
      const newCount = data.count || 0;
      if (newCount > prevCountRef.current) {
        setPulse(true);
        setTimeout(() => setPulse(false), 2000);
      }
      prevCountRef.current = newCount;
      setUnreadCount(newCount);
    } catch (e) { /* silent */ }
  };

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen((p) => !p)}
        aria-label="Notifications"
        style={{
          width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: 10, transition: "all 0.2s", position: "relative", cursor: "pointer", fontFamily: "inherit",
          background: isOpen ? "var(--accent-light)" : "var(--bg-surface)",
          border: `1px solid ${isOpen ? "var(--border-accent)" : "var(--border)"}`,
          color: isOpen ? "var(--accent)" : "var(--text-muted)",
          padding: 0
        }}
        onMouseEnter={(e) => {
          if (!isOpen) { 
            e.currentTarget.style.background = "var(--bg-surface-hover)"; 
            e.currentTarget.style.borderColor = "var(--border-hover)"; 
            e.currentTarget.style.color = "var(--text-primary)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) { 
            e.currentTarget.style.background = "var(--bg-surface)"; 
            e.currentTarget.style.borderColor = "var(--border)"; 
            e.currentTarget.style.color = "var(--text-muted)";
          }
        }}
      >
        {pulse && (
          <motion.div
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{ position: "absolute", inset: 0, borderRadius: 10, border: "2px solid var(--accent)", pointerEvents: "none" }}
          />
        )}

        <Bell size={15} />

        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              style={{
                position: "absolute", top: -4, right: -4, minWidth: 16, height: 16, borderRadius: "10px",
                background: "var(--accent)", border: "2.5px solid var(--bg-surface)", color: "#fff", fontSize: 10, fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px",
                boxSizing: "content-box", boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(4px)",
              zIndex: 1999
            }}
          />
        )}
        {isOpen && (
          <NotificationPanel
            onClose={() => setIsOpen(false)}
            onCountChange={setUnreadCount}
            onRefetchCount={fetchCount}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
