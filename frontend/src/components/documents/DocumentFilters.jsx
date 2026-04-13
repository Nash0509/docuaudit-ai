import { useState } from "react";

const filters = [
  { key: "all", label: "All Documents" },
  { key: "audited", label: "Audited" },
  { key: "pending", label: "Pending" },
  { key: "high risk", label: "High Risk" },
];

export default function DocumentFilters({ currentFilter, onFilterChange }) {
  const [active, setActive] = useState(currentFilter || "all");

  const handleFilterClick = (key) => {
    setActive(key);
    onFilterChange?.(key);
  };

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "4px",
      marginBottom: "20px",
      padding: "4px",
      background: "var(--bg-surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-md)",
      width: "fit-content",
      boxShadow: "var(--shadow-sm)"
    }}>
      {filters.map((f) => {
        const isActive = active === f.key;
        return (
          <button
            key={f.key}
            onClick={() => handleFilterClick(f.key)}
            style={{
              padding: "7px 16px",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              background: isActive ? "var(--accent-light)" : "transparent",
              color: isActive ? "var(--accent)" : "var(--text-muted)",
              border: `1px solid ${isActive ? "var(--accent)" : "transparent"}`,
              fontSize: "13px",
              fontWeight: isActive ? "600" : "500",
              fontFamily: "inherit",
              transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
              whiteSpace: "nowrap",
              outline: "none"
            }}
            onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = "var(--text-primary)"; }}
            onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = "var(--text-muted)"; }}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
