import { Search, Bell } from "lucide-react";
import useStore from "../../utils/Store";

export default function Topbar() {
  const topBarKey = useStore((state) => state.topBar);

  // ⭐ same config structure
  const topBarData = {
    dashboard: {
      name: "Dashboard",
      discription: "AI contract intelligence overview",
    },

    documents: {
      name: "Documents",
      discription: "Manage and audit contracts",
    },

    reports: {
      name: "Audit Reports",
      discription: "View compliance analysis results",
    },

    settings: {
      name: "Settings",
      discription: "Application configuration",
    },
  };

  const data = topBarData[topBarKey] || {};

  return (
    <div
      style={{
        height: "70px",

        position: "sticky",

        top: 0,

        zIndex: 20,

        background: "#020617",

        borderBottom: "1px solid rgba(255,255,255,0.05)",

        display: "flex",

        alignItems: "center",

        justifyContent: "space-between",

        padding: '30px',

        paddingBottom: '60px',
      }}
    >
      {/* LEFT */}

      <div>
        <div
          style={{
            fontSize: "26px",
            fontWeight: "700",
          }}
        >
          {data.name || ""}
        </div>

        <div
          style={{
            fontSize: "13px",
            color: "#64748b",
          }}
        >
          {data.discription || ""}
        </div>
      </div>

      {/* RIGHT */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
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
          <Search size={16} color="#64748b" />

          <input
            placeholder="Search documents..."
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#e2e8f0",
              width: "160px",
            }}
          />
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            padding: "9px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
          }}
        >
          <Bell size={17} />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(255,255,255,0.04)",
            padding: "6px 12px",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "linear-gradient(135deg,#00d4aa,#2563eb)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "600",
              color: "#020617",
            }}
          >
            N
          </div>

          <div
            style={{
              fontSize: "14px",
            }}
          >
            Nishant
          </div>
        </div>
      </div>
    </div>
  );
}
