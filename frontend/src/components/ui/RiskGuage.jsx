import { useEffect, useState } from "react";

export default function RiskGauge({ score = 62 }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(score);
    }, 200);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  let colorToken = "var(--success)";
  let label = "Low Risk";

  if (score >= 70) {
    colorToken = "var(--danger)";
    label = "High Risk";
  } else if (score >= 40) {
    colorToken = "var(--warn)";
    label = "Moderate Risk";
  }

  return (
    <div
      style={{
        position: "relative",
        width: "130px",
        height: "130px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg width="130" height="130">
        <circle
          cx="65"
          cy="65"
          r={radius}
          stroke="var(--bg-surface-hover)"
          strokeWidth="9"
          fill="none"
        />

        <circle
          cx="65"
          cy="65"
          r={radius}
          stroke={colorToken}
          strokeWidth="9"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "0.8s ease",
          }}
          transform="rotate(-90 65 65)"
        />
      </svg>

      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: "22px",
            fontWeight: "700",
            color: colorToken,
            lineHeight: "1",
          }}
        >
          {score}
        </div>

        <div
          style={{
            fontSize: "11px",
            color: "var(--text-muted)",
            marginTop: "2px",
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
