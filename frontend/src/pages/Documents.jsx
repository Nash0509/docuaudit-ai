import { useEffect, useState, useRef } from "react";
import Layout from "../components/layout/Layout";
import useStore from "../utils/Store";
import DocumentTable from "../components/dashboard/DocumentTable";
import UploadModal from "../components/documents/UploadModal";
import { FileUp, FolderOpen } from "lucide-react";

export default function Documents() {
  const setTopBar = useStore((state) => state.setTopBar);
  const fileInputRef = useRef(null);
  const [activeFile, setActiveFile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => { setTopBar("documents"); }, []);

  const handleUploadClick = () => fileInputRef.current?.click();
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) { setActiveFile(file); setModalOpen(true); }
  };
  const handleUploadSuccess = () => {
    setModalOpen(false); setActiveFile(null);
    setRefreshKey((prev) => prev + 1);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleUploadClose = () => {
    setModalOpen(false); setActiveFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Layout>
      <div style={{ maxWidth: 1100, margin: "0 auto", paddingBottom: 40 }}>
        {/* Page Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <FolderOpen size={18} style={{ color: "var(--info)" }} />
              <h1 className="page-title">Document Library</h1>
            </div>
            <p className="page-sub">Manage and audit your regulatory contracts and legal documents.</p>
          </div>
          <div>
            <input
              type="file" ref={fileInputRef} onChange={handleFileChange}
              accept=".pdf" style={{ display: "none" }}
            />
            <button onClick={handleUploadClick} className="btn btn-primary" style={{ padding: "10px 16px" }}>
              <FileUp size={15} /> Upload Contract
            </button>
          </div>
        </div>

        <DocumentTable
          variant="documents"
          refresh={refreshKey}
          onUploadAction={handleUploadClick}
        />

        <UploadModal
          isOpen={modalOpen}
          file={activeFile}
          onClose={handleUploadClose}
          onSuccess={handleUploadSuccess}
        />
      </div>
    </Layout>
  );
}
