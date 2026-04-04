import { motion } from 'framer-motion';

export default function Skeleton({ width = '100%', height = '20px', borderRadius = 'var(--radius-md)', style = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ 
        repeat: Infinity, 
        duration: 1.5, 
        ease: "easeInOut" 
      }}
      style={{
        width,
        height,
        borderRadius,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.02)',
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
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)',
        animation: 'shimmer 2s infinite linear'
      }} />
    </motion.div>
  );
}
