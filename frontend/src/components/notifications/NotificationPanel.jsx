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
      className="absolute top-[calc(100%+10px)] right-0 w-96 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-[1000]"
      style={{ transformOrigin: 'top right' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 border border-indigo-200">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 border border-transparent hover:border-indigo-100"
            style={{ fontFamily: 'inherit' }}
          >
            <Check size={12} /> Mark all read
          </button>
        )}
      </div>

      {/* Body */}
      <div className="max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="skeleton w-8 h-8 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="skeleton h-3 w-3/4 rounded" />
                  <div className="skeleton h-2.5 w-full rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
              <BellOff size={20} className="text-slate-400" style={{ transform: 'rotate(-5deg)' }} />
            </div>
            <p className="text-sm font-semibold text-slate-700 mb-1">All caught up!</p>
            <p className="text-xs text-slate-400">No new notifications for now.</p>
          </div>
        ) : (
          <div className="py-2">
            {Object.entries(groups).map(([group, items]) => {
              if (items.length === 0) return null;
              return (
                <div key={group}>
                  <div className="px-5 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
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
