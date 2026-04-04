import { FileText } from "lucide-react";

export default function EmptyState({
  title,

  description,

  actionText,

  onAction,
}) {
  return (
    <div
      style={{
        background: "#11182799",

        border: "1px solid #ffffff0d",

        borderRadius: "16px",

        padding: "50px",

        textAlign: "center",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.04)",

          width: "60px",

          height: "60px",

          borderRadius: "14px",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          margin: "auto",

          marginBottom: "18px",
        }}
      >
        <FileText size={26} />
      </div>

      <div
        style={{
          fontSize: "18px",

          fontWeight: "600",

          marginBottom: "6px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "14px",

          color: "#64748b",

          marginBottom: "20px",
        }}
      >
        {description}
      </div>

      <button
        onClick={onAction}
        style={{
          background: "linear-gradient(135deg,#00d4aa,#0ea5e9)",

          border: "none",

          padding: "11px 26px",

          borderRadius: "10px",

          cursor: "pointer",

          fontWeight: "600",

          color: "#020617",
        }}
      >
        {actionText}
      </button>
    </div>
  );
}
