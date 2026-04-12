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
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FolderOpen size={18} className="text-indigo-500" />
            <h1 className="text-lg font-bold text-slate-900">Document Library</h1>
          </div>
          <p className="text-sm text-slate-500">Manage and audit your regulatory contracts and legal documents.</p>
        </div>
        <div>
          <input
            type="file" ref={fileInputRef} onChange={handleFileChange}
            accept=".pdf" style={{ display: "none" }}
          />
          <button
            onClick={handleUploadClick}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
            style={{ fontFamily: "inherit" }}
          >
            <FileUp size={15} />
            Upload Contract
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
    </Layout>
  );
}
