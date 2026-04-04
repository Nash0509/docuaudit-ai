import EvidenceBlock from "./EvidenceBlock";
import AIExplanation from "./AIExplanation";
import { CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";

export default function RuleExpandedPanel({ rule }) {
  return (
    <div style={{ padding: "20px 24px" }}>
      {/* Evidence Section */}
      <div style={{ marginBottom: "24px" }}>
        <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px", fontWeight: "600" }}>
          <CheckCircle2 size={16} color="#3b82f6" /> 
          Clause Evidence
        </h4>
        <EvidenceBlock citation={rule.citation} />
      </div>

      <div style={{ height: "1px", background: "var(--border)", marginBottom: "24px", opacity: 0.5 }} />

      {/* AI Analysis Section */}
      <div style={{ marginBottom: "24px" }}>
        <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px", fontWeight: "600" }}>
          <Lightbulb size={16} color="var(--warn)" /> 
          AI Analysis Reasoning
        </h4>
        <AIExplanation 
          status={rule.status} 
          confidence={rule.confidence || 85} 
          finding={rule.finding} 
        />
      </div>

      {rule.recommendation && rule.status !== "PASS" && (
        <>
          <div style={{ height: "1px", background: "var(--border)", marginBottom: "24px", opacity: 0.5 }} />
          
          <div>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px", fontWeight: "600" }}>
              <AlertTriangle size={16} color="var(--danger)" />
              Actionable Recommendation
            </h4>
            <div style={{ 
              background: "var(--danger-dim)", 
              borderLeft: "3px solid var(--danger)", 
              padding: "14px 18px", 
              borderRadius: "0 var(--radius-md) var(--radius-md) 0",
              color: "var(--text-primary)",
              fontSize: "13px",
              lineHeight: "1.5"
            }}>
              {rule.recommendation}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
