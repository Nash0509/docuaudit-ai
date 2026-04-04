import { useState } from "react";

export default function DocumentFilters() {
  const [active, setActive] = useState("all");

  const filters = ["all", "audited", "pending", "high risk"];

  return (
    <div
      style={{
        display: "flex",

        gap: "10px",

        marginBottom: "20px",
      }}
    >
      {filters.map((f) => (
        <div
          key={f}
          onClick={() => setActive(f)}
          style={{
            padding: "7px 14px",

            borderRadius: "8px",

            cursor: "pointer",

            background:
              active === f ? "rgba(0,212,170,0.1)" : "rgba(255,255,255,0.03)",

            color: active === f ? "#00d4aa" : "#94a3b8",

            fontSize: "13px",

            textTransform: "capitalize",
          }}
        >
          {f}
        </div>
      ))}
    </div>
  );
}
