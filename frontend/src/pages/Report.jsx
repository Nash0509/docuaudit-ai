import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import RiskGauge from "../components/ui/RiskGuage";
import { getAuditResult } from "../services/api";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Report() {
  const { id } = useParams();

  const [report, setReport] = useState(null);

  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("ALL");

  const reportRef = useRef(null);

  useEffect(() => {
    loadReport();
  }, [id]);

  async function loadReport() {
    try {
      const data = await getAuditResult(id);
      console.log('This is the result of the report...', data);

      setReport(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  async function exportPDF() {
    if (!reportRef.current) return;

    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const width = pdf.internal.pageSize.getWidth();

    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);

    pdf.save(`audit-${id}.pdf`);
  }

  if (loading) {
    return (
      <Layout>
        <div style={{ padding: "40px" }}>Loading report...</div>
      </Layout>
    );
  }

  if (!report) {
    return <Layout>No audit results found</Layout>;
  }

  const filteredResults = report.results.filter((r) => {
    if (filter === "ALL") return true;

    if (filter === "FAIL") return r.status === "FAIL";

    if (filter === "WARN") return r.status === "WARN";

    if (filter === "PASS") return r.status === "PASS";

    return true;
  });

  return (
    <Layout>
      <div ref={reportRef}>
        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "30px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "500",
              }}
            >
              {report?.filename}
            </div>

            <div
              style={{
                color: "#64748b",
              }}
            >
              Document ID: {report.document}
            </div>
          </div>

          <button
            onClick={exportPDF}
            style={{
              background: "linear-gradient(135deg,#00d4aa,#2563eb)",

              border: "none",

              padding: "10px 18px",

              borderRadius: "10px",

              cursor: "pointer",

              fontWeight: "600",

              color: "#020617",
            }}
          >
            Export PDF
          </button>
        </div>

        {/* SUMMARY */}

        <div
          style={{
            display: "flex",
            gap: "40px",
            marginBottom: "30px",
          }}
        >
          <RiskGauge score={report.risk_score} />

          <div
            style={{
              display: "flex",
              gap: "40px",
            }}
          >
            <Stat label="Rules Checked" value={report.rules_checked} />

            <Stat
              label="Failures"
              value={report.results.filter((r) => r.status === "FAIL").length}
            />

            <Stat
              label="Warnings"
              value={report.results.filter((r) => r.status === "WARN").length}
            />
          </div>
        </div>

        {/* FILTER TABS */}

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "15px",
          }}
        >
          <FilterTab
            text="All"
            active={filter === "ALL"}
            onClick={() => setFilter("ALL")}
          />

          <FilterTab
            text="Failures"
            active={filter === "FAIL"}
            onClick={() => setFilter("FAIL")}
          />

          <FilterTab
            text="Warnings"
            active={filter === "WARN"}
            onClick={() => setFilter("WARN")}
          />

          <FilterTab
            text="Passed"
            active={filter === "PASS"}
            onClick={() => setFilter("PASS")}
          />
        </div>

        {/* RULE CARDS */}

        <div
          style={{
            background: "rgba(17,24,39,0.7)",

            borderRadius: "16px",

            padding: "20px",

            marginBottom: "20px",
          }}
        >
          {filteredResults.map((r) => (
            <RuleRow key={r.rule_id} rule={r} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div
        style={{
          fontSize: "12px",
          color: "#64748b",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: "22px",
          fontWeight: "600",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function FilterTab({ text, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "6px 14px",

        borderRadius: "8px",

        cursor: "pointer",

        fontSize: "13px",

        background: active ? "rgba(0,212,170,0.12)" : "rgba(255,255,255,0.04)",

        color: active ? "#00d4aa" : "#94a3b8",

        border: active
          ? "1px solid rgba(0,212,170,0.4)"
          : "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {text}
    </div>
  );
}

function StatusBadge({ text, color }) {
  return (
    <div
      style={{
        padding: "4px 10px",

        borderRadius: "6px",

        fontSize: "12px",

        fontWeight: "600",

        background: `${color}22`,

        color: color,

        border: `1px solid ${color}55`,
      }}
    >
      {text}
    </div>
  );
}

function RuleRow({ rule }) {
  const [open, setOpen] = useState(false);

  const statusColor =
    rule.status === "FAIL"
      ? "#ef4444"
      : rule.status === "WARN"
        ? "#f59e0b"
        : "#22c55e";

  const severityColor =
    rule.severity === "CRITICAL"
      ? "#ef4444"
      : rule.severity === "HIGH"
        ? "#f97316"
        : rule.severity === "MEDIUM"
          ? "#f59e0b"
          : "#22c55e";

  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        background: "rgba(255,255,255,0.02)",

        border: "1px solid rgba(255,255,255,0.05)",

        borderRadius: "12px",

        padding: "18px",

        marginBottom: "14px",

        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <ChevronDown
            size={16}
            style={{
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />

          {rule.rule_name}
        </div>

        <div
          style={{
            display: "flex",
            gap: "8px",
          }}
        >
          <StatusBadge text={rule.status} color={statusColor} />

          <StatusBadge text={rule.severity} color={severityColor} />
        </div>
      </div>

      <div
        style={{
          marginBottom: "10px",
          color: "#cbd5f5",
        }}
      >
        {rule.finding}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.03)",

                borderRadius: "10px",

                padding: "14px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                }}
              >
                Confidence
              </div>

              <div
                style={{
                  fontWeight: "600",
                  marginBottom: "10px",
                }}
              >
                {rule.confidence || 80}%
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                }}
              >
                Recommendation
              </div>

              <div>{rule.recommendation}</div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  marginTop: "10px",
                }}
              >
                Citation
              </div>

              <div>{rule.citation}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
