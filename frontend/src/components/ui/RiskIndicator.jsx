export default function RiskIndicator({ level }) {
  const config = {
    low: {
      color: "#22c55e",
      width: "30%",
    },

    medium: {
      color: "#f59e0b",
      width: "65%",
    },

    high: {
      color: "#ef4444",
      width: "90%",
    },
  };

  const risk = config[level] || config.medium;

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
        {level.toUpperCase()}
      </div>

      {/* BAR */}

      <div
        style={{
          width: "70px",

          height: "6px",

          background: "rgba(255,255,255,0.06)",

          borderRadius: "6px",

          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: risk.width,

            height: "100%",

            background: risk.color,

            borderRadius: "6px",

            transition: "0.4s",
          }}
        />
      </div>
    </div>
  );
}
