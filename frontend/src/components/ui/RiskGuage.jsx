import { useEffect, useState } from "react";

export default function RiskGauge({ score = 62 }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setProgress(score);
    }, 200);
  }, [score]);

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  let color = "#22c55e";
  let label = "Low Risk";

  if (score >= 70) {
    color = "#ef4444";
    label = "High Risk";
  } else if (score >= 40) {
    color = "#f59e0b";
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
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="9"
          fill="none"
        />

        <circle
          cx="65"
          cy="65"
          r={radius}
          stroke={color}
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
            color: color,
            lineHeight: "1",
          }}
        >
          {score}
        </div>

        <div
          style={{
            fontSize: "11px",
            color: "#64748b",
            marginTop: "2px",
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
