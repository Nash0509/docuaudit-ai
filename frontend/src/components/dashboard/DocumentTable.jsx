import { useEffect, useState } from "react";
import { getDocuments } from "../../services/api";
import DocumentRow from "./DocumentRow";
import { FileText, RefreshCw, FolderOpen } from "lucide-react";

function SkeletonRow() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 16, padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className="skeleton" style={{ width: 16, height: 16, borderRadius: 4 }} />
        <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 8 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div className="skeleton" style={{ height: 14, width: 128, borderRadius: 4 }} />
          <div className="skeleton" style={{ height: 10, width: 80, borderRadius: 4 }} />
        </div>
      </div>
      {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 24, width: 80, borderRadius: 12 }} />)}
    </div>
  );
}

function EmptyState({ onAction }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 24px", textAlign: "center" }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--info-light)", border: "1px solid var(--info-border)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        <FolderOpen size={24} color="var(--info)" />
      </div>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>No documents yet</h3>
      <p style={{ fontSize: 12, color: "var(--text-muted)", maxWidth: 320, lineHeight: 1.5, marginBottom: 20 }}>
        Upload your first contract or legal document to start your AI compliance analysis.
      </p>
      <button onClick={onAction} className="btn btn-primary" style={{ padding: "10px 16px" }}>Upload First Document</button>
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
    <div className="card" style={{ padding: 0 }}>
      {/* Table Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)", background: "var(--bg-surface)", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <FileText size={15} color="var(--info)" />
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Documents</span>
          {documents.length > 0 && (
            <span className="badge badge-indigo">
              {documents.length}
            </span>
          )}
        </div>
        <button onClick={refreshTable} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {/* Column Headers */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "10px 20px", background: "var(--bg-surface-hover)", borderBottom: "1px solid var(--border)", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        <div>Document</div>
        <div>Status</div>
        <div>Risk</div>
        <div>Last Audit</div>
      </div>

      {/* Rows */}
      <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 640 }}>
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
