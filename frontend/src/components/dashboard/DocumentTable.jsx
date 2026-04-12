import { useEffect, useState, useRef } from "react";
import { getDocuments, uploadDocument } from "../../services/api";
import DocumentRow from "./DocumentRow";
import EmptyState from "../ui/EmptyState";
import { FileText, RefreshCw, Upload, Loader2 } from "lucide-react";

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
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      await uploadDocument(file);
      refreshTable();
    } catch (err) {
      console.error(err);
      alert("Failed to upload document. Make sure it's a valid PDF.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div style={{
      background: "var(--bg-surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden", // Ensure children don't overflow the rounded corners
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
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={refreshTable}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "12px" }}
          >
            <RefreshCw size={13} /> Refresh
          </button>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".pdf" 
            style={{ display: "none" }} 
          />
          <button
            onClick={handleUploadClick}
            disabled={uploading}
            style={{
              background: "var(--accent)",
              color: "#020617",
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "700",
              cursor: uploading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "transform 0.1s ease, opacity 0.2s",
              opacity: uploading ? 0.7 : 1,
              boxShadow: "0 4px 12px rgba(0, 212, 170, 0.2)"
            }}
            onMouseDown={(e) => { if(!uploading) e.currentTarget.style.transform = "scale(0.96)"; }}
            onMouseUp={(e) => { if(!uploading) e.currentTarget.style.transform = "scale(1)"; }}
            onMouseLeave={(e) => { if(!uploading) e.currentTarget.style.transform = "scale(1)"; }}
          >
            {uploading ? (
              <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              <Upload size={14} />
            )}
            {uploading ? "Uploading..." : "Upload PDF"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Scrollable Container */}
      <div style={{ overflowX: "auto", minWidth: "100%" }}>
        <div style={{ minWidth: "700px" }}> {/* Ensure a minimum width for the table content */}
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
              onAction={handleUploadClick}
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
      </div>
    </div>
  );
}
