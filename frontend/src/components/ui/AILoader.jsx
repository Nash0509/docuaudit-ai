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
        background: "rgba(17,24,39,0.8)",

        border: "1px solid rgba(255,255,255,0.05)",

        borderRadius: "16px",

        padding: "40px",

        textAlign: "center",
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

          marginBottom: "10px",
        }}
      >
        AI Analysis Running
      </div>

      {/* STEP */}

      <div
        style={{
          fontSize: "14px",

          color: "#94a3b8",

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

          background: "rgba(255,255,255,0.05)",

          borderRadius: "6px",

          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",

            width: "70%",

            background: "linear-gradient(90deg,#00d4aa,#2563eb)",

            animation: "progress 2s infinite linear",
          }}
        />
      </div>
    </div>
  );
}
