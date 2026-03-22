import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:8000/api";

const statusColors = {
  PASS: { bg: "#052e16", border: "#16a34a", text: "#4ade80" },
  FAIL: { bg: "#2d0000", border: "#dc2626", text: "#f87171" },
  WARN: { bg: "#2d1f00", border: "#d97706", text: "#fbbf24" },
};

const AUDIT_STEPS = [
  "Reading document structure...",
  "Chunking contract text...",
  "Checking payment terms...",
  "Analyzing liability clauses...",
  "Reviewing IP ownership...",
  "Checking termination notice...",
  "Verifying confidentiality clauses...",
  "Checking governing law...",
  "Analyzing dispute resolution...",
  "Calculating risk score...",
  "Finalizing audit report...",
];

function AuditLoader() {
  const [stepIndex, setStepIndex] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStepIndex((prev) => (prev < AUDIT_STEPS.length - 1 ? prev + 1 : prev));
    }, 2800);
    const dotTimer = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => { clearInterval(stepTimer); clearInterval(dotTimer); };
  }, []);

  return (
    <div style={{ marginTop: "1.25rem", padding: "1rem 1.25rem", background: "#0a0f1e", border: "1px solid #1e3a5f", borderRadius: "8px" }}>
      <div style={{ height: "3px", background: "#1e293b", borderRadius: "2px", marginBottom: "1rem", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${((stepIndex + 1) / AUDIT_STEPS.length) * 100}%`, background: "#3b82f6", borderRadius: "2px", transition: "width 2.8s ease" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {AUDIT_STEPS.map((step, i) => (
          <div key={step} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: i < stepIndex ? "#4ade80" : i === stepIndex ? "#e2e8f0" : "#334155", transition: "color 0.4s ease" }}>
            <span style={{ fontSize: "10px" }}>{i < stepIndex ? "✓" : i === stepIndex ? "▶" : "○"}</span>
            {step}{i === stepIndex && dots}
          </div>
        ))}
      </div>
    </div>
  );
}

function AuthScreen({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    const endpoint = isLogin ? "/auth/login" : "/auth/register";
    try {
      const res = await axios.post(`${API}${endpoint}`, { email, password });
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("email", res.data.email);
      onAuth(res.data.email, res.data.access_token);
    } catch (e) {
      setError(e.response?.data?.detail || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <span style={{ fontSize: "28px", fontWeight: "700", color: "#fff" }}>DocuAudit</span>
        <span style={{ fontSize: "28px", fontWeight: "700", color: "#00d4aa" }}> AI</span>
        <p style={{ color: "#94a3b8", fontSize: "13px", marginTop: "6px" }}>Contract Intelligence Platform</p>
      </div>

      <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: "12px", padding: "2rem", width: "100%", maxWidth: "400px" }}>
        <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "1.5rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {isLogin ? "Sign In" : "Create Account"}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ background: "#0a0f1e", border: "1px solid #1e293b", borderRadius: "8px", padding: "10px 14px", color: "#e2e8f0", fontSize: "13px", outline: "none" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            style={{ background: "#0a0f1e", border: "1px solid #1e293b", borderRadius: "8px", padding: "10px 14px", color: "#e2e8f0", fontSize: "13px", outline: "none" }}
          />
        </div>

        {error && (
          <div style={{ marginTop: "12px", padding: "10px 14px", background: "#2d0000", border: "1px solid #dc2626", borderRadius: "8px", fontSize: "12px", color: "#f87171" }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !email || !password}
          style={{ marginTop: "1.25rem", width: "100%", background: loading ? "#0a8c72" : "#00d4aa", color: "#0a0f1e", border: "none", borderRadius: "8px", padding: "12px", fontWeight: "700", fontSize: "14px", cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
        </button>

        <p style={{ marginTop: "1rem", textAlign: "center", fontSize: "12px", color: "#475569" }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span onClick={() => { setIsLogin(!isLogin); setError(null); }} style={{ color: "#00d4aa", cursor: "pointer" }}>
            {isLogin ? "Register" : "Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userEmail, setUserEmail] = useState(localStorage.getItem("email"));
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [auditing, setAuditing] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [documents, setDocuments] = useState([]);

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  function handleAuth(email, accessToken) {
    setToken(accessToken);
    setUserEmail(email);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setToken(null);
    setUserEmail(null);
    setDocuments([]);
    setReport(null);
    setUploadedDoc(null);
  }

  async function fetchDocuments() {
    try {
      const res = await axios.get(`${API}/documents/list`, authHeaders);
      setDocuments(res.data.documents || []);
    } catch (e) {
      console.error("Could not fetch documents.");
    }
  }

  useEffect(() => {
    if (token) fetchDocuments();
  }, [token]);

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setError(null);
    setReport(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(`${API}/documents/upload`, formData, authHeaders);
      setUploadedDoc(res.data.filename);
      fetchDocuments();
    } catch (e) {
      setError("Upload failed. Make sure the backend is running.");
    } finally {
      setUploading(false);
    }
  }

  async function handleAudit() {
    if (!uploadedDoc) return;
    setAuditing(true);
    setError(null);
    try {
      const res = await axios.post(`${API}/audit/run`, { doc_id: uploadedDoc }, authHeaders);
      setReport(res.data);
    } catch (e) {
      setError("Audit failed. Please try again.");
    } finally {
      setAuditing(false);
    }
  }

  async function handleExportPDF() {
    try {
      const res = await axios.post(`${API}/audit/export-pdf`, { doc_id: uploadedDoc }, { ...authHeaders, responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `audit_${uploadedDoc}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      setError("PDF export failed. Please try again.");
    }
  }

  const riskColor = report
    ? report.risk_score >= 70 ? "#f87171" : report.risk_score >= 40 ? "#fbbf24" : "#4ade80"
    : "#4ade80";

  if (!token) return <AuthScreen onAuth={handleAuth} />;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e", color: "#e2e8f0", fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #1e293b", padding: "1rem 2rem", display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "22px", fontWeight: "700", color: "#fff" }}>DocuAudit</span>
        <span style={{ fontSize: "22px", fontWeight: "700", color: "#00d4aa" }}>AI</span>
        <span style={{ marginLeft: "auto", fontSize: "12px", color: "#475569" }}>{userEmail}</span>
        <button onClick={handleLogout} style={{ marginLeft: "12px", background: "transparent", border: "1px solid #1e293b", borderRadius: "6px", padding: "6px 14px", color: "#94a3b8", fontSize: "12px", cursor: "pointer" }}>
          Logout
        </button>
      </div>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "2rem 1rem" }}>

        {/* Upload Card */}
        <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Step 1 — Upload Contract
          </p>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])}
              style={{ flex: 1, background: "#0a0f1e", border: "1px solid #1e293b", borderRadius: "8px", padding: "8px 12px", color: "#e2e8f0", fontSize: "13px" }} />
            <button onClick={handleUpload} disabled={!file || uploading}
              style={{ background: uploading ? "#0a8c72" : "#00d4aa", color: "#0a0f1e", border: "none", borderRadius: "8px", padding: "10px 20px", fontWeight: "700", fontSize: "13px", cursor: uploading ? "not-allowed" : "pointer" }}>
              {uploading ? "Uploading..." : "Upload PDF"}
            </button>
          </div>
          {uploadedDoc && (
            <div style={{ marginTop: "12px", padding: "10px 14px", background: "#052e16", border: "1px solid #16a34a", borderRadius: "8px", fontSize: "13px", color: "#4ade80" }}>
              ✓ Selected: {uploadedDoc}
            </div>
          )}
        </div>

        {/* Document History */}
        {documents.length > 0 && (
          <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Previous Documents
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {documents.map((doc) => (
                <div key={doc} onClick={() => { setUploadedDoc(doc); setReport(null); }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: uploadedDoc === doc ? "#001a14" : "#0a0f1e", border: `1px solid ${uploadedDoc === doc ? "#00d4aa" : "#1e293b"}`, borderRadius: "8px", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span>📄</span>
                    <span style={{ fontSize: "13px", color: "#e2e8f0" }}>{doc}</span>
                  </div>
                  <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "999px", background: uploadedDoc === doc ? "#001a14" : "#1e293b", color: uploadedDoc === doc ? "#00d4aa" : "#475569", border: `1px solid ${uploadedDoc === doc ? "#00d4aa" : "#1e293b"}` }}>
                    {uploadedDoc === doc ? "Selected" : "Select"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audit Button */}
        {uploadedDoc && (
          <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Step 2 — Run Audit
            </p>
            <button onClick={handleAudit} disabled={auditing}
              style={{ background: auditing ? "#1d4ed8" : "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", padding: "12px 28px", fontWeight: "700", fontSize: "14px", cursor: auditing ? "not-allowed" : "pointer", width: "100%" }}>
              {auditing ? "Analyzing..." : "Run Compliance Audit"}
            </button>
            {auditing && <AuditLoader />}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ padding: "12px 16px", background: "#2d0000", border: "1px solid #dc2626", borderRadius: "8px", color: "#f87171", fontSize: "13px", marginBottom: "1.5rem" }}>
            {error}
          </div>
        )}

        {/* Report */}
        {report && (
          <div>
            <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
              <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Audit Report — {report.document}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "1rem" }}>
                {[
                  { label: "Risk Score", value: `${report.risk_score}/100`, color: riskColor },
                  { label: "Passed", value: report.summary.passed, color: "#4ade80" },
                  { label: "Failed", value: report.summary.failed, color: "#f87171" },
                  { label: "Warnings", value: report.summary.warnings, color: "#fbbf24" },
                ].map((s) => (
                  <div key={s.label} style={{ background: "#0a0f1e", borderRadius: "8px", padding: "1rem", textAlign: "center" }}>
                    <div style={{ fontSize: "26px", fontWeight: "700", color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: "12px", padding: "1.5rem" }}>
              <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Clause-by-Clause Findings
              </p>
              {report.results.map((r) => {
                const c = statusColors[r.status] || statusColors.WARN;
                return (
                  <div key={r.rule_id} style={{ border: `1px solid ${c.border}`, background: c.bg, borderRadius: "8px", padding: "12px 16px", marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: c.text, border: `1px solid ${c.border}`, borderRadius: "4px", padding: "2px 8px" }}>
                        {r.status}
                      </span>
                      <span style={{ fontWeight: "600", fontSize: "14px", color: "#e2e8f0" }}>{r.rule_name}</span>
                    </div>
                    <p style={{ fontSize: "13px", color: "#94a3b8", margin: "0 0 4px 0" }}>{r.finding}</p>
                    {r.citation !== "Not found" && (
                      <p style={{ fontSize: "12px", color: "#475569", fontStyle: "italic", margin: 0 }}>"{r.citation}"</p>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
              <button onClick={handleExportPDF}
                style={{ background: "#00d4aa", color: "#0a0f1e", border: "none", borderRadius: "8px", padding: "12px 32px", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
                Download Audit Report (PDF)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}