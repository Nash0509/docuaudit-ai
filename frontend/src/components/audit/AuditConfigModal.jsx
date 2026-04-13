import { useState, useEffect } from "react";
import { X, ShieldAlert, Zap } from "lucide-react";
import { getRules, runAudit } from "../../services/api";
import RuleSelector from "./RuleSelector";
import AuditProgress from "./AuditProgress";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/ToastContext";

export default function AuditConfigModal({ isOpen, onClose, documentId, onAuditComplete }) {
  const [rules, setRules] = useState([]);
  const [selectedRuleIds, setSelectedRuleIds] = useState([]);
  const [loadingRules, setLoadingRules] = useState(true);
  const [auditing, setAuditing] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      const fetchRules = async () => {
        try {
          const data = await getRules();
          setRules(data);
          setSelectedRuleIds(data.map(r => r.id));
        } catch (e) {
          console.error("Failed to load rules", e);
        } finally {
          setLoadingRules(false);
        }
      };
      setLoadingRules(true);
      fetchRules();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRunAudit = async () => {
    if (selectedRuleIds.length === 0) return;
    setAuditing(true);
    
    try {
      const result = await runAudit(documentId, selectedRuleIds);
      // Wait a moment for UX
      setTimeout(() => {
        toast.success("Audit Complete", "The compliance check finished successfully.");
        onAuditComplete(result);
        onClose();
        setAuditing(false);
      }, 8500); // AuditProgress has fixed animation of ~8.5s for showcase
    } catch (e) {
      console.error(e);
      setAuditing(false);
      
      // Handle Paywall Block (Limit Reached)
      if (e.response && (e.response.status === 402 || e.response.status === 403)) {
         onClose();
         toast.error("Usage Limit Reached", "Your first free audit is complete. Please upgrade to Pro to continue.");
         navigate("/pricing");
         return;
      }

      toast.error("Audit Failed", "There was a problem running the audit. Please try again.");
    }
  };

  const criticalCount = rules.filter(r => selectedRuleIds.includes(r.id) && r.severity === "CRITICAL").length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000, padding: "20px",
          }}
          onClick={(e) => { if (e.target === e.currentTarget && !auditing) onClose(); }}
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
              maxWidth: "900px",
              boxShadow: "var(--shadow-lg)",
              display: "flex",
              flexDirection: "column",
              maxHeight: "90vh",
              overflow: "hidden",
            }}
          >
            {auditing ? (
               <AuditProgress />
            ) : (
              <>
                {/* Header */}
                <div style={{
                  padding: "24px 28px 20px",
                  display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                  borderBottom: "1px solid var(--border)",
                  background: "var(--bg-surface-hover)",
                  opacity: 0.5
                }}>
                  <div>
                    <h2 style={{ margin: 0, color: "var(--text-primary)", fontSize: "18px", fontWeight: "700" }}>
                      Configure Audit
                    </h2>
                    <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: "13px" }}>
                      Select compliance rules to evaluate against this document.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    style={{
                      width: "32px", height: "32px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: "var(--bg-surface)", border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)", cursor: "pointer", color: "var(--text-muted)",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Body */}
                <div style={{ padding: "0 28px", flex: 1, overflowY: "auto", minHeight: 0, background: "var(--bg-surface)" }}>
                  {loadingRules ? (
                    <div style={{ height: "460px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", gap: "12px" }}>
                      <div style={{ width: "20px", height: "20px", border: "2px solid var(--accent)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                      Loading available rules...
                    </div>
                  ) : (
                    <RuleSelector
                      rules={rules}
                      selectedRuleIds={selectedRuleIds}
                      onSelectionChange={setSelectedRuleIds}
                    />
                  )}
                </div>

                {/* Footer */}
                <div style={{
                  padding: "16px 28px",
                  borderTop: "1px solid var(--border)",
                  background: "var(--bg-surface-hover)",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                      <span style={{ fontWeight: "600", color: "var(--accent)" }}>{selectedRuleIds.length}</span> of {rules.length} rules selected
                    </div>
                    {criticalCount > 0 && (
                      <Badge text={`${criticalCount} CRITICAL`} style={{ letterSpacing: "0.03em" }} />
                    )}
                    {selectedRuleIds.length === 0 && (
                      <span style={{ color: "var(--warn)", fontSize: "12px" }}>Select at least one rule</span>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button
                      variant="primary"
                      onClick={handleRunAudit}
                      disabled={selectedRuleIds.length === 0}
                      icon={<Zap size={15} />}
                    >
                      Run Audit
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
