import Card from "../ui/Card";

export default function MetricCard({
  title,
  value,
  icon,
}) {
  return (
    <Card>
      <div
        style={{
          color: "var(--text-muted)",
          fontSize: "13px",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}
      >
        {icon}
        {title}
      </div>

      <div
        style={{
          fontSize: "32px",
          fontWeight: "700",
          color: "var(--text-primary)",
          marginTop: "6px",
        }}
      >
        {value}
      </div>
    </Card>
  );
}
