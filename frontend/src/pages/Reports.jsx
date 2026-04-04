import Layout from "../components/layout/Layout";
import { useState, useEffect } from "react";
import { getAllAuditResult } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Reports() {
  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const result = await getAllAuditResult();
        console.log('This is the data...', result);
        setReports(Array.isArray(result) ? result : result.results || []);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <Layout>
      <div
        style={{
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "25px",
          }}
        >
          <div>
            {/* <div
              style={{
                fontSize: "22px",
                fontWeight: "500",
              }}
            >
              Audit Reports
            </div>

            <div
              style={{
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              AI compliance analysis results
            </div> */}
          </div>

          <div
            style={{
              display: "flex",
              gap: "30px",
            }}
          >
            <Stat label="Total" value={reports.length} />

            <Stat
              label="High Risk"
              value={reports.filter((r) => r.risk_score >= 70).length}
            />

            <Stat
              label="Low Risk"
              value={reports.filter((r) => r.risk_score < 40).length}
            />
          </div>
        </div>

        {/* TABLE */}

        <div
          style={{
            background: "rgba(17,24,39,0.7)",

            borderRadius: "14px",

            border: "1px solid rgba(255,255,255,0.05)",

            overflow: "hidden",
          }}
        >
          {/* HEADER */}

          <div
            style={{
              display: "grid",

              gridTemplateColumns: "2.5fr 1fr 1fr 1fr 1fr",

              padding: "15px 22px",

              fontSize: "12px",

              color: "#64748b",

              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div>Document</div>

            <div>Risk</div>

            <div>Rules</div>

            <div>Date</div>

            <div></div>
          </div>

          {/* BODY */}

          {loading ? (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                color: "#64748b",
              }}
            >
              Loading reports...
            </div>
          ) : reports.length === 0 ? (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                color: "#64748b",
              }}
            >
              No reports yet
            </div>
          ) : (
            reports.map((report) => (
              <ReportRow
                key={report.document}
                report={report}
                navigate={navigate}
              />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}

function ReportRow({ report, navigate }) {
  const riskColor =
    report.risk_score >= 70
      ? "#ef4444"
      : report.risk_score >= 40
        ? "#f59e0b"
        : "#22c55e";

  return (
    <div
      style={{
        display: "grid",

        gridTemplateColumns: "2.5fr 1fr 1fr 1fr 1fr",

        padding: "18px 22px",

        borderBottom: "1px solid rgba(255,255,255,0.04)",

        alignItems: "center",

        cursor: "pointer",

        transition: "0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      {/* DOCUMENT */}

      <div>
        <div
          style={{
            fontWeight: "600",
            marginBottom: "3px",
          }}
        >
          {report.filename || "Contract"}
        </div>

        <div
          style={{
            fontSize: "11px",
            color: "#64748b",
          }}
        >
          {report.document}
        </div>
      </div>

      {/* RISK */}

      <div>
        <div
          style={{
            display: "inline-block",

            padding: "4px 10px",

            borderRadius: "8px",

            fontSize: "12px",

            fontWeight: "600",

            background: `${riskColor}22`,

            color: riskColor,

            border: `1px solid ${riskColor}55`,
          }}
        >
          {report.risk_score}
        </div>
      </div>

      {/* RULES */}

      <div
        style={{
          color: "#cbd5f5",
        }}
      >
        {report.rules_checked}
      </div>

      {/* DATE */}

      <div
        style={{
          color: "#94a3b8",
          fontSize: "13px",
        }}
      >
        {report.uploaded_at
          ? new Date(report.uploaded_at).toLocaleDateString()
          : "-"}
      </div>

      {/* ACTION */}

      <div>
        <button
          onClick={(e) => {
            e.stopPropagation();

            navigate(`/report/${report.document}`);
          }}
          style={{
            background: "rgba(255,255,255,0.05)",

            border: "1px solid rgba(255,255,255,0.08)",

            padding: "6px 14px",

            borderRadius: "8px",

            cursor: "pointer",

            color: "#e2e8f0",

            fontSize: "13px",

            fontWeight: "500",
          }}
        >
          View Report
        </button>
      </div>
    </div>
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
