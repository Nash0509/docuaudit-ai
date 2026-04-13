import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, BellRing, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function formatSmartTime(dateString) {
  const date = new Date(dateString + 'Z');
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const diffDays = Math.ceil(Math.abs(now - date) / (1000 * 60 * 60 * 24));
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

const TYPE_CFG = {
  SUCCESS: { color: '#10B981', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: <CheckCircle2 size={15} /> },
  WARNING: { color: '#F59E0B', bg: 'bg-amber-50', border: 'border-amber-200', icon: <AlertTriangle size={15} /> },
  CRITICAL: { color: '#EF4444', bg: 'bg-red-50', border: 'border-red-200', icon: <BellRing size={15} /> },
  INFO: { color: '#6366F1', bg: 'bg-indigo-50', border: 'border-indigo-200', icon: <Info size={15} /> },
};

export default function NotificationItem({ notification, onRead }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const cfg = TYPE_CFG[notification.type] || TYPE_CFG.INFO;

  const handleClick = () => {
    if (!notification.is_read) onRead(notification.id);
    if (notification.entity_type === 'document' || notification.entity_type === 'audit') {
      if (['SUCCESS', 'WARNING', 'CRITICAL'].includes(notification.type)) {
        navigate(`/report/${notification.entity_id}`);
      } else {
        navigate('/');
      }
    } else if (notification.entity_type === 'rule') {
      navigate('/rules');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      className={`
        relative flex gap-3 px-5 py-3.5 cursor-pointer transition-colors
        ${notification.is_read
          ? hovered ? 'bg-slate-50' : 'bg-white'
          : hovered ? 'bg-indigo-50/70' : 'bg-indigo-50/40'
        }
        ${!notification.is_read ? 'border-l-2 border-indigo-400' : 'border-l-2 border-transparent'}
      `}
    >
      {/* Icon */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${cfg.bg} ${cfg.border}`}
        style={{ color: cfg.color, opacity: notification.is_read ? 0.6 : 1 }}
      >
        {cfg.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-6">
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className={`text-xs leading-snug truncate ${notification.is_read ? 'font-medium text-slate-500' : 'font-semibold text-slate-800'}`}>
            {notification.title}
          </span>
          <span className="text-[10px] text-slate-400 flex-shrink-0">{formatSmartTime(notification.created_at)}</span>
        </div>
        <p className={`text-xs leading-relaxed ${notification.is_read ? 'text-slate-400' : 'text-slate-500'}`}>
          {notification.message}
        </p>
      </div>

      {/* Mark read action */}
      <AnimatePresence>
        {hovered && !notification.is_read && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={(e) => { e.stopPropagation(); onRead(notification.id); }}
            title="Mark as read"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg border border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 flex items-center justify-center transition-all shadow-sm"
            style={{ fontFamily: 'inherit' }}
          >
            <CheckSquare size={13} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
