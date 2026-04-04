import { useEffect, useState } from "react";
import Card from "../ui/Card";
import { getDocuments } from "../../services/api";

import DocumentRow from "./DocumentRow";

import EmptyState from "../ui/EmptyState";

export default function DocumentTable({ variant, refresh }) {
  const [documents, setDocuments] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, [refresh]);

  function refreshTable() {
    loadDocuments();
  }

  async function loadDocuments() {
    try {
      const data = await getDocuments();

      const docs = Object.entries(data).map(([id, value]) => ({
        document_id: id,

        ...value,
      }));

      setDocuments(docs);
    } catch (e) {
      console.log("Failed", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <div
        style={{
          fontWeight: "600",

          marginBottom: "20px",
        }}
      >
        Documents
      </div>

      {/* TABLE HEADER */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",

          padding: "14px",

          color: "#64748b",

          fontSize: "12px",

          letterSpacing: "0.05em",

          textTransform: "uppercase",

          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{textAlign: 'center'}}>Document</div>

        <div style={{textAlign: 'center'}}>Status</div>

        <div style={{textAlign: 'center'}}>Risk</div>

        <div style={{textAlign: 'center'}}>Last Audit</div>

        <div style={{textAlign: 'center'}}>Action</div>

        <div style={{textAlign: 'center'}}></div>
      </div>

      {/* ROWS */}

      {documents.length === 0 ? (
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
    </Card>
  );
}
