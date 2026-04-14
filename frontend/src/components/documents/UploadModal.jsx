import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertTriangle, Loader2, FileText, Cpu, Server, Database, ShieldCheck } from "lucide-react";
import { uploadDocument } from "../../services/api";
import Button from "../ui/Button";

const INGESTION_STEPS = [
  { label: "Connection", desc: "Initializing secure conduit...", icon: <Server size={14} /> },
  { label: "Authentication", desc: "Verifying encrypted keys...", icon: <ShieldCheck size={14} /> },
  { label: "Transmission", desc: "Streaming document bytes...", icon: <Cpu size={14} /> },
  { label: "Ingestion", desc: "AI parsing content structure...", icon: <Database size={14} /> },
  { label: "Vectorization", desc: "Generating neural embeddings...", icon: <Database size={14} /> },
  { label: "Indexing", desc: "Finalizing cloud index...", icon: <CheckCircle2 size={14} /> },
];

function OrbitingLoader() {
  return (
    <div style={{ position: "relative", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", width: "100%", height: "100%", borderRadius: "50%", border: "2px solid var(--accent-light)", opacity: 0.3 }} />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        style={{ position: "absolute", width: "100%", height: "100%", borderRadius: "50%", border: "2px solid transparent", borderTopColor: "var(--accent)" }}
      />
      <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent)", animation: "orbit 1.5s linear infinite" }} />
      <Cpu size={14} style={{ color: "var(--accent)", opacity: 0.8 }} />
    </div>
  );
}

export default function UploadModal({ isOpen, file, onClose, onSuccess }) {
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const logsEndRef = useRef(null);

  useEffect(() => {
    if (logsEndRef.current) logsEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  useEffect(() => {
    if (!isOpen || !file) return;
    let isMounted = true;
    let currentStep = 0;

    setLogs([{ text: `Starting secure ingestion for: ${file.name}`, type: "info" }]);
    setStatus("uploading");

    const stepInterval = setInterval(() => {
      if (currentStep < INGESTION_STEPS.length) {
        const stepData = INGESTION_STEPS[currentStep];
        setStepIndex(currentStep);
        if (stepData) {
          setLogs((prev) => [...prev, { 
            text: stepData.desc, 
            type: "step",
            label: stepData.label 
          }]);
        }
        currentStep++;
      }
    }, 800);

    const doUpload = async () => {
      try {
        await uploadDocument(file);
        if (!isMounted) return;
        clearInterval(stepInterval);
        setLogs((prev) => [...prev, { text: "Document indexed successfully in secure vault.", type: "success" }]);
        setStatus("success");
        setTimeout(() => { if (isMounted) onSuccess(); }, 1500);
      } catch (err) {
        if (!isMounted) return;
        clearInterval(stepInterval);
        const msg = err.response?.status === 402 
          ? "Storage limit reached. Please upgrade to Pro for unlimited audits." 
          : "Secure ingestion failed. Please verify the document format.";
        setLogs((prev) => [...prev, { text: msg, type: "error" }]);
        setStatus("error");
        setErrorMsg(msg);
      }
    };

    doUpload();
    return () => {
      isMounted = false;
      clearInterval(stepInterval);
      setLogs([]);
      setStatus("idle");
      setStepIndex(0);
    };
  }, [isOpen, file]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ 
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(12px)", 
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 24 
          }}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            style={{ 
              width: "100%", maxWidth: 520, background: "var(--glass-bg)", 
              border: "1px solid var(--border-accent)", borderRadius: 24, overflow: "hidden", 
              boxShadow: "var(--shadow-elevated)", position: "relative"
            }}
          >
            {/* Header / Brand Overlay */}
            <div style={{ padding: "24px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <OrbitingLoader />
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                    AI Ingestion Engine
                  </div>
                  <div style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {status === "uploading" ? "Processing Stream..." : "System Standby"}
                  </div>
                </div>
              </div>
              {status !== "uploading" && (
                <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 10, background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Main Console Area */}
            <div style={{ position: "relative", padding: 28, background: "rgba(0,0,0,0.02)", minHeight: 320 }}>
              {/* Scan Line Effect */}
              {status === "uploading" && (
                <div style={{ 
                  position: "absolute", inset: 0, padding: 28, overflow: "hidden", pointerEvents: "none", zIndex: 1 
                }}>
                  <div style={{ 
                    width: "100%", height: "2px", background: "linear-gradient(90deg, transparent, var(--accent), transparent)", 
                    opacity: 0.3, boxShadow: "0 0 15px var(--accent)", animation: "scan 3s linear infinite" 
                  }} />
                </div>
              )}

              {/* Console Body */}
              <div style={{ 
                height: 260, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, 
                scrollbarWidth: "none", msOverflowStyle: "none" 
              }}>
                {logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ 
                      display: "flex", alignItems: "flex-start", gap: 12, opacity: i === logs.length - 1 ? 1 : 0.5 
                    }}
                  >
                    <div style={{ 
                      marginTop: 4, width: 6, height: 6, borderRadius: "50%", 
                      background: log.type === "success" ? "var(--success)" : log.type === "error" ? "var(--danger)" : "var(--accent)" 
                    }} />
                    <div style={{ flex: 1 }}>
                      {log.label && (
                        <div style={{ fontSize: 10, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 2 }}>
                          {log.label}
                        </div>
                      )}
                      <div style={{ 
                        fontSize: 13, color: log.type === "error" ? "var(--danger)" : "var(--text-primary)", 
                        fontFamily: "var(--font-mono)", fontWeight: 500, lineHeight: 1.5 
                      }}>
                        {log.text}
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={logsEndRef} />
              </div>

              {/* Progress Footer */}
              {status === "uploading" && (
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)" }}>Total Progress</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)" }}>{Math.round((stepIndex + 1) / INGESTION_STEPS.length * 100)}%</span>
                  </div>
                  <div style={{ width: "100%", height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(stepIndex + 1) / INGESTION_STEPS.length * 100}%` }}
                      style={{ height: "100%", background: "var(--accent)", boxShadow: "0 0 10px var(--accent-light)" }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Overlays */}
            <AnimatePresence>
              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ 
                    position: "absolute", inset: 0, background: "var(--success-light)", backdropFilter: "blur(4px)",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 10
                  }}
                >
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--success)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    <CheckCircle2 size={28} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--success)" }}>Vault Secured</h3>
                  <p style={{ fontSize: 13, color: "var(--success)", opacity: 0.8 }}>Ingestion complete. Document ready for auditing.</p>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ 
                    position: "absolute", inset: 0, background: "var(--danger-light)", backdropFilter: "blur(4px)",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 10, padding: 32, textAlign: "center"
                  }}
                >
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--danger)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    <AlertTriangle size={28} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--danger)" }}>Ingestion Interrupted</h3>
                  <p style={{ fontSize: 13, color: "var(--danger)", opacity: 0.8, marginBottom: 24 }}>{errorMsg}</p>
                  <Button variant="danger" onClick={onClose} style={{ padding: "10px 24px" }}>Acknowledge</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
