import { motion } from 'framer-motion';
import { Upload, ShieldCheck, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import Card from '../ui/Card';

export default function ActivityFeed() {
  const activities = [
    { id: 1, type: 'upload', text: 'MSA Agreement uploaded', subtext: 'Queued for vector processing', time: '2 min ago', icon: <Upload size={14} />, color: 'var(--accent)' },
    { id: 2, type: 'audit', text: 'Compliance audit completed', subtext: 'Vendor Contract - 12 rules passed', time: '10 min ago', icon: <ShieldCheck size={14} />, color: 'var(--success)' },
    { id: 3, type: 'alert', text: 'Medium risk liability clause', subtext: 'NDA - flagged by AI reasoning', time: '25 min ago', icon: <AlertTriangle size={14} />, color: 'var(--warn)' },
    { id: 4, type: 'system', text: 'Document indexed', subtext: 'Sales Agreement added to Chroma', time: '1 hr ago', icon: <FileText size={14} />, color: 'var(--info)' },
  ];

  return (
    <Card style={{ padding: 0, overflow: 'hidden' }} hover={false}>
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
        <div style={{
          position: 'absolute',
          left: '43px',
          top: '32px',
          bottom: '32px',
          width: '2px',
          background: 'var(--border)',
          zIndex: 0
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative', zIndex: 1 }}>
          {activities.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3, ease: 'easeOut' }}
              style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}
            >
              <div style={{
                width: '40px', height: '40px',
                borderRadius: '50%',
                background: `var(--bg-surface)`,
                border: `2px solid ${item.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: item.color,
                flexShrink: 0,
                boxShadow: `0 0 10px ${item.color}33`,
                zIndex: 2
              }}>
                {item.icon}
              </div>

              <div style={{ flex: 1, paddingTop: '2px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>
                    {item.text}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {item.time}
                  </div>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {item.subtext}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
}
