import { useEffect, useState, useRef } from "react";
import Layout from "../components/layout/Layout";
import useStore from "../utils/Store";
import DocumentFilters from "../components/documents/DocumentFilters";
import DocumentTable from "../components/dashboard/DocumentTable";
import UploadModal from "../components/documents/UploadModal";
import { FileUp } from "lucide-react";

export default function Documents() {
  const setTopBar = useStore(state => state.setTopBar);
  const fileInputRef = useRef(null);
  const [activeFile, setActiveFile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setTopBar("documents");
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setActiveFile(file);
      setModalOpen(true);
    }
  };

  const handleUploadSuccess = () => {
    setModalOpen(false);
    setActiveFile(null);
    setRefreshKey(prev => prev + 1);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUploadClose = () => {
    setModalOpen(false);
    setActiveFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Layout>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "24px"
      }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "var(--text-primary)", margin: "0 0 4px" }}>
            Document Library
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "var(--text-secondary)" }}>
            Manage and audit your regulatory contracts
          </p>
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".pdf" 
          style={{ display: "none" }} 
        />
        <button
          onClick={handleUploadClick}
          style={{
            background: "var(--accent)", color: "#020617", border: "none",
            padding: "10px 20px", borderRadius: "10px", fontSize: "14px", fontWeight: "700",
            cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
            transition: "all 0.2s ease", boxShadow: "0 4px 14px rgba(0, 212, 170, 0.2)"
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.96)"; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          <FileUp size={16} />
          Upload Contract
        </button>
      </div>

      <DocumentFilters />
      <DocumentTable 
        variant='documents' 
        refresh={refreshKey} 
        onUploadAction={handleUploadClick}
      />

      <UploadModal 
        isOpen={modalOpen} 
        file={activeFile} 
        onClose={handleUploadClose} 
        onSuccess={handleUploadSuccess} 
      />
    </Layout>
  );
}
