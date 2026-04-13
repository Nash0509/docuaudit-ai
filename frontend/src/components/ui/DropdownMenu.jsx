import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DropdownMenu({ items, trigger, align = 'right', onOpenChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (onOpenChange) onOpenChange(isOpen);
  }, [isOpen, onOpenChange]);

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

  const defaultTrigger = (
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
        transition: 'all 0.15s ease',
      }}
    >
      <MoreHorizontal size={16} />
    </button>
  );

  return (
    <div ref={menuRef} style={{ position: 'relative', display: 'inline-block' }}>
      <div 
        onClick={(e) => {
          if (!trigger) return; // Default trigger handles its own click
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        style={{ cursor: trigger ? 'pointer' : 'default' }}
      >
        {trigger || defaultTrigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 30, 
              mass: 0.8 
            }}
            style={{
              position: 'absolute',
              [align]: 0,
              top: '100%',
              marginTop: '8px',
              minWidth: '220px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '8px',
              boxShadow: 'var(--shadow-elevated)',
              zIndex: 1000,
              transformOrigin: align === 'right' ? 'top right' : 'top left'
            }}
          >
            {items.map((item, index) => {
              if (item.type === 'divider') {
                return (
                  <div 
                    key={`div-${index}`} 
                    style={{ 
                      height: '1px', 
                      background: 'var(--border)', 
                      margin: '4px -6px' 
                    }} 
                  />
                );
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
                    padding: '10px 12px',
                    borderRadius: '8px',
                    color: item.danger ? 'var(--danger)' : 'var(--text-secondary)',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: item.disabled ? 'not-allowed' : 'pointer',
                    opacity: item.disabled ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => { 
                    if (!item.disabled) {
                      e.currentTarget.style.background = item.danger ? 'var(--danger-light)' : 'var(--bg-surface-hover)';
                      e.currentTarget.style.color = item.danger ? 'var(--danger)' : 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.background = 'transparent'; 
                    e.currentTarget.style.color = item.danger ? 'var(--danger)' : 'var(--text-secondary)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {item.icon && <span style={{ opacity: 0.8, display: 'flex' }}>{item.icon}</span>}
                    {item.label}
                  </div>
                  {item.shortcut && (
                    <span style={{ 
                      fontSize: '10px', 
                      color: 'var(--text-muted)', 
                      opacity: 0.5, 
                      fontFamily: 'monospace' 
                    }}>
                      {item.shortcut}
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
