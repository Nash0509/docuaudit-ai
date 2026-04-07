import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Badge from "../ui/Badge";
import RiskIndicator from "../ui/RiskIndicator";
import { deleteDocument } from "../../services/api";
import { FileText, ChevronDown, AlertTriangle, FileSearch, Trash2, Eye, Activity } from "lucide-react";
import RiskGauge from "../ui/RiskGuage";
import { useNavigate } from "react-router-dom";
import AuditConfigModal from "../audit/AuditConfigModal";
import Button from "../ui/Button";
import DropdownMenu from "../ui/DropdownMenu";

export default function DocumentRow({ variant, doc, onAuditComplete }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [auditData, setAuditData] = useState(null);
  const [showAuditModal, setShowAuditModal] = useState(false);

  const isDocuments = variant === "documents";
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
    } catch (e) {
      console.log(e);
    }
  }

  // Define dropdown actions
  const dropdownActions = [
    { 
      label: doc.audited ? "View Audit Report" : "Run Security Audit", 
      icon: doc.audited ? <Eye size={14} /> : <Activity size={14} />, 
      onClick: (e) => { e.stopPropagation(); if (doc.audited) { navigate(`/report/${doc.document_id}`); } else { setShowAuditModal(true); } } 
    },
    { type: 'divider' },
    { 
      label: "Delete Document", 
      icon: <Trash2 size={14} />, 
      danger: true, 
      onClick: (e) => { e.stopPropagation(); setShowDeleteModal(true); } 
    }
  ];

  return (
    <>
      <div
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          padding: "12px 20px",
          borderBottom: "1px solid var(--border)",
          alignItems: "center",
          cursor: "pointer",
          transition: "background var(--ease-out)",
          background: open ? "var(--bg-surface-hover)" : "transparent",
          position: "relative",
          minHeight: "64px"
        }}
      >
        {/* Hover Highlight line */}
        <div style={{
          position: "absolute",
          left: 0,
          top: "15%",
          height: "70%",
          width: "3px",
          background: "var(--accent)",
          borderRadius: "0 4px 4px 0",
          opacity: open ? 1 : 0,
          transition: "opacity var(--ease-out)",
        }} />

        {/* Document Info */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <ChevronDown
            size={16}
            color="var(--text-muted)"
            style={{ transform: open ? "rotate(180deg)" : "rotate(-90deg)", transition: "transform var(--ease-out)" }}
          />
          <div style={{ background: "var(--bg-surface-hover)", padding: "10px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
            <FileText size={16} color="var(--text-secondary)" />
          </div>
          <div>
            <div style={{ fontWeight: "500", fontSize: "14px", color: "var(--text-primary)", marginBottom: "2px" }}>
              {doc.filename}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              {doc.uploaded_at || "Just now"}
            </div>
          </div>
        </div>

        {/* Status */}
        <div>
          <Badge text={doc.status} />
        </div>

        {/* Risk Level */}
        <div>
          {doc.audited ? (
            <RiskIndicator level="medium" />
          ) : (
            <Badge text="Pending Audit" dot={false} style={{ background: "var(--bg-surface)", color: "var(--text-muted)" }} />
          )}
        </div>

        {/* Last Audit Time */}
        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
          {doc.audited ? "Recently" : "Never"}
        </div>


      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ overflow: "hidden", background: "var(--bg-surface)" }}
          >
            <div style={{ padding: "24px 32px", borderBottom: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "flex", gap: "48px", alignItems: "center" }}>
                <RiskGauge score={auditData?.risk_score || (doc.audited ? 65 : 0)} />
                <div style={{ display: "flex", gap: "32px" }}>
                  <InfoItem label="Sections" value={doc.chunks || "–"} />
                  <InfoItem label="Status" value={doc.audited ? "Audited" : "Pending"} />
                  <InfoItem label="Rules Checked" value={doc.audited ? "12" : "–"} />
                </div>
              </div>

              {!doc.audited ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.02)", border: "1px dashed var(--border)", borderRadius: "var(--radius-lg)", padding: "16px 20px" }}>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true); }} icon={<Trash2 size={14}/>}>
                      Delete
                    </Button>
                  </div>
                  <Button variant="accent" size="sm" onClick={(e) => { e.stopPropagation(); setShowAuditModal(true); }} icon={<Activity size={14}/>}>
                    Run Audit Now
                  </Button>
                </div>
              ) : (
                <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", color: "var(--warn)" }}>
                    <AlertTriangle size={15} />
                    <span style={{ fontWeight: "600", fontSize: "14px" }}>Key Findings</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <FindingItem text="Missing limitation of liability cap amount." severity="HIGH" />
                    <FindingItem text="Auto-renewal clause exceeds standard 30-day notice." severity="MEDIUM" />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", paddingTop: "16px", borderTop: "1px dashed var(--border)" }}>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true); }} icon={<Trash2 size={14}/>}>
                      Delete Document
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => navigate(`/report/${doc.document_id}`)}>View Full Report</Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
              display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              style={{
                width: "400px", background: "var(--bg-elevated)", border: "1px solid var(--border)",
                borderRadius: "var(--radius-xl)", padding: "24px", boxShadow: "var(--shadow-lg)",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px", color: "var(--text-primary)" }}>Delete Document</h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px", lineHeight: "1.5" }}>
                This will permanently remove <b>{doc.filename}</b>. All associated audits and embeddings will be destroyed.
              </p>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                <Button variant="danger" onClick={handleDelete}>Delete Permanently</Button>
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

function InfoItem({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
        {label}
      </div>
      <div style={{ fontSize: "16px", fontWeight: "600", color: "var(--text-primary)" }}>
        {value}
      </div>
    </div>
  );
}

function FindingItem({ text, severity }) {
  const color = severity === "HIGH" ? "var(--danger)" : "var(--warn)";
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13px", color: "var(--text-secondary)" }}>
      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: color, marginTop: "6px", flexShrink: 0 }} />
      <span>{text}</span>
    </div>
  );
}
