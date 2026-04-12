import { useEffect, useState } from "react";
import { getDocuments } from "../../services/api";
import DocumentRow from "./DocumentRow";
import { FileText, RefreshCw, FolderOpen } from "lucide-react";

function SkeletonRow() {
  return (
    <div className="grid gap-4 px-5 py-4 border-b border-slate-100" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
      <div className="flex items-center gap-3">
        <div className="skeleton w-4 h-4 rounded" />
        <div className="skeleton w-9 h-9 rounded-lg" />
        <div className="space-y-1.5">
          <div className="skeleton h-3.5 w-32 rounded" />
          <div className="skeleton h-2.5 w-20 rounded" />
        </div>
      </div>
      {[1, 2, 3].map((i) => <div key={i} className="skeleton h-6 w-20 rounded-full" />)}
    </div>
  );
}

function EmptyState({ onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4">
        <FolderOpen size={24} className="text-indigo-400" />
      </div>
      <h3 className="text-sm font-semibold text-slate-700 mb-1">No documents yet</h3>
      <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-5">
        Upload your first contract or legal document to start your AI compliance analysis.
      </p>
      <button
        onClick={onAction}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
        style={{ fontFamily: "inherit" }}
      >
        Upload First Document
      </button>
    </div>
  );
}

export default function DocumentTable({ variant, refresh, onUploadAction }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDocuments(); }, [refresh]);

  function refreshTable() { loadDocuments(); }

  async function loadDocuments() {
    setLoading(true);
    try {
      const data = await getDocuments();
      const docs = Object.entries(data).map(([id, value]) => ({ document_id: id, ...value }));
      setDocuments(docs);
    } catch (e) {
      console.log("Failed", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Table Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-2.5">
          <FileText size={15} className="text-indigo-500" />
          <span className="text-sm font-semibold text-slate-800">Documents</span>
          {documents.length > 0 && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
              {documents.length}
            </span>
          )}
        </div>
        <button
          onClick={refreshTable}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors"
          style={{ background: "none", border: "none", fontFamily: "inherit", cursor: "pointer" }}
        >
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {/* Column Headers */}
      <div
        className="grid px-5 py-2.5 bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-400 uppercase tracking-wider"
        style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}
      >
        <div>Document</div>
        <div>Status</div>
        <div>Risk</div>
        <div>Last Audit</div>
      </div>

      {/* Rows */}
      <div className="overflow-x-auto">
        <div style={{ minWidth: "640px" }}>
          {loading
            ? [...Array(4)].map((_, i) => <SkeletonRow key={i} />)
            : documents.length === 0
              ? <EmptyState onAction={onUploadAction || (() => {})} />
              : documents.map((doc) => (
                <DocumentRow
                  key={doc.document_id}
                  variant={variant}
                  doc={doc}
                  onAuditComplete={refreshTable}
                />
              ))
          }
        </div>
      </div>
    </div>
  );
}
