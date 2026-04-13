import EvidenceBlock from "./EvidenceBlock";
import AIExplanation from "./AIExplanation";
import { CheckCircle2, AlertTriangle, Lightbulb, FileSearch } from "lucide-react";

export default function RuleExpandedPanel({ rule }) {
  return (
    <div style={{ padding: "20px 24px", background: "var(--bg-base)" }}>
      {/* Evidence Section */}
      <div style={{ marginBottom: "24px" }}>
        <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", letterSpacing: "0.01em" }}>
          <FileSearch size={16} color="var(--info)" /> 
          Clause Evidence
        </h4>
        <EvidenceBlock citation={rule.citation} />
      </div>

      <div style={{ height: "1px", background: "var(--border)", marginBottom: "24px", opacity: 0.6 }} />

      {/* AI Analysis Section */}
      <div style={{ marginBottom: "24px" }}>
        <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", letterSpacing: "0.01em" }}>
          <Lightbulb size={16} color="var(--warn)" /> 
          AI Reasoning
        </h4>
        <AIExplanation 
          status={rule.status} 
          confidence={rule.confidence || 85} 
          finding={rule.finding} 
        />
      </div>

      {rule.recommendation && rule.status !== "PASS" && (
        <>
          <div style={{ height: "1px", background: "var(--border)", marginBottom: "24px", opacity: 0.6 }} />
          
          <div>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", letterSpacing: "0.01em" }}>
              <AlertTriangle size={16} color="var(--danger)" />
              Remediation Action
            </h4>
            <div style={{ 
              background: "var(--danger-light)", 
              border: "1px solid var(--danger-border)",
              borderLeft: "4px solid var(--danger)", 
              padding: "16px 20px", 
              borderRadius: "0 var(--radius-md) var(--radius-md) 0",
              color: "var(--text-primary)",
              fontSize: "13px",
              lineHeight: "1.6",
              boxShadow: "var(--shadow-sm)"
            }}>
              <div style={{ fontWeight: "600", marginBottom: "4px", color: "var(--danger)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Suggested Edit:</div>
              {rule.recommendation}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
