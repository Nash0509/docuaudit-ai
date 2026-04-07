import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Select({ value, onChange, options, label, placeholder = 'Select an option', style }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Use String comparison to handle backend integers matching frontend option strings
  const safeValue = value !== undefined && value !== null ? String(value) : '';
  const selectedOption = options.find(opt => String(opt.value) === safeValue);

  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', ...style }}>
      {label && (
        <label style={{ 
          display: 'block', color: 'var(--text-secondary)', marginBottom: '8px', 
          fontSize: '13px', fontWeight: '500' 
        }}>
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        style={{
          width: '100%',
          height: '42px',
          padding: '0 14px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--bg-surface)',
          border: `1px solid ${isOpen ? 'var(--border-accent)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-md)',
          color: selectedOption ? 'var(--text-primary)' : 'var(--text-muted)',
          fontSize: '14px',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isOpen ? '0 0 0 2px rgba(0, 212, 170, 0.1)' : 'none',
          outline: 'none'
        }}
      >
        <span style={{ fontWeight: selectedOption ? '500' : '400' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          size={16} 
          style={{ 
            opacity: 0.5, 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }} 
        />
      </button>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 30, 
              mass: 0.8 
            }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              background: 'rgba(15, 23, 42, 0.98)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px',
              padding: '6px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
              zIndex: 1000,
              maxHeight: '260px',
              overflowY: 'auto',
              transformOrigin: 'top center'
            }}
          >
            {options.map((opt) => {
              const optStr = String(opt.value);
              const isSelected = optStr === safeValue;
              
              return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: isSelected ? '600' : '500',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => { 
                    if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => { 
                    if (!isSelected) e.currentTarget.style.background = 'transparent'; 
                    e.currentTarget.style.color = isSelected ? 'var(--text-primary)' : 'var(--text-secondary)';
                }}
              >
                {opt.label}
                {isSelected && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Check size={14} color="var(--accent)" />
                  </motion.div>
                )}
              </button>
            )})}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
