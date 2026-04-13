import { Upload, Search } from "lucide-react";
import Button from "../ui/Button";

export default function DocumentsHeader({ onUploadClick, onSearchChange }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px",
        flexWrap: "wrap",
        gap: "16px"
      }}
    >
      <div>
        <div
          style={{
            fontSize: "26px",
            fontWeight: "700",
            color: "var(--text-primary)",
            letterSpacing: "-0.02em"
          }}
        >
          Documents
        </div>

        <div
          style={{
            color: "var(--text-muted)",
            fontSize: "13px",
            marginTop: "2px"
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
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            padding: "0 12px",
            height: "40px",
            borderRadius: "var(--radius-md)",
            gap: "8px",
            transition: "all 0.2s ease"
          }}
          onFocusIn={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-light)"; }}
          onFocusOut={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
        >
          <Search size={16} color="var(--text-muted)" />
          <input
            placeholder="Search documents..."
            onChange={(e) => onSearchChange?.(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontSize: "14px",
              width: "180px",
              fontFamily: "inherit"
            }}
          />
        </div>

        {/* UPLOAD BUTTON */}
        <Button 
          variant="primary" 
          onClick={onUploadClick}
          icon={<Upload size={16} />}
        >
          Upload
        </Button>
      </div>
    </div>
  );
}
