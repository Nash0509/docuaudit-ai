export default function ActivityItem({
  icon,

  text,

  time,

  color,
}) {
  return (
    <div
      style={{
        display: "flex",

        alignItems: "center",

        gap: "12px",

        padding: "12px",

        borderBottom: "1px solid rgba(255,255,255,0.04)",

        transition: "0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.02)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      <div
        style={{
          background: `${color}22`,

          color: color,

          padding: "7px",

          borderRadius: "8px",
        }}
      >
        {icon}
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: "14px",
          }}
        >
          {text}
        </div>

        <div
          style={{
            fontSize: "12px",

            color: "#64748b",

            marginTop: "2px",
          }}
        >
          {time}
        </div>
      </div>
    </div>
  );
}
