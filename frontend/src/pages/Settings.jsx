import Layout from "../components/layout/Layout";
import { useState, useEffect } from "react";
import { getSettings, updateSettings, updatePassword, getCurrentUser } from "../services/api";
import useStore from "../utils/Store";
import { useNavigate } from "react-router-dom";
import { Settings as SettingsIcon, Zap, Loader2, Save, Shield } from "lucide-react";
import { motion } from "framer-motion";

function Section({ title, description, children, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="card" style={{ padding: 0, marginBottom: 20, overflow: "hidden" }}
    >
      <div style={{ padding: "16px 24px", borderBottom: `1px solid var(--border)`, background: "var(--bg-surface-hover)" }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>{title}</h3>
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2, margin: "2px 0 0 0" }}>{description}</p>
      </div>
      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>{children}</div>
    </motion.div>
  );
}

function Field({ label, description, children }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>{label}</div>
        {description && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2, lineHeight: 1.5 }}>{description}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function Toggle({ text, description, checked, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 12, borderBottom: `1px solid var(--border)` }}>
      <div>
        <div style={{ fontSize: 14, color: "var(--text-primary)" }}>{text}</div>
        {description && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{description}</div>}
      </div>
      <button
        onClick={onChange}
        style={{
          width: 40, height: 22, borderRadius: 11, background: checked ? "var(--accent)" : "var(--border-disabled)",
          transition: "background 0.2s", border: "none", padding: 0, position: "relative", cursor: "pointer", flexShrink: 0
        }}
      >
        <div style={{
          width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 3,
          left: checked ? 21 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
        }} />
      </button>
    </div>
  );
}

function SettingsSelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input"
      style={{ minWidth: 160, padding: "8px 12px", height: 36 }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export default function Settings() {
  const setTopBar = useStore((state) => state.setTopBar);
  const storeUser = useStore((state) => state.user);
  const setStoreUser = useStore((state) => state.setUser);
  const navigate = useNavigate();

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
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setTopBar("settings");
    (async () => {
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
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings({
        strictness, confidence_threshold: parseInt(confidence), context_chunks: parseInt(contextChunks),
        analysis_depth: analysisDepth, include_recommendations: includeRecs, include_citations: includeCits,
        include_confidence: includeConf, rule_toggles: rules
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) { alert("Failed to save settings"); }
    finally { setSaving(false); }
  };

  const handlePasswordChange = async () => {
    const newPassword = prompt("Enter your new password:");
    if (!newPassword) return;
    try { await updatePassword(newPassword); alert("Password updated!"); }
    catch (e) { alert("Failed to update password"); }
  };

  if (loading) return (
    <Layout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 256, gap: 12, color: "var(--text-muted)" }}>
        <Loader2 size={18} style={{ animation: "spin 1s linear infinite", color: "var(--accent)" }} />
        <span style={{ fontSize: 14 }}>Loading settings...</span>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div style={{ maxWidth: 672, margin: "0 auto", paddingBottom: 40 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <SettingsIcon size={18} color="var(--accent)" />
              <h1 className="page-title">Settings</h1>
            </div>
            <p className="page-sub">Manage your system and audit preferences.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn"
            style={{ padding: "10px 16px", background: saved ? "var(--success)" : "var(--accent)", color: "#fff", opacity: saving ? 0.6 : 1 }}
          >
            {saving ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={14} />}
            {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Account */}
        <Section title="Account" description="Manage your login and user details" index={0}>
          <Field label="Email Address" description="The email bound to your account">
            <div style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-surface-hover)", fontSize: 14, color: "var(--text-secondary)", fontWeight: 500, minWidth: 200 }}>
              {userEmail || "Loading..."}
            </div>
          </Field>
          <Field label="Password" description="Update your login credentials">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-surface-hover)", fontSize: 14, color: "var(--text-muted)", letterSpacing: "0.1em", minWidth: 120 }}>
                ••••••••
              </div>
              <button onClick={handlePasswordChange} className="btn btn-secondary">Change</button>
            </div>
          </Field>
          <Field label="Subscription Plan" description="Your current billing tier">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {storeUser?.is_subscribed ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 20, background: "var(--info-light)", border: "1px solid var(--info-border)", fontSize: 12, fontWeight: 700, color: "var(--info)" }}>
                  <Shield size={12} /> Pro · Unlimited
                </span>
              ) : (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 20, background: "var(--warn-light)", border: "1px solid var(--warn-border)", fontSize: 12, fontWeight: 700, color: "var(--warn)" }}>
                  Free · 1 Audit
                </span>
              )}
              {!storeUser?.is_subscribed && (
                <button onClick={() => navigate("/pricing")} className="btn btn-primary btn-sm">
                  <Zap size={11} /> Upgrade
                </button>
              )}
            </div>
          </Field>
        </Section>

        {/* Audit Config */}
        <Section title="Audit Configuration" description="Control how AI compliance analysis operates" index={1}>
          <Field label="Strictness Level" description="How aggressively violations are flagged">
            <SettingsSelect
              value={strictness}
              onChange={setStrictness}
              options={[{ label: "Relaxed", value: "RELAXED" }, { label: "Standard", value: "STANDARD" }, { label: "Strict", value: "STRICT" }]}
            />
          </Field>
          <Field label="Confidence Threshold" description={`Minimum AI confidence to flag a failure (${confidence}%)`}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <input
                type="range" min="50" max="95" value={confidence}
                onChange={(e) => setConfidence(e.target.value)}
                style={{ width: 160, cursor: "pointer", accentColor: "var(--accent)" }}
              />
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", width: 40, textAlign: "right" }}>{confidence}%</span>
            </div>
          </Field>
        </Section>

        {/* Rule Engine */}
        <Section title="Rule Engine Options" description="Enable or disable deep compliance checks" index={2}>
          <Toggle text="Payment Terms Analysis" checked={rules.payment} onChange={() => setRules({ ...rules, payment: !rules.payment })} />
          <Toggle text="Limitation of Liability Checks" checked={rules.liability} onChange={() => setRules({ ...rules, liability: !rules.liability })} />
          <Toggle text="IP Ownership Review" checked={rules.ip} onChange={() => setRules({ ...rules, ip: !rules.ip })} />
          <Toggle text="Termination Notice Logic" checked={rules.termination} onChange={() => setRules({ ...rules, termination: !rules.termination })} />
          <Toggle text="Confidentiality & NDA Validations" checked={rules.nda} onChange={() => setRules({ ...rules, nda: !rules.nda })} />
        </Section>

        {/* AI Parameters */}
        <Section title="AI Parameters" description="Fine-tune language model integration limits" index={3}>
          <Field label="Context Chunks" description="Number of text chunks embedded per retrieval">
            <SettingsSelect
              value={contextChunks}
              onChange={setContextChunks}
              options={[{ label: "3 Chunks", value: "3" }, { label: "5 Chunks", value: "5" }, { label: "7 Chunks", value: "7" }, { label: "10 Chunks", value: "10" }]}
            />
          </Field>
          <Field label="Response Depth" description="Volume and verbosity of AI reasoning">
            <SettingsSelect
              value={analysisDepth}
              onChange={setAnalysisDepth}
              options={[{ label: "Concise", value: "Concise" }, { label: "Balanced", value: "Balanced" }, { label: "Detailed", value: "Detailed" }]}
            />
          </Field>
        </Section>

        {/* Export Options */}
        <Section title="Export Formatting" description="What metadata to include when exporting PDFs" index={4}>
          <Toggle text="Include recommendations" checked={includeRecs} onChange={() => setIncludeRecs(!includeRecs)} />
          <Toggle text="Include contract text citations" checked={includeCits} onChange={() => setIncludeCits(!includeCits)} />
          <Toggle text="Include numeric confidence score" checked={includeConf} onChange={() => setIncludeConf(!includeConf)} />
        </Section>
      </div>
    </Layout>
  );
}
