import { theme } from "../../styles/theme";

export default function Button({
  children,

  variant = "primary",
}) {
  const styles = {
    primary: {
      background: "linear-gradient(135deg,#00d4aa,#0ea5e9)",

      color: "#020617",
    },

    secondary: {
      background: "#2563eb",

      color: "white",
    },
  };

  return (
    <button
      style={{
        border: "none",

        padding: "12px 26px",

        borderRadius: theme.radius.md,

        cursor: "pointer",

        fontWeight: "600",

        ...styles[variant],
      }}
    >
      {children}
    </button>
  );
}
