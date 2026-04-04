export default function StatsCard({
  icon,

  title,

  value,

  color,
}) {
  return (
    <div
      style={{
        background: "rgba(17,24,39,0.7)",

        border: "1px solid rgba(255,255,255,0.05)",

        borderRadius: "16px",

        padding: "22px",

        transition: "0.2s",

        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";

        e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";

        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          display: "flex",

          alignItems: "center",

          gap: "10px",

          marginBottom: "12px",
        }}
      >
        <div
          style={{
            background: `${color}22`,

            padding: "8px",

            borderRadius: "8px",

            color: color,
          }}
        >
          {icon}
        </div>

        <div
          style={{
            fontSize: "13px",

            color: "#64748b",
          }}
        >
          {title}
        </div>
      </div>

      <div
        style={{
          fontSize: "32px",

          fontWeight: "700",
        }}
      >
        {value}
      </div>
    </div>
  );
}
