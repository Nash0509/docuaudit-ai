import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, FileText, Loader2, AlertTriangle } from "lucide-react";
import { uploadDocument } from "../../services/api";

const SIMULATED_LOGS = [
  "Initializing secure connection...",
  "Authenticating upload credentials...",
  "Reading local file stream...",
  "Transmitting bytes to server vault...",
  "Starting AI ingestion engine...",
  "Extracting raw text payload...",
  "Chunking logical document structures...",
  "Generating dense vector embeddings...",
  "Indexing to vector database...",
  "Finalizing document status..."
];

export default function UploadModal({ isOpen, file, onClose, onSuccess }) {
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("idle"); // idle, uploading, success, error
  const [errorMsg, setErrorMsg] = useState("");
  const logsEndRef = useRef(null);

  useEffect(() => {
    if (logsEndRef.current) logsEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  useEffect(() => {
    if (!isOpen || !file) return;

    let isMounted = true;
    let logIndex = 0;
    
    setLogs([`> Starting upload sequence for: ${file.name}`]);
    setStatus("uploading");
    
    const logInterval = setInterval(() => {
      if (logIndex < SIMULATED_LOGS.length) {
        setLogs(prev => [...prev, `> ${SIMULATED_LOGS[logIndex]}`]);
        logIndex++;
      }
    }, 850);

    const performUpload = async () => {
      try {
        await uploadDocument(file);
        if (!isMounted) return;
        clearInterval(logInterval);
        setLogs(prev => [...prev, "> STATUS 200: Operations converged. Complete!"]);
        setStatus("success");
        setTimeout(() => {
          if (isMounted) onSuccess();
        }, 1200);
      } catch (err) {
        if (!isMounted) return;
        clearInterval(logInterval);
        setLogs(prev => [...prev, "> FATAL: Upload pipeline compromised or rejected."]);
        setStatus("error");
        setErrorMsg("Failed to upload document. Please ensure it is a valid PDF.");
      }
    };

    performUpload();

    return () => {
      isMounted = false;
      clearInterval(logInterval);
      setLogs([]);
      setStatus("idle");
      setErrorMsg("");
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
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 9999, padding: "20px"
          }}
        >
          <motion.div
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 15 }}
            style={{
              width: "100%", maxWidth: "560px",
              background: "var(--bg-panel, #0f172a)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)"
            }}
          >
            {/* Header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 20px", borderBottom: "1px solid var(--border)",
              background: "rgba(255,255,255,0.02)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {status === "uploading" ? (
                  <Loader2 size={18} color="var(--accent)" style={{ animation: "spin 1s linear infinite" }} />
                ) : status === "success" ? (
                  <CheckCircle2 size={18} color="#22c55e" />
                ) : status === "error" ? (
                  <AlertTriangle size={18} color="#ef4444" />
                ) : (
                  <FileText size={18} color="var(--accent)" />
                )}
                <span style={{ fontWeight: "600", fontSize: "15px", color: "var(--text-primary)" }}>
                  {status === "uploading" ? "Uploading Document..." : 
                   status === "success" ? "Upload Complete" : 
                   status === "error" ? "Upload Failed" : "Document Upload"}
                </span>
              </div>
              {status !== "uploading" && (
                <button 
                  onClick={onClose}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Terminal Window */}
            <div style={{
              padding: "20px", background: "#020617",
              minHeight: "240px", maxHeight: "320px", overflowY: "auto",
              fontFamily: "monospace", fontSize: "12px", color: "#38bdf8"
            }}>
              {logs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{ 
                    marginBottom: "8px", 
                    color: log.includes("ERROR") || log.includes("FATAL") ? "#ef4444" 
                          : log.includes("STATUS 200") ? "#22c55e" : "#38bdf8",
                    lineHeight: "1.5"
                  }}
                >
                  {log}
                </motion.div>
              ))}
              <div ref={logsEndRef} />
            </div>

            {/* Error Message */}
            {status === "error" && (
              <div style={{ padding: "16px 20px", background: "rgba(239, 68, 68, 0.1)", borderTop: "1px solid rgba(239, 68, 68, 0.2)" }}>
                <p style={{ margin: 0, color: "#ef4444", fontSize: "13px" }}>{errorMsg}</p>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
                  <button 
                    onClick={onClose}
                    style={{
                      padding: "6px 14px", background: "var(--bg-surface)", border: "1px solid var(--border)",
                      color: "var(--text-primary)", borderRadius: "6px", cursor: "pointer", fontSize: "13px"
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
            
            {/* Required CSS for spin if not exist */}
            <style>{`
              @keyframes spin {
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
