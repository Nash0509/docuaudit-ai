import Layout from "../components/layout/Layout";
import { useState, useEffect } from "react";
import { getSettings, updateSettings, updatePassword, getCurrentUser } from "../services/api";
import useStore from "../utils/Store";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function Settings() {
  const storeUser = useStore(state => state.user);
  const setStoreUser = useStore(state => state.setUser);
  const [userEmail, setUserEmail] = useState(storeUser?.email || "");
  
  const [strictness, setStrictness] = useState("STANDARD");
  const [confidence, setConfidence] = useState(70);
  const [contextChunks, setContextChunks] = useState(5);
  const [analysisDepth, setAnalysisDepth] = useState("Balanced");
  const [includeRecs, setIncludeRecs] = useState(true);
  const [includeCits, setIncludeCits] = useState(true);
  const [includeConf, setIncludeConf] = useState(true);
  
  const [rules, setRules] = useState({ payment: true, liability: true, ip: true, termination: true, nda: true });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [settingsData, userData] = await Promise.all([getSettings(), getCurrentUser()]);
        setUserEmail(userData.email);
        setStoreUser(userData);

        setStrictness(settingsData.strictness || "STANDARD");
        setConfidence(settingsData.confidence_threshold || 70);
        setContextChunks(settingsData.context_chunks || 5);
        setAnalysisDepth(settingsData.analysis_depth || "Balanced");
        setIncludeRecs(settingsData.include_recommendations !== false);
        setIncludeCits(settingsData.include_citations !== false);
        setIncludeConf(settingsData.include_confidence !== false);
        if (settingsData.rule_toggles) setRules(settingsData.rule_toggles);
      } catch (err) {
        console.error("Failed to load settings data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings({
        strictness, confidence_threshold: parseInt(confidence), context_chunks: parseInt(contextChunks),
        analysis_depth: analysisDepth, include_recommendations: includeRecs, include_citations: includeCits,
        include_confidence: includeConf, rule_toggles: rules
      });
      alert("Settings saved successfully!");
    } catch (err) {
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    const newPassword = prompt("Enter your new password:");
    if (!newPassword) return;
    try {
      await updatePassword(newPassword);
      alert("Password updated successfully!");
    } catch (err) {
      alert("Failed to update password");
    }
  };

  if (loading) return (
    <Layout>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px", color: "var(--text-muted)" }}>
        <div style={{ width: "24px", height: "24px", border: "2px solid var(--accent)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite", marginRight: "10px" }} />
        Loading settings...
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div style={{ maxWidth: "800px", margin: "auto" }}>
        {/* ACCOUNT */}
        <Section title="Account" description="Manage your login and user details">
          <Field label="Email Address" description="The email bound to your account">
            <div style={{
              display: "flex", alignItems: "center",
              background: "var(--bg-surface)", border: "1px solid var(--border)",
              padding: "10px 16px", borderRadius: "var(--radius-md)",
              color: "var(--text-primary)", fontWeight: "500", fontSize: "14px",
              maxWidth: "320px"
            }}>
              {userEmail || "Loading..."}
            </div>
          </Field>
          <Field label="Security" description="Update your login password">
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div style={{
                display: "flex", alignItems: "center",
                background: "var(--bg-surface)", border: "1px solid var(--border)",
                padding: "10px 16px", borderRadius: "var(--radius-md)",
                color: "var(--text-primary)", fontWeight: "700", fontSize: "14px",
                width: "200px", letterSpacing: "2px"
              }}>
                ••••••••
              </div>
              <Button variant="secondary" onClick={handlePasswordChange}>Change Password</Button>
            </div>
          </Field>
        </Section>

        {/* AUDIT */}
        <Section title="Audit Configuration" description="Control how the compliance analysis operates">
          <Field label="Strictness Level" description="Determines how aggressively violations are flagged">
            <Select value={strictness} onChange={(e) => setStrictness(e.target.value)}>
              <option value="RELAXED">Relaxed</option>
              <option value="STANDARD">Standard</option>
              <option value="STRICT">Strict</option>
            </Select>
          </Field>
          <Field label="Confidence Threshold" description="Minimum AI confidence required to flag a failure">
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <input type="range" min="50" max="95" value={confidence} onChange={(e) => setConfidence(e.target.value)}
                style={{ width: "240px", accentColor: "var(--accent)", cursor: "pointer" }} />
              <div style={{ fontWeight: "600", color: "var(--text-primary)", fontSize: "14px", width: "40px" }}>{confidence}%</div>
            </div>
          </Field>
        </Section>

        {/* RULES */}
        <Section title="Rule Engine Options" description="Enable or disable deep compliance checks">
          <Toggle text="Payment Terms Analysis" checked={rules.payment} onChange={() => setRules({ ...rules, payment: !rules.payment })} />
          <Toggle text="Limitation of Liability Checks" checked={rules.liability} onChange={() => setRules({ ...rules, liability: !rules.liability })} />
          <Toggle text="IP Ownership Review" checked={rules.ip} onChange={() => setRules({ ...rules, ip: !rules.ip })} />
          <Toggle text="Termination Notice Logic" checked={rules.termination} onChange={() => setRules({ ...rules, termination: !rules.termination })} />
          <Toggle text="Confidentiality & NDA Validations" checked={rules.nda} onChange={() => setRules({ ...rules, nda: !rules.nda })} />
        </Section>

        {/* AI CAPABILITIES */}
        <Section title="AI Parameters" description="Fine-tune language model integration limits">
          <Field label="Document Context Chunks" description="Number of text chunks embedded per retrieval">
            <Select value={contextChunks} onChange={e => setContextChunks(e.target.value)}>
              <option value="3">3 Chunks</option>
              <option value="5">5 Chunks</option>
              <option value="7">7 Chunks</option>
              <option value="10">10 Chunks</option>
            </Select>
          </Field>
          <Field label="Response Depth" description="Volume and verbosity of generated AI reasoning">
            <Select value={analysisDepth} onChange={e => setAnalysisDepth(e.target.value)}>
              <option value="Concise">Concise</option>
              <option value="Balanced">Balanced</option>
              <option value="Detailed">Detailed</option>
            </Select>
          </Field>
        </Section>

        {/* EXPORT OPTIONS */}
        <Section title="Export Formatting" description="What metadata to include when exporting PDFs">
          <Toggle text="Include recommendations" checked={includeRecs} onChange={() => setIncludeRecs(!includeRecs)} />
          <Toggle text="Include contract text citations" checked={includeCits} onChange={() => setIncludeCits(!includeCits)} />
          <Toggle text="Include numeric confidence score" checked={includeConf} onChange={() => setIncludeConf(!includeConf)} />
        </Section>

        {/* SAVE STICKY */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "32px", marginBottom: "40px" }}>
          <Button variant="primary" size="lg" onClick={handleSave} loading={saving}>
            Save Changes
          </Button>
        </div>
      </div>
    </Layout>
  );
}

