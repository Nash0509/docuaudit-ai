import { motion } from 'framer-motion';

export default function Skeleton({ width = '100%', height = '20px', borderRadius = 'var(--radius-md)', style = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ 
        repeat: Infinity, 
        duration: 2, 
        ease: "easeInOut" 
      }}
      style={{
        width,
        height,
        borderRadius,
        background: 'var(--bg-surface-hover)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        position: 'relative',
        ...style
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '50%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, var(--bg-elevated), transparent)',
        animation: 'shimmer 2.5s infinite linear'
      }} />
    </motion.div>
  );
}
