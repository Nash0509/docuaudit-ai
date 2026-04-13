import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import NotificationPanel from './NotificationPanel';
import { getUnreadCount } from '../../services/api';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pulse, setPulse] = useState(false);
  const prevCountRef = useRef(0);
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
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen((p) => !p)}
        aria-label="Notifications"
        className={`
          relative w-9 h-9 flex items-center justify-center rounded-lg border transition-all
          ${isOpen
            ? 'bg-indigo-50 border-indigo-300 text-indigo-600'
            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
          }
        `}
        style={{ fontFamily: 'inherit' }}
      >
        {pulse && (
          <motion.div
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute inset-0 rounded-lg border-2 border-indigo-400 pointer-events-none"
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
              className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 rounded-full bg-indigo-600 border-2 border-white text-white text-[9px] font-bold flex items-center justify-center px-1"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.div>
          )}
        </AnimatePresence>
      </button>

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
