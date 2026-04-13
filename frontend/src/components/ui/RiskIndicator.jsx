export default function RiskIndicator({ level }) {
  const config = {
    low: {
      color: "var(--success)",
      width: "30%",
    },
    medium: {
      color: "var(--warn)",
      width: "65%",
    },
    high: {
      color: "var(--danger)",
      width: "90%",
    },
  };

  const risk = config[level?.toLowerCase()] || config.medium;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      {/* DOT */}
      <div
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: risk.color,
        }}
      />

      {/* TEXT */}
      <div
        style={{
          fontSize: "13px",
          color: risk.color,
          fontWeight: "500",
        }}
      >
        {level?.toUpperCase()}
      </div>

      {/* BAR */}
      <div
        style={{
          width: "70px",
          height: "6px",
          background: "var(--bg-surface-hover)",
          borderRadius: "3px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: risk.width,
            height: "100%",
            background: risk.color,
            borderRadius: "3px",
            transition: "all 0.4s ease-in-out",
          }}
        />
      </div>
    </div>
  );
}
