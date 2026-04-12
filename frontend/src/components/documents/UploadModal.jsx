import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertTriangle, Loader2, FileText } from "lucide-react";
import { uploadDocument } from "../../services/api";

const SIMULATED_LOGS = [
  "Initializing secure upload connection...",
  "Authenticating API credentials...",
  "Reading local file stream...",
  "Transmitting bytes to server vault...",
  "Starting AI ingestion engine...",
  "Extracting raw text content...",
  "Chunking logical document structures...",
  "Generating dense vector embeddings...",
  "Indexing to vector database...",
  "Finalizing document record...",
];

export default function UploadModal({ isOpen, file, onClose, onSuccess }) {
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const logsEndRef = useRef(null);

  useEffect(() => {
    if (logsEndRef.current) logsEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  useEffect(() => {
    if (!isOpen || !file) return;
    let isMounted = true;
    let logIndex = 0;

    setLogs([`Starting upload sequence for: ${file.name}`]);
    setStatus("uploading");

    const logInterval = setInterval(() => {
      if (logIndex < SIMULATED_LOGS.length) {
        setLogs((prev) => [...prev, SIMULATED_LOGS[logIndex]]);
        logIndex++;
      }
    }, 900);

    const doUpload = async () => {
      try {
        await uploadDocument(file);
        if (!isMounted) return;
        clearInterval(logInterval);
        setLogs((prev) => [...prev, "✓ Upload complete — document indexed successfully."]);
        setStatus("success");
        setTimeout(() => { if (isMounted) onSuccess(); }, 1200);
      } catch (err) {
        if (!isMounted) return;
        clearInterval(logInterval);
        if (err.response?.status === 402) {
          setLogs((prev) => [...prev, "✗ Trial limit reached. Upgrade to continue."]);
          setStatus("error");
          setErrorMsg("You have reached your free tier limit. Please upgrade your plan to continue uploading.");
        } else {
          setLogs((prev) => [...prev, "✗ Upload failed. Please check the file and try again."]);
          setStatus("error");
          setErrorMsg("Upload failed. Ensure the file is a valid PDF and try again.");
        }
      }
    };

    doUpload();
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
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
        >
          <motion.div
            initial={{ scale: 0.96, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 12 }}
            className="w-full max-w-md bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                {status === "uploading" && <Loader2 size={17} className="text-indigo-500 animate-spin" />}
                {status === "success" && <CheckCircle2 size={17} className="text-emerald-500" />}
                {status === "error" && <AlertTriangle size={17} className="text-red-500" />}
                {status === "idle" && <FileText size={17} className="text-indigo-400" />}
                <span className="text-sm font-semibold text-slate-800">
                  {status === "uploading" ? "Uploading Document..." :
                    status === "success" ? "Upload Complete" :
                      status === "error" ? "Upload Failed" : "Document Upload"}
                </span>
              </div>
              {status !== "uploading" && (
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors" style={{ background: "none", border: "none", cursor: "pointer" }}>
                  <X size={17} />
                </button>
              )}
            </div>

            {/* Terminal Log */}
            <div className="p-4 bg-slate-900 min-h-[200px] max-h-[280px] overflow-y-auto font-mono text-xs">
              {logs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`mb-2 leading-relaxed flex items-start gap-2 ${
                    log.startsWith("✓") ? "text-emerald-400"
                      : log.startsWith("✗") ? "text-red-400"
                        : i === 0 ? "text-slate-400"
                          : "text-slate-300"
                  }`}
                >
                  <span className="text-slate-600 flex-shrink-0">{i === 0 ? "→" : "·"}</span>
                  {log}
                </motion.div>
              ))}
              {status === "uploading" && (
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              )}
              <div ref={logsEndRef} />
            </div>

            {/* Error Footer */}
            {status === "error" && (
              <div className="px-5 py-4 bg-red-50 border-t border-red-100">
                <p className="text-xs text-red-600 leading-relaxed mb-3">{errorMsg}</p>
                <div className="flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    style={{ fontFamily: "inherit" }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
