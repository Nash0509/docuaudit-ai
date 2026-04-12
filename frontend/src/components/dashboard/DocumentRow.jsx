import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteDocument } from "../../services/api";
import { FileText, ChevronDown, AlertTriangle, Trash2, Eye, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuditConfigModal from "../audit/AuditConfigModal";
import useMediaQuery from "../../utils/useMediaQuery";

function StatusBadge({ status }) {
  const cfg = {
    ready: "bg-emerald-50 text-emerald-700 border-emerald-200",
    processing: "bg-amber-50 text-amber-700 border-amber-200",
    uploading: "bg-blue-50 text-blue-700 border-blue-200",
    error: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg[status] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${status === "ready" ? "bg-emerald-500" : status === "processing" ? "bg-amber-400" : status === "error" ? "bg-red-500" : "bg-blue-500"}`} />
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
}

function RiskBadge({ score }) {
  if (!score && score !== 0) return <span className="text-xs text-slate-400">—</span>;
  const cls = score >= 70 ? "bg-red-50 text-red-700 border-red-200"
    : score >= 40 ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-emerald-50 text-emerald-700 border-emerald-200";
  const label = score >= 70 ? "High" : score >= 40 ? "Medium" : "Low";
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}>{label} · {score}</span>;
}

function InfoItem({ label, value }) {
  return (
    <div>
      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">{label}</div>
      <div className="text-base font-semibold text-slate-800">{value}</div>
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
        className={`grid items-center gap-4 px-5 py-3.5 border-b border-slate-100 cursor-pointer transition-colors hover:bg-slate-50 ${open ? "bg-indigo-50/50" : "bg-white"}`}
        style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}
      >
        {/* Left indicator */}
        <div className={`absolute left-0 w-0.5 h-8 rounded-r-full transition-all ${open ? "bg-indigo-500 opacity-100" : "opacity-0"}`} />

        {/* Document Info */}
        <div className="flex items-center gap-3">
          <ChevronDown
            size={15}
            className="text-slate-400 flex-shrink-0 transition-transform"
            style={{ transform: open ? "rotate(0deg)" : "rotate(-90deg)" }}
          />
          <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
            <FileText size={15} className="text-indigo-500" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-800 leading-tight">{doc.filename}</div>
            <div className="text-xs text-slate-400 mt-0.5">{uploadDate}</div>
          </div>
        </div>

        <StatusBadge status={doc.status} />
        <RiskBadge score={riskScore} />
        <div className="text-xs text-slate-400">{doc.audited ? "Recently" : "Never audited"}</div>
      </div>

      {/* Expanded Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-b border-slate-200"
          >
            <div className={`bg-slate-50 ${isMobile ? "p-4" : "p-6"} space-y-5`}>
              <div className="flex items-center gap-8 flex-wrap">
                <InfoItem label="Sections / Chunks" value={doc.chunks || "—"} />
                <InfoItem label="Status" value={doc.audited ? "Audited" : "Pending"} />
                <InfoItem label="Risk Score" value={riskScore != null ? riskScore : "—"} />
                <InfoItem label="Rules Checked" value={doc.audited ? "Active" : "—"} />
              </div>

              {!doc.audited ? (
                <div className="flex items-center justify-between bg-white border border-dashed border-slate-300 rounded-xl p-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-700">Ready for Audit</div>
                    <div className="text-xs text-slate-400 mt-0.5">Run AI compliance check on this document</div>
                  </div>
                  <div className="flex gap-2.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true); }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
                      style={{ fontFamily: "inherit" }}
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowAuditModal(true); }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                      style={{ fontFamily: "inherit" }}
                    >
                      <Activity size={13} /> Run Audit
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3 text-amber-600">
                    <AlertTriangle size={14} />
                    <span className="font-semibold text-sm">Key Findings</span>
                  </div>
                  <div className="space-y-2.5 mb-4">
                    <div className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      Missing limitation of liability cap amount.
                    </div>
                    <div className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                      Auto-renewal clause exceeds standard 30-day notice period.
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true); }}
                      className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                      style={{ fontFamily: "inherit", background: "none", border: "none", cursor: "pointer" }}
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                    <button
                      onClick={() => navigate(`/report/${doc.document_id}`)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                      style={{ fontFamily: "inherit" }}
                    >
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
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-[1000]"
          >
            <motion.div
              initial={{ scale: 0.95, y: 8 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 8 }}
              className="w-96 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                  <Trash2 size={17} className="text-red-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Delete Document</h3>
              </div>
              <p className="text-sm text-slate-500 mb-5 leading-relaxed">
                This will permanently remove <strong className="text-slate-700">{doc.filename}</strong> along with all associated audits and AI embeddings. This action cannot be undone.
              </p>
              <div className="flex gap-2.5">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  style={{ fontFamily: "inherit" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-sm font-semibold text-white transition-colors"
                  style={{ fontFamily: "inherit" }}
                >
                  Delete Permanently
                </button>
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
