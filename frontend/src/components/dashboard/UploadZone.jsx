import { useState } from "react";
import { Upload, FileText, CheckCircle, XCircle, Trash2, RefreshCw, CloudUpload } from "lucide-react";
import { uploadDocument } from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";

import useStore from "../../utils/Store";
import { useNavigate } from "react-router-dom";

export default function UploadZone({ onUploadSuccess }) {
  const [drag, setDrag] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  
  const user = useStore(state => state.user);
  const navigate = useNavigate();

  function handleDrop(e) {
    e.preventDefault();
    setDrag(false);
    
    // Quick frontend check before uploading
    if (user?.audit_count >= 1 && !user?.is_subscribed) {
       navigate("/pricing");
       return;
    }

    const dropped = e.dataTransfer.files[0];
    if (dropped) { setFile(dropped); resetStates(); }
  }

  function resetStates() {
    setUploading(false); setSuccess(false); setError(false);
  }

  function removeFile() { setFile(null); resetStates(); }
  
  function handleFileSelect(e) {
     if (user?.audit_count >= 1 && !user?.is_subscribed) {
        navigate("/pricing");
        return;
     }
     setFile(e.target.files[0]);
     resetStates();
  }

  async function startUpload() {
    if (!file) return;
    setUploading(true); setError(false); setSuccess(false);
    try {
      await uploadDocument(file);
      setSuccess(true); setFile(null);
      if (onUploadSuccess) onUploadSuccess();
    } catch (e) {
      if (e.response && e.response.status === 402) {
         navigate("/pricing");
         return;
      }
      setError(true);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        style={{
          background: drag ? "var(--accent-light)" : "var(--bg-surface-hover)",
          border: `2px dashed ${drag ? "var(--accent)" : "var(--border)"}`,
          borderRadius: "var(--radius-lg)",
          padding: "36px",
          textAlign: "center",
          transition: "all 0.2s ease",
          cursor: "default",
          opacity: drag ? 1 : 0.8
        }}
      >
        <div style={{
          width: "52px",
          height: "52px",
          borderRadius: "14px",
          background: drag ? "var(--bg-surface)" : "var(--bg-surface)",
          border: `1px solid ${drag ? "var(--accent)" : "var(--border)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
          transition: "all 0.2s",
        }}>
          <CloudUpload size={24} color={drag ? "var(--accent)" : "var(--text-muted)"} />
        </div>

        <div style={{ fontSize: "16px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "6px" }}>
          {drag ? "Drop your contract here" : "Upload Contract Document"}
        </div>
        <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "18px" }}>
          Drag & drop your PDF or click to browse
        </div>

        <input type="file" accept=".pdf" style={{ display: "none" }} id="fileUpload" onChange={handleFileSelect} />
        <label htmlFor="fileUpload" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "var(--accent)",
          padding: "9px 22px",
          borderRadius: "var(--radius-md)",
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "13px",
          color: "white",
          boxShadow: "var(--shadow-sm)",
          transition: "opacity 0.2s",
        }}>
          <Upload size={15} /> Browse Files
        </label>

        <div style={{ marginTop: "12px", fontSize: "11px", color: "var(--text-muted)" }}>
          Supports PDF · Max 50MB
        </div>
      </div>

      {/* File Preview */}
      <AnimatePresence>
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "14px 16px",
              marginTop: "12px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              boxShadow: "var(--shadow-sm)"
            }}
          >
            <div style={{ background: "var(--accent-light)", padding: "10px", borderRadius: "10px", border: "1px solid var(--info-border)" }}>
              <FileText size={18} color="var(--accent)" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "14px", fontWeight: "500", color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {file.name}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              <label htmlFor="fileUpload" style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-surface-hover)", border: "1px solid var(--border)", borderRadius: "8px", cursor: "pointer" }}>
                <RefreshCw size={13} color="var(--text-secondary)" />
              </label>
              <button onClick={removeFile} style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--danger-light)", border: "1px solid var(--danger-border)", borderRadius: "8px", cursor: "pointer", color: "var(--danger)" }}>
                <Trash2 size={13} />
              </button>
              <button onClick={startUpload} disabled={uploading} style={{ padding: "0 16px", height: "32px", background: uploading ? "var(--info-light)" : "var(--info)", border: "none", borderRadius: "8px", cursor: uploading ? "not-allowed" : "pointer", color: "white", fontWeight: "600", fontSize: "12px", fontFamily: "inherit" }}>
                {uploading ? "Uploading…" : "Upload"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploading shimmer bar */}
      <AnimatePresence>
        {uploading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ marginTop: "10px", background: "var(--bg-surface-hover)", height: "4px", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ height: "100%", background: "linear-gradient(90deg, transparent, var(--accent), transparent)", backgroundSize: "200px 100%", animation: "shimmer 1.2s infinite", borderRadius: "2px" }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status banners */}
      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "8px", color: "var(--success)", background: "var(--success-light)", border: "1px solid var(--success-border)", padding: "8px 12px", borderRadius: "var(--radius-md)", fontSize: "13px" }}>
            <CheckCircle size={15} /> Document uploaded and queued for processing
          </motion.div>
        )}
        {error && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "8px", color: "var(--danger)", background: "var(--danger-light)", border: "1px solid var(--danger-border)", padding: "8px 12px", borderRadius: "var(--radius-md)", fontSize: "13px" }}>
            <XCircle size={15} /> Upload failed — check file format or size and try again
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
