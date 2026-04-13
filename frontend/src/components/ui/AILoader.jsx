import { useEffect, useState } from "react";

export default function AILoader() {
  const steps = [
    "Analyzing contract structure",
    "Checking payment clauses",
    "Reviewing liability terms",
    "Evaluating compliance rules",
    "Calculating risk score",
    "Generating audit report",
  ];

  const [index, setIndex] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setIndex((prev) => (prev + 1) % steps.length);
    }, 2200);

    const dotTimer = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);

    return () => {
      clearInterval(stepTimer);
      clearInterval(dotTimer);
    };
  }, []);

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "40px",
        textAlign: "center",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      {/* AI ICON */}
      <div
        style={{
          fontSize: "40px",
          marginBottom: "16px",
        }}
      >
        🤖
      </div>

      {/* TITLE */}
      <div
        style={{
          fontSize: "18px",
          fontWeight: "600",
          color: "var(--text-primary)",
          marginBottom: "10px",
        }}
      >
        AI Analysis Running
      </div>

      {/* STEP */}
      <div
        style={{
          fontSize: "14px",
          color: "var(--text-muted)",
          height: "20px",
          transition: "0.3s",
        }}
      >
        {steps[index]}
        {dots}
      </div>

      {/* PROGRESS BAR */}
      <div
        style={{
          marginTop: "22px",
          height: "6px",
          background: "var(--bg-surface-hover)",
          borderRadius: "6px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: "70%",
            background: "var(--accent)",
            animation: "progress 2s infinite linear",
          }}
        />
      </div>
    </div>
  );
}
