export default function Badge({ text, type }) {
  const styles = {
    success: {
      background: "#22c55e1f",
      color: "#4ade80",
      border: "1px solid #22c55e40",
    },

    warning: {
      background: "#f59e0b1f",
      color: "#fbbf24",
      border: "1px solid #f59e0b40",
    },

    danger: {
      background: "#ef44441f",
      color: "#f87171",
      border: "1px solid #ef444440",
    },

    neutral: {
      background: "#94a3b81f",
      color: "#cbd5f5",
      border: "1px solid #94a3b840",
    },
  };

  return (
    <div
      style={{
        display: "inline-flex",

        alignItems: "center",

        padding: "5px 11px",

        borderRadius: "7px",

        fontSize: "12px",

        fontWeight: "500",

        ...styles[type],
      }}
    >
      {text}
    </div>
  );
}
