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
  SUCCESS: { color: 'var(--success)', bg: 'var(--success-light)', border: 'var(--success-border)', icon: <CheckCircle2 size={15} /> },
  WARNING: { color: 'var(--warn)', bg: 'var(--warn-light)', border: 'var(--warn-border)', icon: <AlertTriangle size={15} /> },
  CRITICAL: { color: 'var(--danger)', bg: 'var(--danger-light)', border: 'var(--danger-border)', icon: <BellRing size={15} /> },
  INFO: { color: 'var(--info)', bg: 'var(--info-light)', border: 'var(--info-border)', icon: <Info size={15} /> },
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
      style={{
        position: "relative", display: "flex", gap: 12, padding: "14px 20px", cursor: "pointer", transition: "all 0.2s",
        background: notification.is_read ? (hovered ? "var(--bg-surface-hover)" : "var(--bg-surface)") : (hovered ? "var(--info-light)" : "var(--bg-surface)"),
        borderLeft: `2px solid ${notification.is_read ? "transparent" : "var(--info)"}`
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, opacity: notification.is_read ? 0.6 : 1
        }}
      >
        {cfg.icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0, paddingRight: 24 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 12, fontWeight: notification.is_read ? 500 : 600, color: notification.is_read ? "var(--text-muted)" : "var(--text-primary)", lineHeight: 1.4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {notification.title}
          </span>
          <span style={{ fontSize: 10, color: "var(--text-muted)", flexShrink: 0 }}>{formatSmartTime(notification.created_at)}</span>
        </div>
        <p style={{ fontSize: 12, color: notification.is_read ? "var(--text-muted)" : "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
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
            style={{
              position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 28, height: 28, borderRadius: 8,
              border: "1px solid var(--border)", background: "var(--bg-surface)", display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.2s", color: "var(--text-muted)", padding: 0
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--info-border)"; e.currentTarget.style.background = "var(--info-light)"; e.currentTarget.style.color = "var(--info)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-surface)"; e.currentTarget.style.color = "var(--text-muted)"; }}
          >
            <CheckSquare size={13} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
