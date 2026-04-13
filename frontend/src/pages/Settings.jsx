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
      className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-5 shadow-sm"
    >
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        <p className="text-xs text-slate-400 mt-0.5">{description}</p>
      </div>
      <div className="px-6 py-5 space-y-5">{children}</div>
    </motion.div>
  );
}

function Field({ label, description, children }) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-slate-700">{label}</div>
        {description && <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{description}</div>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ text, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
      <div>
        <div className="text-sm text-slate-700">{text}</div>
        {description && <div className="text-xs text-slate-400 mt-0.5">{description}</div>}
      </div>
      <button
        onClick={onChange}
        className={`relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 border-0 cursor-pointer`}
        style={{
          width: "40px",
          height: "22px",
          borderRadius: "11px",
          background: checked ? "#6366F1" : "#CBD5E1",
          transition: "background 0.2s",
          border: "none",
          padding: 0,
        }}
      >
        <div style={{
          width: "16px", height: "16px", borderRadius: "50%", background: "#fff",
          position: "absolute", top: "3px", left: checked ? "21px" : "3px",
          transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
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
      className="h-9 px-3 rounded-lg border border-slate-200 text-sm text-slate-700 bg-white hover:border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 outline-none transition-all min-w-[160px]"
      style={{ fontFamily: "inherit" }}
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
      <div className="flex items-center justify-center h-64 gap-3 text-slate-400">
        <Loader2 size={18} className="animate-spin text-indigo-500" />
        <span className="text-sm">Loading settings...</span>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="max-w-2xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-7">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <SettingsIcon size={18} className="text-indigo-500" />
              <h1 className="text-lg font-bold text-slate-900">Settings</h1>
            </div>
            <p className="text-sm text-slate-500">Manage your system and audit preferences.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm ${saved ? "bg-emerald-600 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"} disabled:opacity-60`}
            style={{ fontFamily: "inherit" }}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Account */}
        <Section title="Account" description="Manage your login and user details" index={0}>
          <Field label="Email Address" description="The email bound to your account">
            <div className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-600 font-medium min-w-[200px]">
              {userEmail || "Loading..."}
            </div>
          </Field>
          <Field label="Password" description="Update your login credentials">
            <div className="flex items-center gap-3">
              <div className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-400 tracking-widest min-w-[120px]">
                ••••••••
              </div>
              <button
                onClick={handlePasswordChange}
                className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                style={{ fontFamily: "inherit" }}
              >
                Change
              </button>
            </div>
          </Field>
          <Field label="Subscription Plan" description="Your current billing tier">
            <div className="flex items-center gap-3">
              {storeUser?.is_subscribed ? (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700">
                  <Shield size={12} /> Pro · Unlimited
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-700">
                  Free · 1 Audit
                </span>
              )}
              {!storeUser?.is_subscribed && (
                <button
                  onClick={() => navigate("/pricing")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
                  style={{ fontFamily: "inherit" }}
                >
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
            <div className="flex items-center gap-3">
              <input
                type="range" min="50" max="95" value={confidence}
                onChange={(e) => setConfidence(e.target.value)}
                className="w-40 cursor-pointer"
                style={{ accentColor: "#6366F1" }}
              />
              <span className="text-sm font-bold text-slate-700 w-10 text-right">{confidence}%</span>
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
