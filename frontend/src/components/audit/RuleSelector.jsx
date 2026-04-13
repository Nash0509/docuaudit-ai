import { useState, useMemo } from "react";
import RuleSelectableCard from "./RuleSelectableCard";
import { Search } from "lucide-react";
import Button from "../ui/Button";

export default function RuleSelector({ rules, selectedRuleIds, onSelectionChange }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  
  const categories = useMemo(() => {
    const cats = new Set(rules.map(r => r.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [rules]);

  const systemRules = rules.filter(r => r.is_template && !r.industry);
  const industryRules = rules.filter(r => r.is_template && r.industry);
  const myRules = rules.filter(r => !r.is_template);

  const applyFilters = (ruleGroup) => ruleGroup.filter(rule => {
    const matchSearch = rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        rule.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = activeCategory === "All" || rule.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const handleToggle = (id) => {
    if (selectedRuleIds.includes(id)) {
      onSelectionChange(selectedRuleIds.filter(ruleId => ruleId !== id));
    } else {
      onSelectionChange([...selectedRuleIds, id]);
    }
  };

  const handleSelectAll = () => {
    const idsToAdd = rules.map(r => r.id);
    onSelectionChange(Array.from(new Set([...selectedRuleIds, ...idsToAdd])));
  };

  const handleClearAll = () => onSelectionChange([]);

  const renderSection = (title, data) => {
    const filtered = applyFilters(data);
    if (filtered.length === 0) return null;
    return (
      <div style={{ marginBottom: "24px" }}>
        <div style={{
          fontSize: "11px",
          fontWeight: "600",
          color: "var(--text-muted)",
          marginBottom: "10px",
          paddingBottom: "8px",
          borderBottom: "1px solid var(--border)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          {title}
          <span style={{
            background: "var(--bg-surface-hover)",
            border: "1px solid var(--border)",
            padding: "1px 6px",
            borderRadius: "10px",
            fontSize: "10px",
          }}>
            {filtered.length}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filtered.map(rule => (
            <RuleSelectableCard
              key={rule.id}
              rule={rule}
              isSelected={selectedRuleIds.includes(rule.id)}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", height: "460px", borderTop: "1px solid var(--border)", margin: "0" }}>
      
      {/* Left Sidebar: Category Filter */}
      <div style={{
        width: "200px",
        flexShrink: 0,
        borderRight: "1px solid var(--border)",
        padding: "16px 16px 16px 0",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        overflowY: "auto",
        background: "var(--bg-surface)"
      }}>
        <div style={{ fontSize: "10px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px", paddingLeft: "4px" }}>
          Filter by Category
        </div>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              textAlign: "left",
              background: activeCategory === cat ? "var(--accent-light)" : "transparent",
              color: activeCategory === cat ? "var(--accent)" : "var(--text-muted)",
              border: `1px solid ${activeCategory === cat ? "var(--accent)" : "transparent"}`,
              padding: "7px 10px",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: activeCategory === cat ? "600" : "400",
              transition: "all 0.15s",
              fontFamily: "inherit",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Right: Rule List */}
      <div style={{ flex: 1, padding: "16px 0 16px 20px", display: "flex", flexDirection: "column", minWidth: 0, background: "var(--bg-surface)" }}>
        
        {/* Search + Actions Row */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "16px" }}>
          <div style={{
            flex: 1,
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            height: "38px",
            gap: "8px",
          }}>
            <Search size={14} color="var(--text-muted)" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search rules..."
              style={{
                background: "transparent", border: "none", color: "var(--text-primary)",
                flex: 1, outline: "none", fontSize: "13px", fontFamily: "inherit",
              }}
            />
          </div>
          <Button size="sm" variant="secondary" onClick={handleSelectAll}>Select All</Button>
          <Button size="sm" variant="ghost" onClick={handleClearAll}>Clear</Button>
        </div>

        {/* Scrollable List */}
        <div style={{ flex: 1, overflowY: "auto", paddingRight: "8px" }}>
          {renderSection("My Custom Rules", myRules)}
          {renderSection("Industry Templates", industryRules)}
          {renderSection("System Defaults", systemRules)}

          {applyFilters(rules).length === 0 && (
            <div style={{ textAlign: "center", color: "var(--text-muted)", marginTop: "40px", fontSize: "14px" }}>
              No rules match your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
