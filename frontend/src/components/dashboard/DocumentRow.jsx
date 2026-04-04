import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import Badge from "../ui/Badge";

import RiskIndicator from "../ui/RiskIndicator";

import { deleteDocument } from "../../services/api";

import {
  FileText,
  ChevronDown,
  AlertTriangle,
  PlayCircle,
  FileChartColumn,
} from "lucide-react";

import RiskGauge from "../ui/RiskGuage";

import { runAudit } from "../../services/api";

import { useNavigate } from "react-router-dom";

export default function DocumentRow({ variant, doc, onAuditComplete }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [auditing, setAuditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [auditData, setAuditData] = useState(null);

  const isDocuments = variant === "documents";

  const navigate = useNavigate();

  async function handleAudit(e) {
    e.stopPropagation();

    setAuditing(true);

    try {
      const result = await runAudit(doc.document_id);
      setAuditData(result);

      if (onAuditComplete) {
        onAuditComplete();
      }
    } catch (e) {
      console.log(e);
    } finally {
      setAuditing(false);
    }
  }

  async function handleDelete(e) {
    e.stopPropagation();

    const confirmDelete = window.confirm("Delete this document?");

    if (!confirmDelete) return;

    try {
      await deleteDocument(doc.document_id);

      if (onAuditComplete) {
        onAuditComplete();
      }
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  }

  function getStatusType(status) {
    if (status === "indexed") return "success";

    if (status === "processing") return "warning";

    return "neutral";
  }

  //   if (loading) {
  //     return <div style={{ padding: "30px" }}>Loading documents...</div>;
  //   }

  return (
    <div>
      {/* MAIN ROW */}

      <div
        onClick={() => setOpen(!open)}
        style={{
          display: "grid",

          gridTemplateColumns: isDocuments
            ? "2fr 1fr 1fr 1fr 1fr"
            : "2fr 1fr 1fr 1fr",

          padding: "16px",

          borderBottom: "1px solid rgba(255,255,255,0.04)",

          alignItems: "center",

          cursor: "pointer",

          transition: "0.2s",

          borderLeft: "4px solid #f59e0b",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.02)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        {/* DOCUMENT */}

        <div
          style={{
            display: "flex",

            alignItems: "center",

            gap: "12px",
          }}
        >
          <ChevronDown
            size={16}
            style={{
              transform: open ? "rotate(180deg)" : "rotate(0deg)",

              transition: "0.25s",
            }}
          />

          <div
            style={{
              background: "rgba(255,255,255,0.04)",

              padding: "8px",

              borderRadius: "8px",
            }}
          >
            <FileText size={16} />
          </div>

          <div>
            <div
              style={{
                fontWeight: "500",
              }}
            >
              {doc.filename}
            </div>

            <div
              style={{
                fontSize: "12px",

                color: "#64748b",
              }}
            >
              {doc.uploaded_at || "-"}
            </div>
          </div>
        </div>

        {/* STATUS */}

        <div>
          <Badge text={doc.status} type={getStatusType(doc.status)} />
        </div>

        {/* RISK */}

        <div>
          {doc.audited ? (
            <RiskIndicator level="medium" />
          ) : (
            <span style={{ color: "#64748b" }}>Pending Audit</span>
          )}
        </div>

        {/* TIME */}

        <div
          style={{
            fontSize: "13px",

            color: "#94a3b8",
          }}
        >
          2 hrs ago
        </div>

        {/* ACTION COLUMN ONLY FOR DOCUMENTS */}

        {isDocuments && (
          <div
            style={{
              display: "flex",

              gap: "8px",

              alignItems: "center",
            }}
          >
            {/* AUDIT */}

            <button
              onClick={handleAudit}
              disabled={auditing}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                color: "#398bf6",
                fontSize: "12px",
                transition: "0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(57,139,246,0.15)";
                e.currentTarget.style.border = "1px solid rgba(57,139,246,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.border =
                  "1px solid rgba(255,255,255,0.08)";
              }}
            >
              {auditing
                ? "Auditing..."
                : doc.audited
                  ? "View Report"
                  : "Run Audit"}
            </button>

            {/* VIEW */}

            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                color: "#e2e8f0",
                fontSize: "12px",
                transition: "0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.border =
                  "1px solid rgba(255,255,255,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.border =
                  "1px solid rgba(255,255,255,0.08)";
              }}
            >
              View
            </button>

            {/* DELETE */}

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(true);
              }}
              style={{
                background: "rgba(239,68,68,0.15)",
                border: "1px solid rgba(239,68,68,0.25)",
                padding: "6px 10px",
                borderRadius: "6px",
                cursor: "pointer",
                color: "#f87171",
                fontSize: "12px",
                transition: "0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(239,68,68,0.25)";
                e.currentTarget.style.border = "1px solid rgba(239,68,68,0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(239,68,68,0.15)";
                e.currentTarget.style.border = "1px solid rgba(239,68,68,0.25)";
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <div
              style={{
                fontSize: "18px",

                fontWeight: "600",

                marginBottom: "10px",
              }}
            >
              Delete Document
            </div>

            <div
              style={{
                color: "#94a3b8",

                fontSize: "14px",

                marginBottom: "20px",

                lineHeight: "1.6",
              }}
            >
              This will permanently delete the document, all indexed vectors,
              and audit reports. This action cannot be undone.
            </div>

            <div
              style={{
                display: "flex",

                justifyContent: "flex-end",

                gap: "10px",
              }}
            >
              <button
                onClick={() => setShowDeleteModal(false)}
                style={cancelBtn}
              >
                Cancel
              </button>

              <button
                onClick={(e) => {
                  handleDelete(e);

                  setShowDeleteModal(false);
                }}
                style={deleteBtn}
              >
                Delete permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXPAND SECTION */}

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
            transition={{
              duration: 0.3,
            }}
            style={{
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.02)",

                padding: "20px",

                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {/* INFO */}

              <div
                style={{
                  display: "flex",

                  gap: "40px",

                  alignItems: "center",

                  marginBottom: "20px",
                }}
              >
                <RiskGauge score={auditData?.risk_score || 0} />

                <div
                  style={{
                    display: "flex",

                    gap: "40px",
                  }}
                >
                  <Info label="Chunks" value={doc.chunks} />

                  <Info
                    label="Audit Status"
                    value={doc.audited ? "Completed" : "Pending"}
                  />

                  <Info
                    label="Rules Checked"
                    value={auditData?.rules_checked || "-"}
                  />

                  <Info
                    label="Confidence"
                    value={
                      auditData
                        ? Math.round(
                            auditData.results.reduce(
                              (a, b) => a + (b.confidence || 0),

                              0,
                            ) / auditData.results.length,
                          ) + "%"
                        : "-"
                    }
                  />

                  <Info
                    label="Rules Checked"
                    value={auditData?.rules_checked || "-"}
                  />
                </div>
              </div>

              {/* FINDINGS */}

              <div
                style={{
                  background: "rgba(255,255,255,0.03)",

                  borderRadius: "10px",

                  padding: "16px",

                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",

                    alignItems: "center",

                    gap: "8px",

                    marginBottom: "10px",
                  }}
                >
                  <AlertTriangle size={16} color="#f59e0b" />
                  <div
                    style={{
                      fontWeight: "600",
                    }}
                  >
                    AI Findings
                  </div>
                </div>

                {!auditData && (
                  <div
                    style={{
                      color: "#64748b",
                      fontSize: "13px",
                    }}
                  >
                    Run audit to generate AI findings
                  </div>
                )}

                {auditData ? (
                  auditData.results

                    .filter((r) => r.status !== "PASS")

                    .slice(0, 5)

                    .map((r) => (
                      <Finding
                        key={r.rule_id}
                        text={r.finding}
                        severity={r.severity}
                        title={r.citation}
                      />
                    ))
                ) : (
                  <Finding text="Run audit to see findings" />
                )}
              </div>

              {/* RECOMMENDATIONS */}

              {auditData && (
                <div
                  style={{
                    background: "rgba(0,212,170,0.05)",

                    border: "1px solid rgba(0,212,170,0.15)",

                    borderRadius: "10px",

                    padding: "16px",

                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "600",

                      marginBottom: "10px",

                      color: "#00d4aa",
                    }}
                  >
                    AI Recommendations
                  </div>

                  {auditData?.results

                    .filter((r) => r.recommendation)

                    .slice(0, 5)

                    .map((r) => (
                      <Recommendation
                        key={r.rule_id}
                        text={r.recommendation}
                        severity={r.severity}
                      />
                    ))}
                </div>
              )}

              {auditData?.results.filter((r) => r.recommendation).length ===
                0 && (
                <div
                  style={{
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  No recommendations
                </div>
              )}

              {/* EXPAND ACTIONS */}

              <div
                style={{
                  display: "flex",

                  gap: "12px",
                }}
              >
                <ActionButton
                  text="View Report"
                  onClick={() => navigate(`/report/${doc.document_id}`)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Info({ label, value }) {
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
          fontSize: "18px",

          fontWeight: "600",

          marginTop: "4px",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Finding({ text, severity }) {
  return (
    <div
      style={{
        fontSize: "13px",

        color:
          severity === "HIGH"
            ? "#ef4444"
            : severity === "MEDIUM"
              ? "#f59e0b"
              : "#cbd5f5",

        marginBottom: "6px",
      }}
    >
      • {text}
    </div>
  );
}

function Recommendation({ text, severity }) {
  let color = "#22c55e";

  if (severity === "HIGH") color = "#ef4444";

  if (severity === "MEDIUM") color = "#f59e0b";

  return (
    <div
      style={{
        display: "flex",

        gap: "10px",

        marginBottom: "8px",

        fontSize: "13px",
      }}
    >
      <div
        style={{
          width: "6px",

          borderRadius: "4px",

          background: color,
        }}
      />

      <div
        style={{
          color: "#cbd5f5",
        }}
      >
        {text}
      </div>
    </div>
  );
}

function ActionButton({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "rgba(255,255,255,0.05)",

        border: "1px solid rgba(255,255,255,0.08)",

        padding: "8px 16px",

        borderRadius: "8px",

        cursor: "pointer",

        color: "#e2e8f0",

        transition: "0.2s",
      }}
      onMouseEnter={(e) => {
        e.target.style.background = "rgba(255,255,255,0.09)";
      }}
      onMouseLeave={(e) => {
        e.target.style.background = "rgba(255,255,255,0.05)";
      }}
    >
      {text}
    </button>
  );
}

const overlayStyle = {
  position: "fixed",

  top: 0,

  left: 0,

  right: 0,

  bottom: 0,

  background: "rgba(0,0,0,0.6)",

  backdropFilter: "blur(4px)",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  zIndex: 1000,
};

const modalStyle = {
  width: "420px",

  background: "#020617",

  border: "1px solid rgba(255,255,255,0.08)",

  borderRadius: "14px",

  padding: "24px",

  boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
};

const cancelBtn = {
  background: "rgba(255,255,255,0.04)",

  border: "1px solid rgba(255,255,255,0.08)",

  padding: "8px 14px",

  borderRadius: "8px",

  cursor: "pointer",

  color: "#e2e8f0",
};

const deleteBtn = {
  background: "rgba(239,68,68,0.2)",

  border: "1px solid rgba(239,68,68,0.35)",

  padding: "8px 14px",

  borderRadius: "8px",

  cursor: "pointer",

  color: "#f87171",

  fontWeight: "600",
};