function Section({ title, description, children }) {
  return (
    <Card hover={false} style={{ marginBottom: "24px", padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.01)" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "600", color: "var(--text-primary)", margin: 0, marginBottom: "4px" }}>{title}</h3>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>{description}</p>
      </div>
      <div style={{ padding: "24px" }}>
        {children}
      </div>
    </Card>
  );
}

function Field({ label, description, children }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ marginBottom: "8px" }}>
        <div style={{ fontSize: "14px", fontWeight: "500", color: "var(--text-primary)" }}>{label}</div>
        <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{description}</div>
      </div>
      {children}
    </div>
  );
}

function Toggle({ text, checked, onChange }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
      <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{text}</div>
      <div
        onClick={onChange}
        style={{
          width: "36px", height: "20px", borderRadius: "10px",
          background: checked ? "var(--accent)" : "rgba(255,255,255,0.1)",
          cursor: "pointer", position: "relative", transition: "0.2s ease"
        }}
      >
        <div style={{
          width: "16px", height: "16px", borderRadius: "50%", background: "#fff",
          position: "absolute", top: "2px", left: checked ? "18px" : "2px",
          transition: "0.2s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.3)"
        }} />
      </div>
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        padding: "0 12px",
        height: "40px",
        borderRadius: "var(--radius-md)",
        color: "var(--text-primary)",
        width: "100%",
        maxWidth: "320px",
        fontSize: "14px",
        fontFamily: "inherit",
        opacity: props.disabled ? 0.6 : 1,
        transition: "border-color 0.2s",
        ...props.style
      }}
      onFocus={(e) => { if (!props.disabled) e.target.style.borderColor = "var(--border-accent)"; }}
      onBlur={(e) => { if (!props.disabled) e.target.style.borderColor = "var(--border)"; }}
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        padding: "0 12px",
        height: "40px",
        borderRadius: "var(--radius-md)",
        color: "var(--text-primary)",
        fontSize: "14px",
        fontFamily: "inherit",
        minWidth: "200px",
        cursor: "pointer",
        ...props.style
      }}
    />
  );
}
