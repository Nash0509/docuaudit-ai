import { useState, useEffect } from "react";
import { X, ShieldAlert } from "lucide-react";
import { createRule, updateRule } from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import Select from "../ui/Select";

const inputStyle = {
  width: "100%",
  padding: "0 14px",
  height: "42px",
  borderRadius: "var(--radius-md)",
  background: "var(--bg-surface)",
  border: "1px solid var(--border)",
  color: "var(--text-primary)",
  outline: "none",
  fontSize: "14px",
  fontFamily: "inherit",
  transition: "border-color 0.2s",
};

const labelStyle = {
  display: "block",
  color: "var(--text-secondary)",
  marginBottom: "8px",
  fontSize: "13px",
  fontWeight: "500",
};

export default function RuleModal({ isOpen, onClose, onSuccess, initialData = null }) {
  const [formData, setFormData] = useState({ name: "", description: "", severity: "MEDIUM", category: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || "",
          description: initialData.description || "",
          severity: initialData.severity || "MEDIUM",
          category: initialData.category || ""
        });
      } else {
        setFormData({ name: "", description: "", severity: "MEDIUM", category: "" });
      }
      setError("");
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (initialData) {
        await updateRule(initialData.id, formData);
      } else {
        await createRule(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save rule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 100, padding: "20px",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-xl)",
              width: "100%",
              maxWidth: "500px",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            {/* Header */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "22px 28px 18px",
              borderBottom: "1px solid var(--border)",
              background: "rgba(255,255,255,0.01)",
              borderTopLeftRadius: "var(--radius-xl)",
              borderTopRightRadius: "var(--radius-xl)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--accent-dim)", border: "1px solid var(--border-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ShieldAlert size={16} color="var(--accent)" />
                </div>
                <h2 style={{ margin: 0, fontSize: "17px", color: "var(--text-primary)", fontWeight: "700" }}>
                  {initialData ? "Edit Rule" : "Create Custom Rule"}
                </h2>
              </div>
              <button
                onClick={onClose}
                style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", cursor: "pointer", color: "var(--text-muted)" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: "24px 28px 28px" }}>
              {error && (
                <div style={{ background: "var(--danger-dim)", color: "var(--danger)", border: "1px solid rgba(239,68,68,0.2)", padding: "12px 16px", borderRadius: "var(--radius-md)", marginBottom: "20px", fontSize: "13px" }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <label style={labelStyle}>Rule Name</label>
                  <input
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Data Processing Addendum Check"
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "var(--border-accent)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--border)"; }}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Description / Audit Logic</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what the AI auditor should check for..."
                    rows={4}
                    style={{
                      ...inputStyle,
                      height: "auto",
                      padding: "12px 14px",
                      resize: "vertical",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "var(--border-accent)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--border)"; }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>Severity</label>
                    <Select
                      value={formData.severity}
                      onChange={val => setFormData({ ...formData, severity: val })}
                      options={[
                        { label: 'Low', value: 'LOW' },
                        { label: 'Medium', value: 'MEDIUM' },
                        { label: 'High', value: 'HIGH' },
                        { label: 'Critical', value: 'CRITICAL' },
                      ]}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Category</label>
                    <input
                      required
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Compliance"
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = "var(--border-accent)"; }}
                      onBlur={(e) => { e.target.style.borderColor = "var(--border)"; }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "4px" }}>
                  <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
                  <Button type="submit" variant="primary" loading={loading}>{initialData ? "Save Changes" : "Create Rule"}</Button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
