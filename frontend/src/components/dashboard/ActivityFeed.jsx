import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ShieldCheck, AlertTriangle, FileText, CheckCircle2, Trash2, PlusCircle, Activity } from 'lucide-react';
import Card from '../ui/Card';
import { getActivities } from '../../services/api';

function formatTimeAgo(dateString) {
  const date = new Date(dateString + 'Z'); // Explicitly append Z to ensure UTC parsing
  const seconds = Math.floor((new Date() - date) / 1000);

  if (seconds < 60) return `${seconds} sec ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const data = await getActivities();
        // Check for edge case empty arrays
        setActivities(data || []);
      } catch (e) {
        console.error("Failed to fetch activities");
      } finally {
        setLoading(false);
      }
    }
    fetchActivities();
    
    // Auto refresh every 15 seconds
    const interval = setInterval(fetchActivities, 15000);
    return () => clearInterval(interval);
  }, []);

  const getActionConfig = (activity) => {
    switch(activity.action) {
      case 'UPLOAD':
        return { text: 'Document Uploaded', subtext: activity.description, icon: <Upload size={14} />, color: 'var(--accent)' };
      case 'DOCUMENT_DELETED':
        return { text: 'Document Removed', subtext: activity.description, icon: <Trash2 size={14} />, color: 'var(--danger)' };
      case 'AUDIT_RUN':
        return { text: 'Compliance Audit Run', subtext: activity.description, icon: <ShieldCheck size={14} />, color: 'var(--success)' };
      case 'RULE_CREATED':
        return { text: 'Custom Rule Added', subtext: activity.description, icon: <PlusCircle size={14} />, color: 'var(--info)' };
      case 'RULE_DELETED':
        return { text: 'Rule Deleted', subtext: activity.description, icon: <Trash2 size={14} />, color: 'var(--warn)' };
      default:
        return { text: 'System Action', subtext: activity.description, icon: <Activity size={14} />, color: 'var(--text-muted)' };
    }
  };

  return (
    <Card style={{ padding: 0, overflow: 'hidden', height: '100%', minHeight: '400px' }} hover={false}>
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'rgba(255,255,255,0.01)',
      }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Activity Feed
        </div>
      </div>

      <div style={{ padding: '24px', position: 'relative' }}>
        {/* Timeline Line */}
        {activities.length > 0 && (
          <div style={{
            position: 'absolute',
            left: '43px',
            top: '32px',
            bottom: '32px',
            width: '2px',
            background: 'var(--border)',
            zIndex: 0
          }} />
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative', zIndex: 1 }}>
          {loading && activities.length === 0 ? (
            <div style={{ color: "var(--text-muted)", fontSize: "13px", padding: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid var(--border)", borderTopColor: "var(--accent)", animation: "spin 1s linear infinite" }} />
              Loading history...
            </div>
          ) : activities.length === 0 ? (
            <div style={{ color: "var(--text-muted)", fontSize: "13px", textAlign: "center", padding: "20px 0" }}>
              No recent activity found.
            </div>
          ) : (
            <AnimatePresence>
              {activities.map((item, index) => {
                const config = getActionConfig(item);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05, duration: 0.2, ease: 'easeOut' }}
                    style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}
                  >
                    <div style={{
                      width: '40px', height: '40px',
                      borderRadius: '50%',
                      background: `var(--bg-surface)`,
                      border: `2px solid ${config.color}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: config.color,
                      flexShrink: 0,
                      boxShadow: `0 0 10px ${config.color}33`,
                      zIndex: 2
                    }}>
                      {config.icon}
                    </div>

                    <div style={{ flex: 1, paddingTop: '2px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>
                          {config.text}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {formatTimeAgo(item.created_at)}
                        </div>
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {config.subtext}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </Card>
  );
}
