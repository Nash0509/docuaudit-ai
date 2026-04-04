import { motion } from 'framer-motion';
import Button from './Button';

export default function EmptyState({ icon, title, description, actionText, onAction, style }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-surface)',
        border: '1px dashed var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '60px 20px',
        textAlign: 'center',
        ...style
      }}
    >
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: 'var(--bg-surface-hover)',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
        color: 'var(--text-muted)'
      }}>
        {icon}
      </div>
      
      <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
        {title}
      </h3>
      
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 24px 0', maxWidth: '300px', lineHeight: '1.5' }}>
        {description}
      </p>
      
      {actionText && onAction && (
        <Button variant="secondary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </motion.div>
  );
}
