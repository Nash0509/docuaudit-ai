import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, BellRing, Settings2, Trash2, CheckSquare } from 'lucide-react';
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
  
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function NotificationItem({ notification, onRead }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const getStyleConfig = (type) => {
    switch (type) {
      case 'SUCCESS': return { color: 'var(--success)', icon: <CheckCircle2 size={16} /> };
      case 'WARNING': return { color: 'var(--warn)', icon: <AlertTriangle size={16} /> };
      case 'CRITICAL': return { color: 'var(--danger)', icon: <BellRing size={16} /> };
      case 'INFO': default: return { color: 'var(--info)', icon: <Info size={16} /> };
    }
  };

  const styleConfig = getStyleConfig(notification.type);

  const handleClick = () => {
    if (!notification.is_read) {
      onRead(notification.id);
    }
    
    // Navigate based on entity type
    if (notification.entity_type === 'document' || notification.entity_type === 'audit') {
      if (notification.type === 'SUCCESS' || notification.type === 'WARNING' || notification.type === 'CRITICAL') {
        navigate(`/report/${notification.entity_id}`);
      } else {
        navigate('/'); // Default to dashboard for general doc info
      }
    } else if (notification.entity_type === 'rule') {
      navigate('/rules');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{
        display: 'flex',
        gap: '12px',
        padding: '14px 16px',
        cursor: 'pointer',
        background: notification.is_read 
          ? (isHovered ? 'var(--bg-surface-hover)' : 'transparent')
          : (isHovered ? 'rgba(0, 212, 170, 0.08)' : 'rgba(0, 212, 170, 0.04)'), // Subtle tint for unread
        borderLeft: notification.is_read ? '2px solid transparent' : '2px solid var(--accent)',
        transition: 'all 0.15s ease',
        position: 'relative'
      }}
    >
      {/* Icon Area */}
      <div style={{
        width: '32px', height: '32px',
        borderRadius: '50%',
        background: `var(--bg-surface)`,
        border: `1px solid ${styleConfig.color}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: styleConfig.color,
        flexShrink: 0,
        opacity: notification.is_read ? 0.7 : 1
      }}>
        {styleConfig.icon}
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, minWidth: 0, paddingRight: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
          <span style={{ 
            fontSize: '13px', 
            fontWeight: notification.is_read ? '500' : '700', 
            color: notification.is_read ? 'var(--text-secondary)' : 'var(--text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {notification.title}
          </span>
          <span style={{ 
            fontSize: '11px', 
            color: notification.is_read ? 'var(--text-muted)' : 'var(--text-secondary)',
            flexShrink: 0,
            marginLeft: '8px'
          }}>
            {formatSmartTime(notification.created_at)}
          </span>
        </div>
        <div style={{ 
          fontSize: '12px', 
          color: notification.is_read ? 'var(--text-muted)' : 'var(--text-secondary)',
          lineHeight: '1.4',
        }}>
          {notification.message}
        </div>
      </div>

      {/* Hover Actions */}
      <AnimatePresence>
        {isHovered && !notification.is_read && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            style={{ 
              position: 'absolute', 
              right: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              display: 'flex',
              gap: '6px'
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRead(notification.id);
              }}
              title="Mark as read"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                width: '28px', height: '28px',
                borderRadius: '6px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <CheckSquare size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
