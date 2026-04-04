import { useState, useEffect } from "react";
import { getRules } from "../../services/api";

export default function RuleSelector({ selectedRules, onSelectionChange }) {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const data = await getRules();
        setRules(data);
      } catch (error) {
        console.error("Failed to load rules:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRules();
  }, []);

  const handleToggle = (ruleId) => {
    if (selectedRules.includes(ruleId)) {
      onSelectionChange(selectedRules.filter(id => id !== ruleId));
    } else {
      onSelectionChange([...selectedRules, ruleId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedRules.length === rules.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(rules.map(r => r.id));
    }
  };

  if (loading) return <div style={{ color: "#64748b", fontSize: "14px" }}>Loading rules...</div>;

  return (
    <div style={{
      background: "rgba(0,0,0,0.2)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "12px",
      padding: "20px",
      marginTop: "20px"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h4 style={{ margin: 0, color: "#f8fafc", fontSize: "15px", fontWeight: "600" }}>Select Rules to Audit</h4>
        
        <button 
          onClick={handleSelectAll}
          style={{
            background: "none",
            border: "none",
            color: "#00d4aa",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "500"
          }}
        >
          {selectedRules.length === rules.length ? "Deselect All" : "Select All"}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "250px", overflowY: "auto", paddingRight: "10px" }}>
        {rules.map(rule => (
          <label 
            key={rule.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              padding: "12px",
              background: selectedRules.includes(rule.id) ? "rgba(0, 212, 170, 0.05)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${selectedRules.includes(rule.id) ? "rgba(0, 212, 170, 0.2)" : "rgba(255,255,255,0.05)"}`,
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            <input 
              type="checkbox"
              checked={selectedRules.includes(rule.id)}
              onChange={() => handleToggle(rule.id)}
              style={{
                marginTop: "3px",
                accentColor: "#00d4aa",
                cursor: "pointer"
              }}
            />
            <div>
              <div style={{ color: "#e2e8f0", fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>
                {rule.name}
              </div>
              <div style={{ color: "#64748b", fontSize: "12px" }}>
                {rule.is_template ? (rule.industry ? `Industry: ${rule.industry}` : 'System Default') : 'Custom Rule'} · {rule.category}
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
