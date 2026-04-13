import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Settings, ShieldAlert, Upload, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useShortcut from '../../utils/useShortcut';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Toggle shortcut
  useShortcut(['Control', 'k'], () => setIsOpen((prev) => !prev));
  
  // Close on Escape
  useEffect(() => {
    const down = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const resetAndClose = () => {
    setIsOpen(false);
    setQuery('');
    setActiveIndex(0);
  };

  const actions = [
    { id: 'docs', label: 'Go to Documents', icon: <FileText size={16} />, onAction: () => navigate('/documents') },
    { id: 'rules', label: 'Manage Rules', icon: <ShieldAlert size={16} />, onAction: () => navigate('/rules') },
    { id: 'reports', label: 'View Reports', icon: <ArrowRight size={16} />, onAction: () => navigate('/reports') },
    { id: 'settings', label: 'Settings', icon: <Settings size={16} />, onAction: () => navigate('/settings') },
    { id: 'upload', label: 'Upload Document', icon: <Upload size={16} />, onAction: () => { navigate('/'); setTimeout(() => document.getElementById('fileUpload')?.click(), 100); } }
  ];

  const filteredActions = actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()));

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % filteredActions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + filteredActions.length) % filteredActions.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredActions[activeIndex]) {
          filteredActions[activeIndex].onAction();
          resetAndClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, filteredActions]);

  // Auto focus
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setActiveIndex(0);
    }
  }, [isOpen, query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={resetAndClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 9999,
            }}
          />
          {/* Palette */}
          <div style={{
            position: 'fixed', inset: 0,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            paddingTop: '12vh', pointerEvents: 'none', zIndex: 10000
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{
                width: '100%', maxWidth: '600px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-elevated)',
                overflow: 'hidden',
                pointerEvents: 'auto',
                display: 'flex', flexDirection: 'column',
                backdropFilter: 'blur(16px)',
              }}
            >
              {/* Input */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                <Search size={20} color="var(--text-muted)" style={{ marginRight: '16px' }} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a command or search..."
                  style={{
                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                    color: 'var(--text-primary)', fontSize: '18px', fontFamily: 'inherit'
                  }}
                />
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <kbd style={kbdStyle}>ESC</kbd>
                </div>
              </div>

              {/* List */}
              <div style={{ maxHeight: '340px', overflowY: 'auto', padding: '12px' }}>
                {filteredActions.length === 0 ? (
                  <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                    No results found.
                  </div>
                ) : (
                  filteredActions.map((action, index) => (
                    <motion.div
                      key={action.id}
                      onClick={() => { action.onAction(); resetAndClose(); }}
                      onMouseEnter={() => setActiveIndex(index)}
                      style={{
                        padding: '12px 16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-md)',
                        background: activeIndex === index ? 'var(--bg-surface-hover)' : 'transparent',
                        color: activeIndex === index ? 'var(--text-primary)' : 'var(--text-secondary)',
                        transition: 'background 0.1s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '14px', fontWeight: '500' }}>
                        <span style={{ color: activeIndex === index ? 'var(--accent)' : 'var(--text-muted)', display: 'flex' }}>
                          {action.icon}
                        </span>
                        {action.label}
                      </div>
                      {activeIndex === index && (
                        <kbd style={{ ...kbdStyle, display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent', border: 'none' }}>
                          <CornerDownLeft size={12} /> Enter
                        </kbd>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

const kbdStyle = {
  background: 'var(--bg-base)',
  border: '1px solid var(--border)',
  borderRadius: '4px',
  padding: '4px 6px',
  fontSize: '10px',
  fontWeight: '700',
  color: 'var(--text-muted)',
  fontFamily: 'var(--font-mono)',
  boxShadow: '0 1px 0 var(--border)'
};
