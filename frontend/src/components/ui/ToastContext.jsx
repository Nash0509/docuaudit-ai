import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'info', title, description, duration = 4000 }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, description }]);
    
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{
      success: (title, description) => addToast({ type: 'success', title, description }),
      error: (title, description) => addToast({ type: 'error', title, description }),
      info: (title, description) => addToast({ type: 'info', title, description }),
    }}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        zIndex: 9999,
        pointerEvents: 'none',
      }}>
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

// Individual Toast Component
function Toast({ toast, onClose }) {
  const icons = {
    success: <CheckCircle2 size={16} color="var(--success)" />,
    error: <AlertCircle size={16} color="var(--danger)" />,
    info: <Info size={16} color="var(--accent)" />
  };

  const bgColors = {
    success: 'var(--success-dim)',
    error: 'var(--danger-dim)',
    info: 'var(--accent-dim)'
  };
  
  const borderColors = {
    success: 'rgba(34, 197, 94, 0.2)',
    error: 'rgba(239, 68, 68, 0.2)',
    info: 'rgba(0, 212, 170, 0.2)'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      layout
      style={{
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(12px)',
        border: `1px solid var(--border)`,
        borderRadius: 'var(--radius-lg)',
        padding: '14px 16px',
        width: '320px',
        display: 'flex',
        gap: '12px',
        boxShadow: 'var(--shadow-lg), 0 0 20px rgba(0,0,0,0.4)',
        pointerEvents: 'auto',
      }}
    >
      <div style={{ 
        width: '28px', height: '28px', 
        borderRadius: '50%', 
        background: bgColors[toast.type], 
        border: `1px solid ${borderColors[toast.type]}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0
      }}>
        {icons[toast.type]}
      </div>
      
      <div style={{ flex: 1, minWidth: 0, paddingTop: '4px' }}>
        <h4 style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
          {toast.title}
        </h4>
        {toast.description && (
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            {toast.description}
          </p>
        )}
      </div>

      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '4px',
          height: 'fit-content',
          borderRadius: '4px',
        }}
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}
