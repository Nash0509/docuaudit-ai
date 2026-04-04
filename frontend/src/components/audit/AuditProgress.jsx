import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, FileSearch, ShieldCheck, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AuditProgress({ onComplete }) {
  const [step, setStep] = useState(0);

  const steps = [
    { title: "Retrieving Document", icon: <FileText size={20} color="var(--text-secondary)" /> },
    { title: "Extracting Text & Vectors", icon: <FileSearch size={20} color="var(--info)" /> },
    { title: "Evaluating Compliance Rules", icon: <ShieldAlertIcon size={20} color="var(--warn)" /> },
    { title: "Generating Actionable Insights", icon: <ShieldCheck size={20} color="var(--success)" /> }
  ];

  useEffect(() => {
    // Simulate real AI processing progression
    const timers = [];
    timers.push(setTimeout(() => setStep(1), 1500));
    timers.push(setTimeout(() => setStep(2), 3500));
    timers.push(setTimeout(() => setStep(3), 6500));
    timers.push(setTimeout(() => {
      setStep(4);
      if (onComplete) onComplete();
    }, 8500));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', width: '100%' }}>
      <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '24px' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          style={{ position: 'absolute', inset: 0, border: '2px dashed var(--border-accent)', borderRadius: '50%', opacity: 0.5 }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          style={{ position: 'absolute', inset: '10px', border: '2px solid transparent', borderTopColor: 'var(--accent)', borderRightColor: 'var(--accent)', borderRadius: '50%' }}
        />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 size={24} color="var(--accent)" style={{ animation: 'spin 1.5s linear infinite' }} />
        </div>
      </div>
      
      <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '32px' }}>
        Running Compliance Audit
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '320px' }}>
        {steps.map((s, idx) => {
          const isActive = step === idx;
          const isDone = step > idx;
          const isPending = step < idx;

          let color = "var(--text-secondary)";
          if (isActive) color = "var(--text-primary)";
          if (isDone) color = "var(--success)";

          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isPending ? 0.4 : 1, x: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
            >
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isDone ? "var(--success-dim)" : isActive ? "var(--bg-surface-hover)" : "transparent",
                border: `1px solid ${isDone ? "rgba(34,197,94,0.2)" : isActive ? "var(--border)" : "transparent"}`
              }}>
                {isDone ? <CheckCircle2 size={16} color="var(--success)" /> : isActive ? <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }} /> : <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)' }} />}
              </div>
              <div style={{ fontSize: '14px', fontWeight: isActive ? '600' : '500', color, transition: 'all 0.3s' }}>
                {s.title}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function ShieldAlertIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke={props.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/>
    </svg>
  );
}
