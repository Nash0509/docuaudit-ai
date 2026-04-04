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
          color: "#64748b",

          fontSize: "13px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "32px",

          fontWeight: "700",

          marginTop: "6px",
        }}
      >
        {value}
      </div>
    </Card>
  );
}
