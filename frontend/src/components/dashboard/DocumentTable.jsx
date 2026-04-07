import { useEffect, useState } from "react";
import { getDocuments } from "../../services/api";
import DocumentRow from "./DocumentRow";
import EmptyState from "../ui/EmptyState";
import { FileText, RefreshCw } from "lucide-react";

function SkeletonRow() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr 1fr",
      padding: "16px",
      gap: "16px",
      borderBottom: "1px solid var(--border)",
      alignItems: "center",
    }}>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="skeleton" style={{ height: "14px", borderRadius: "6px", opacity: i === 0 ? 1 : 0.6 }} />
      ))}
    </div>
  );
}

export default function DocumentTable({ variant, refresh }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDocuments(); }, [refresh]);

  function refreshTable() { loadDocuments(); }

  async function loadDocuments() {
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
    <div style={{
      background: "var(--bg-surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
    }}>
      {/* Table Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FileText size={16} color="var(--accent)" />
          <span style={{ fontWeight: "600", fontSize: "14px", color: "var(--text-primary)" }}>
            Documents
          </span>
          {documents.length > 0 && (
            <span style={{ 
              background: "var(--accent-dim)", 
              color: "var(--accent)", 
              fontSize: "11px", 
              fontWeight: "600", 
              padding: "1px 7px", 
              borderRadius: "20px",
              border: "1px solid var(--border-accent)" 
            }}>
              {documents.length}
            </span>
          )}
        </div>
        <button
          onClick={refreshTable}
          style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "12px" }}
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Column Headers */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1fr",
        padding: "10px 20px",
        color: "var(--text-muted)",
        fontSize: "11px",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        fontWeight: "600",
        borderBottom: "1px solid var(--border)",
        background: "rgba(255,255,255,0.015)",
      }}>
        <div>Document</div>
        <div>Status</div>
        <div>Risk</div>
        <div>Last Audit</div>
      </div>

      {/* Rows */}
      {loading ? (
        [...Array(4)].map((_, i) => <SkeletonRow key={i} />)
      ) : documents.length === 0 ? (
        <EmptyState
          title="No documents yet"
          description="Upload your first contract to start AI compliance analysis"
          actionText="Upload Contract"
          onAction={() => {}}
        />
      ) : (
        documents.map((doc) => (
          <DocumentRow
            key={doc.document_id}
            variant={variant}
            doc={doc}
            onAuditComplete={refreshTable}
          />
        ))
      )}
    </div>
  );
}
