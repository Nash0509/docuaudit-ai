import { useState } from "react";

const filters = [
  { key: "all", label: "All Documents" },
  { key: "audited", label: "Audited" },
  { key: "pending", label: "Pending" },
  { key: "high risk", label: "High Risk" },
];

export default function DocumentFilters() {
  const [active, setActive] = useState("all");

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "6px",
      marginBottom: "20px",
      padding: "4px",
      background: "var(--bg-surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-md)",
      width: "fit-content",
    }}>
      {filters.map((f) => (
        <button
          key={f.key}
          onClick={() => setActive(f.key)}
          style={{
            padding: "6px 14px",
            borderRadius: "7px",
            cursor: "pointer",
            background: active === f.key ? "rgba(0,212,170,0.12)" : "transparent",
            color: active === f.key ? "var(--accent)" : "var(--text-muted)",
            border: `1px solid ${active === f.key ? "var(--border-accent)" : "transparent"}`,
            fontSize: "13px",
            fontWeight: active === f.key ? "600" : "400",
            fontFamily: "inherit",
            transition: "all 0.15s ease",
            whiteSpace: "nowrap",
          }}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
