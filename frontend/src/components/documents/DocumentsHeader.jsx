import { Upload, Search } from "lucide-react";

export default function DocumentsHeader() {
  return (
    <div
      style={{
        display: "flex",

        justifyContent: "space-between",

        alignItems: "center",

        marginBottom: "25px",
      }}
    >
      <div>
        <div
          style={{
            fontSize: "26px",

            fontWeight: "700",
          }}
        >
          Documents
        </div>

        <div
          style={{
            color: "#64748b",

            fontSize: "13px",
          }}
        >
          Manage and audit contracts
        </div>
      </div>

      <div
        style={{
          display: "flex",

          gap: "12px",

          alignItems: "center",
        }}
      >
        {/* SEARCH */}

        <div
          style={{
            display: "flex",

            alignItems: "center",

            background: "rgba(255,255,255,0.04)",

            padding: "8px 12px",

            borderRadius: "8px",

            gap: "8px",
          }}
        >
          <Search size={16} />

          <input
            placeholder="Search..."
            style={{
              background: "transparent",

              border: "none",

              outline: "none",

              color: "#e2e8f0",

              width: "160px",
            }}
          />
        </div>

        {/* UPLOAD BUTTON */}

        <button
          style={{
            display: "flex",

            alignItems: "center",

            gap: "8px",

            background: "linear-gradient(135deg,#00d4aa,#2563eb)",

            border: "none",

            padding: "10px 18px",

            borderRadius: "10px",

            cursor: "pointer",

            fontWeight: "600",

            color: "#020617",
          }}
        >
          <Upload size={16} />
          Upload
        </button>
      </div>
    </div>
  );
}
