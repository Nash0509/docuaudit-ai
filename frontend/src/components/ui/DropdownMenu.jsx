import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DropdownMenu({ items }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={menuRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        style={{
          background: isOpen ? 'var(--bg-surface-hover)' : 'transparent',
          border: 'none',
          color: isOpen ? 'var(--text-primary)' : 'var(--text-muted)',
          cursor: 'pointer',
          padding: '6px',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all var(--ease-out)',
        }}
      >
        <MoreHorizontal size={16} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              marginTop: '4px',
              minWidth: '160px',
              background: 'rgba(15, 23, 42, 0.98)',
              backdropFilter: 'blur(16px)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '6px',
              boxShadow: 'var(--shadow-lg), 0 0 0 1px rgba(255,255,255,0.02)',
              zIndex: 50,
              transformOrigin: 'top right'
            }}
          >
            {items.map((item, index) => {
              if (item.type === 'divider') {
                return <div key={`div-${index}`} style={{ height: '1px', background: 'var(--border)', margin: '4px -6px' }} />;
              }

              return (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                    if (item.onClick) item.onClick(e);
                  }}
                  disabled={item.disabled}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    padding: '8px 10px',
                    borderRadius: '4px',
                    color: item.danger ? 'var(--danger)' : 'var(--text-primary)',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: item.disabled ? 'not-allowed' : 'pointer',
                    opacity: item.disabled ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'background var(--ease-out)'
                  }}
                  onMouseEnter={(e) => { if (!item.disabled) e.currentTarget.style.background = item.danger ? 'var(--danger-dim)' : 'var(--bg-surface-hover)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  {item.icon && <span style={{ opacity: 0.7 }}>{item.icon}</span>}
                  {item.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
