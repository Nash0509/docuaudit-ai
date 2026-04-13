import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, BellOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../utils/Store';
import NotificationItem from './NotificationItem';
import axios from 'axios';

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
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleMarkRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
      onRefetchCount();
    } catch (e) { console.error(e); }
  };

  const handleMarkAllRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      onCountChange(0);
    } catch (e) { console.error(e); }
  };

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  const groups = { Today: [], Yesterday: [], Older: [] };
  notifications.forEach((n) => {
    const d = new Date(n.created_at + 'Z');
    if (d >= today) groups.Today.push(n);
    else if (d >= yesterday) groups.Yesterday.push(n);
    else groups.Older.push(n);
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      style={{
        position: "absolute", top: "calc(100% + 10px)", right: 0, width: 384, background: "var(--bg-surface)",
        border: "1px solid var(--border)", borderRadius: 16, boxShadow: "var(--shadow-elevated)",
        overflow: "hidden", zIndex: 1000, transformOrigin: 'top right'
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Notifications</h3>
          {unreadCount > 0 && (
            <span style={{ fontSize: 12, fontWeight: 700, padding: "2px 8px", borderRadius: 12, background: "var(--info-light)", color: "var(--info)", border: "1px solid var(--info-border)" }}>
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500, color: "var(--text-muted)", padding: "6px 10px", borderRadius: 8, background: "transparent", border: "1px solid transparent", cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--info-light)"; e.currentTarget.style.color = "var(--info)"; e.currentTarget.style.borderColor = "var(--info-border)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "transparent"; }}
          >
            <Check size={12} /> Mark all read
          </button>
        )}
      </div>

      {/* Body */}
      <div style={{ maxHeight: 400, overflowY: "auto" }}>
        {loading ? (
          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div className="skeleton" style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0 }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                  <div className="skeleton" style={{ height: 12, width: "75%", borderRadius: 4 }} />
                  <div className="skeleton" style={{ height: 10, width: "100%", borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 0", textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: "var(--bg-surface-hover)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <BellOff size={20} color="var(--text-muted)" style={{ transform: 'rotate(-5deg)' }} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 4px 0" }}>All caught up!</p>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>No new notifications for now.</p>
          </div>
        ) : (
          <div style={{ padding: "8px 0" }}>
            {Object.entries(groups).map(([group, items]) => {
              if (items.length === 0) return null;
              return (
                <div key={group}>
                  <div style={{ padding: "8px 20px", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {group}
                  </div>
                  {items.map((n) => (
                    <NotificationItem key={n.id} notification={n} onRead={handleMarkRead} />
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
