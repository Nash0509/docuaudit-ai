import { motion } from 'framer-motion';

export default function NotificationSkeleton() {
  return (
    <div style={{ padding: '0 16px' }}>
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
          style={{
            display: 'flex',
            gap: '12px',
            padding: '14px 12px',
            marginBottom: '4px',
            borderRadius: '10px',
          }}
        >
          {/* Icon skeleton */}
          <div style={{
            width: '34px', height: '34px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            flexShrink: 0,
            animation: 'shimmer 1.6s ease-in-out infinite',
          }} />

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '2px' }}>
            {/* Title */}
            <div style={{
              height: '12px', borderRadius: '6px', width: '55%',
              background: 'rgba(255,255,255,0.05)',
              animation: 'shimmer 1.6s ease-in-out infinite',
            }} />
            {/* Message */}
            <div style={{
              height: '10px', borderRadius: '6px', width: '80%',
              background: 'rgba(255,255,255,0.04)',
              animation: 'shimmer 1.6s ease-in-out infinite 0.1s',
            }} />
            {/* Time */}
            <div style={{
              height: '9px', borderRadius: '6px', width: '30%',
              background: 'rgba(255,255,255,0.03)',
              animation: 'shimmer 1.6s ease-in-out infinite 0.2s',
            }} />
          </div>
        </motion.div>
      ))}

      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
