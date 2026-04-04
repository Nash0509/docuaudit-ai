import { useState } from "react";

import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Trash2,
  RefreshCw,
} from "lucide-react";

import { uploadDocument } from "../../services/api";

export default function UploadZone({onUploadSuccess}) {
  const [drag, setDrag] = useState(false);

  const [file, setFile] = useState(null);

  const [uploading, setUploading] = useState(false);

  const [progress, setProgress] = useState(0);

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState(false);

  function handleDrop(e) {
    e.preventDefault();

    setDrag(false);

    const dropped = e.dataTransfer.files[0];

    if (dropped) {
      setFile(dropped);

      resetStates();
    }
  }

  function resetStates() {
    setUploading(false);

    setProgress(0);

    setSuccess(false);

    setError(false);
  }

  function removeFile() {
    setFile(null);

    resetStates();
  }

  async function startUpload() {
    if (!file) return;

    setUploading(true);

    setError(false);

    setSuccess(false);

    try {
      await uploadDocument(file);

      setSuccess(true);

      setFile(null);

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (e) {
      setError(true);

      console.log(e);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {/* DROP ZONE */}

      <div
        onDragOver={(e) => {
          e.preventDefault();

          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        style={{
          background: drag ? "rgba(0,212,170,0.08)" : "rgba(17,24,39,0.7)",

          border: drag
            ? "1px solid #00d4aa"
            : "1px dashed rgba(255,255,255,0.1)",

          borderRadius: "16px",

          padding: "40px",

          textAlign: "center",

          transition: "0.2s",
        }}
      >
        <Upload size={36} color={drag ? "#00d4aa" : "#64748b"} />

        <div
          style={{
            marginTop: "12px",

            fontSize: "18px",

            fontWeight: "600",
          }}
        >
          Upload Contract
        </div>

        <div
          style={{
            fontSize: "13px",

            color: "#64748b",

            marginTop: "6px",
          }}
        >
          Drag & drop PDF or click below
        </div>

        <input
          type="file"
          accept=".pdf"
          style={{ display: "none" }}
          id="fileUpload"
          onChange={(e) => {
            setFile(e.target.files[0]);

            resetStates();
          }}
        />

        <label
          htmlFor="fileUpload"
          style={{
            display: "inline-block",

            marginTop: "18px",

            background: "linear-gradient(135deg,#00d4aa,#0ea5e9)",

            padding: "10px 26px",

            borderRadius: "10px",

            cursor: "pointer",

            fontWeight: "600",

            color: "#020617",
          }}
        >
          Choose File
        </label>
      </div>

      {/* FILE PREVIEW */}

      {file && (
        <div
          style={{
            background: "rgba(255,255,255,0.03)",

            borderRadius: "10px",

            padding: "16px",

            marginTop: "16px",

            display: "flex",

            alignItems: "center",

            gap: "12px",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.04)",

              padding: "10px",

              borderRadius: "8px",
            }}
          >
            <FileText size={18} />
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "14px",

                fontWeight: "500",
              }}
            >
              {file.name}
            </div>

            <div
              style={{
                fontSize: "12px",

                color: "#64748b",
              }}
            >
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>

          {/* ACTIONS */}

          <div
            style={{
              display: "flex",

              gap: "8px",
            }}
          >
            <label
              htmlFor="fileUpload"
              style={{
                background: "rgba(255,255,255,0.05)",

                padding: "7px 12px",

                borderRadius: "7px",

                cursor: "pointer",
              }}
            >
              <RefreshCw size={15} />
            </label>

            <button
              onClick={removeFile}
              style={{
                background: "rgba(239,68,68,0.15)",

                border: "none",

                padding: "7px 12px",

                borderRadius: "7px",

                cursor: "pointer",

                color: "#f87171",
              }}
            >
              <Trash2 size={15} />
            </button>

            <button
              onClick={startUpload}
              disabled={uploading}
              style={{
                background: uploading ? "#1e40af" : "#2563eb",

                border: "none",

                padding: "7px 18px",

                borderRadius: "7px",

                cursor: "pointer",

                color: "white",
              }}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      )}

      {/* PROGRESS */}

      {uploading && (
        <div
          style={{
            marginTop: "12px",

            background: "rgba(255,255,255,0.05)",

            height: "8px",

            borderRadius: "6px",

            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",

              width: `${progress}%`,

              background: "linear-gradient(90deg,#00d4aa,#2563eb)",

              transition: "0.2s",
            }}
          />
        </div>
      )}

      {/* SUCCESS */}

      {success && (
        <div
          style={{
            marginTop: "12px",

            display: "flex",

            alignItems: "center",

            gap: "8px",

            color: "#22c55e",
          }}
        >
          <CheckCircle size={16} />
          Upload complete
        </div>
      )}

      {/* ERROR */}

      {error && (
        <div
          style={{
            marginTop: "12px",

            display: "flex",

            alignItems: "center",

            gap: "8px",

            color: "#ef4444",
          }}
        >
          <XCircle size={16} />
          Upload failed
        </div>
      )}
    </div>
  );
}
