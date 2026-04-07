import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import NotificationPanel from './NotificationPanel';
import { getUnreadCount } from '../../services/api';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pulse, setPulse] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const prevCountRef = useRef(0);
  const containerRef = useRef(null);

  // Poll unread count every 30 seconds
  const fetchCount = async () => {
    try {
      const data = await getUnreadCount();
      const newCount = data.count || 0;

      // Trigger pulse if new notifications arrived
      if (newCount > prevCountRef.current) {
        setPulse(true);
        setTimeout(() => setPulse(false), 2000);
      }
      prevCountRef.current = newCount;
      setUnreadCount(newCount);
    } catch (e) {
      // silently fail
    }
  };

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ESC to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleBellClick = () => {
    setIsOpen((prev) => !prev);
    setShowTooltip(false);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              whiteSpace: 'nowrap',
              zIndex: 100,
              pointerEvents: 'none',
            }}
          >
            Notifications
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bell Button */}
      <motion.button
        onClick={handleBellClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="Notifications"
        aria-expanded={isOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isOpen ? 'var(--bg-surface-hover)' : 'var(--bg-surface)',
          border: `1px solid ${isOpen ? 'var(--border-accent)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          position: 'relative',
          color: isOpen ? 'var(--accent)' : 'var(--text-secondary)',
          transition: 'all 0.15s ease',
          outline: 'none',
        }}
      >
        {/* Pulse ring for new notifications */}
        {pulse && (
          <motion.div
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut', repeat: 1 }}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--accent)',
              pointerEvents: 'none',
            }}
          />
        )}

        <Bell size={15} />

        {/* Unread badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                minWidth: '16px',
                height: '16px',
                borderRadius: '8px',
                background: 'var(--accent)',
                color: '#020617',
                fontSize: '9px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 3px',
                border: '2px solid var(--bg-base)',
              }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
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
