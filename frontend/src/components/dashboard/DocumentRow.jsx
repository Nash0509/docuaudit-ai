import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteDocument } from "../../services/api";
import { FileText, ChevronDown, AlertTriangle, Trash2, Eye, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuditConfigModal from "../audit/AuditConfigModal";
import useMediaQuery from "../../utils/useMediaQuery";

function StatusBadge({ status }) {
  const cfg = {
    ready: { bg: "var(--success-light)", text: "var(--success)", border: "var(--success-border)", dot: "var(--success)" },
    processing: { bg: "var(--warn-light)", text: "var(--warn)", border: "var(--warn-border)", dot: "var(--warn)" },
    uploading: { bg: "var(--info-light)", text: "var(--info)", border: "var(--info-border)", dot: "var(--info)" },
    error: { bg: "var(--danger-light)", text: "var(--danger)", border: "var(--danger-border)", dot: "var(--danger)" },
    default: { bg: "var(--bg-surface-hover)", text: "var(--text-secondary)", border: "var(--border)", dot: "var(--text-muted)" }
  };
  const c = cfg[status] || cfg.default;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, background: c.dot }} />
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
}

function RiskBadge({ score }) {
  if (!score && score !== 0) return <span style={{ fontSize: 12, color: "var(--text-muted)" }}>—</span>;
  const cfg = score >= 70 ? { bg: "var(--danger-light)", text: "var(--danger)", border: "var(--danger-border)", label: "High" }
    : score >= 40 ? { bg: "var(--warn-light)", text: "var(--warn)", border: "var(--warn-border)", label: "Medium" }
      : { bg: "var(--success-light)", text: "var(--success)", border: "var(--success-border)", label: "Low" };
  
  return <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}>{cfg.label} · {score}</span>;
}

function InfoItem({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{value}</div>
    </div>
  );
}

export default function DocumentRow({ variant, doc, onAuditComplete }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [auditData, setAuditData] = useState(null);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const navigate = useNavigate();

  function handleAuditComplete(result) {
    setAuditData(result);
    if (onAuditComplete) onAuditComplete();
  }

  async function handleDelete(e) {
    if (e) e.stopPropagation();
    try {
      await deleteDocument(doc.document_id);
      if (onAuditComplete) onAuditComplete();
      setShowDeleteModal(false);
    } catch (e) { console.log(e); }
  }

  const riskScore = auditData?.risk_score ?? (doc.audited ? doc.audit_result?.risk_score : null);
  const uploadDate = doc.uploaded_at
    ? new Date(doc.uploaded_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Just now";

  return (
    <>
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", alignItems: "center", gap: 16,
          padding: "14px 20px", borderBottom: `1px solid var(--border)`, cursor: "pointer",
          background: open ? "var(--bg-surface-hover)" : "var(--bg-surface)", transition: "background 0.2s", position: "relative"
        }}
        onMouseEnter={(e) => { if (!open) e.currentTarget.style.background = "var(--bg-surface-hover)"; }}
        onMouseLeave={(e) => { if (!open) e.currentTarget.style.background = "var(--bg-surface)"; }}
      >
        {/* Left indicator */}
        <div style={{ position: "absolute", left: 0, width: 2, height: 32, borderRadius: "0 4px 4px 0", background: "var(--accent)", transition: "opacity 0.2s", opacity: open ? 1 : 0 }} />

        {/* Document Info */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ChevronDown
            size={15}
            color="var(--text-muted)"
            style={{ flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(0deg)" : "rotate(-90deg)" }}
          />
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--accent-light)", border: "1px solid var(--border-accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <FileText size={15} color="var(--accent)" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.2 }}>{doc.filename}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{uploadDate}</div>
          </div>
        </div>

        <StatusBadge status={doc.status} />
        <RiskBadge score={riskScore} />
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{doc.audited ? "Recently" : "Never audited"}</div>
      </div>

      {/* Expanded Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: "hidden", borderBottom: "1px solid var(--border)" }}
          >
            <div style={{ background: "var(--bg-surface-hover)", padding: isMobile ? 16 : 24, display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
                <InfoItem label="Sections / Chunks" value={doc.chunks || "—"} />
                <InfoItem label="Status" value={doc.audited ? "Audited" : "Pending"} />
                <InfoItem label="Risk Score" value={riskScore != null ? riskScore : "—"} />
                <InfoItem label="Rules Checked" value={doc.audited ? "Active" : "—"} />
              </div>

              {!doc.audited ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-surface)", border: "1px dashed var(--border-hover)", borderRadius: 12, padding: 16 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Ready for Audit</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Run AI compliance check on this document</div>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true); }} className="btn btn-danger btn-sm">
                      <Trash2 size={13} /> Delete
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setShowAuditModal(true); }} className="btn btn-primary btn-sm">
                      <Activity size={13} /> Run Audit
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, color: "var(--warn)" }}>
                    <AlertTriangle size={14} />
                    <span style={{ fontWeight: 600, fontSize: 13 }}>Key Findings</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--danger)", marginTop: 6, flexShrink: 0 }} />
                      Missing limitation of liability cap amount.
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--warn)", marginTop: 6, flexShrink: 0 }} />
                      Auto-renewal clause exceeds standard 30-day notice period.
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                    <button onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true); }} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--danger)", fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}>
                      <Trash2 size={13} /> Delete
                    </button>
                    <button onClick={() => navigate(`/report/${doc.document_id}`)} className="btn btn-sm" style={{ background: "var(--info-light)", color: "var(--info)", border: "1px solid var(--info-border)" }}>
                      <Eye size={13} /> View Full Report
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.3)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 8 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 8 }}
              style={{ width: 384, background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 24, boxShadow: "var(--shadow-elevated)" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--danger-light)", border: "1px solid var(--danger-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Trash2 size={17} color="var(--danger)" />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>Delete Document</h3>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20, lineHeight: 1.5 }}>
                This will permanently remove <strong style={{ color: "var(--text-primary)" }}>{doc.filename}</strong> along with all associated audits and AI embeddings. This action cannot be undone.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setShowDeleteModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button onClick={handleDelete} className="btn btn-danger" style={{ flex: 1 }}>Delete Permanently</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showAuditModal && (
        <AuditConfigModal
          isOpen={showAuditModal}
          onClose={() => setShowAuditModal(false)}
          documentId={doc.document_id}
          onAuditComplete={handleAuditComplete}
        />
      )}
    </>
  );
}
