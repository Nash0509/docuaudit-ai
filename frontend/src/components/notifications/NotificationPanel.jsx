import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, BellOff, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../utils/Store';
import NotificationItem from './NotificationItem';
import NotificationSkeleton from './NotificationSkeleton';
import axios from 'axios';

// Use the same base URL as the shared API service
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
});

export default function NotificationPanel({ onClose, onCountChange, onRefetchCount }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    API.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await API.get('/notifications');
      setNotifications(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      onRefetchCount();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      onCountChange(0);
    } catch (e) {
      console.error(e);
    }
  };

  // Group notifications
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups = {
    Today: [],
    Yesterday: [],
    Older: []
  };

  notifications.forEach(n => {
    const d = new Date(n.created_at + 'Z');
    if (d >= today) {
      groups.Today.push(n);
    } else if (d >= yesterday) {
      groups.Yesterday.push(n);
    } else {
      groups.Older.push(n);
    }
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.96 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 30, 
        mass: 0.8 
      }}
      style={{
        position: 'absolute',
        top: 'calc(100% + 12px)',
        right: 0,
        width: '400px',
        background: 'rgba(15, 23, 42, 0.98)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '16px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        overflow: 'hidden',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        transformOrigin: 'top right'
      }}
    >
      {/* Header */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>Notifications</h3>
          {unreadCount > 0 && (
            <span style={{ 
              background: 'var(--accent)', color: '#020617', 
              fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '12px' 
            }}>
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              color: 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 10px',
              borderRadius: '8px',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => { 
                e.currentTarget.style.color = 'var(--text-primary)'; 
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; 
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; 
            }}
            onMouseLeave={(e) => { 
                e.currentTarget.style.color = 'var(--text-secondary)'; 
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; 
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)'; 
            }}
          >
            <Check size={14} /> Mark all read
          </button>
        )}
      </div>

      {/* Body */}
      <div 
        className="custom-scrollbar"
        style={{ maxHeight: '420px', overflowY: 'auto', overflowX: 'hidden' }}
      >
        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); borderRadius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        `}</style>

        {loading ? (
          <div style={{ padding: '20px 0' }}><NotificationSkeleton /></div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ 
              width: '56px', height: '56px', borderRadius: '18px', 
              background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
              transform: 'rotate(-5deg)'
            }}>
              <BellOff size={24} color="var(--text-muted)" />
            </div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>All caught up!</div>
            <div style={{ fontSize: '13px', opacity: 0.7 }}>No unread notifications for now.</div>
          </div>
        ) : (
          <div style={{ padding: '0 8px 12px' }}>
            {Object.entries(groups).map(([groupName, items]) => {
              if (items.length === 0) return null;
              return (
                <div key={groupName}>
                  <div style={{
                    padding: '16px 16px 8px',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    opacity: 0.6
                  }}>
                    {groupName}
                  </div>
                  {items.map((n) => (
                    <NotificationItem 
                      key={n.id} 
                      notification={n} 
                      onRead={handleMarkRead} 
                    />
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

