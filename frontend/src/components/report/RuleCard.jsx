import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RuleExpandedPanel from "./RuleExpandedPanel";
import Badge from "../ui/Badge";
import Card from "../ui/Card";

export default function RuleCard({ rule }) {
  const [open, setOpen] = useState(false);

  return (
    <Card 
      hover={false} 
      onClick={() => setOpen(!open)}
      style={{ 
        padding: "0", 
        marginBottom: "16px",
        background: open ? "var(--bg-surface-hover)" : "var(--bg-surface)",
        borderColor: open ? "var(--accent)" : "var(--border)",
        cursor: "pointer",
        overflow: "hidden",
        boxShadow: open ? "var(--shadow-sm)" : "none",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
      }}
    >
      {/* Header Area */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "18px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", color: "var(--text-primary)", fontWeight: "600", fontSize: "15px" }}>
            <div style={{ 
              width: "24px", height: "24px", 
              borderRadius: "6px", 
              background: open ? "var(--accent-light)" : "var(--bg-surface-hover)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s"
            }}>
              <ChevronDown
                size={14}
                color={open ? "var(--accent)" : "var(--text-muted)"}
                style={{
                  transform: open ? "rotate(180deg)" : "rotate(-90deg)",
                  transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            </div>
            {rule.rule_name}
          </div>

          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            <Badge text={rule.status} />
            <Badge text={rule.severity || "LOW"} dot={false} style={{ opacity: 0.8 }} />
          </div>
        </div>

        {/* Collapsed Finding Preview */}
        {!open && (
           <div style={{ 
             color: "var(--text-secondary)", 
             fontSize: "13px", 
             paddingLeft: "34px", 
             whiteSpace: "nowrap", 
             overflow: "hidden", 
             textOverflow: "ellipsis",
             opacity: 0.8
           }}>
             {rule.finding || "Analysis summary available upon expansion."}
           </div>
        )}
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden", borderTop: "1px solid var(--border)", background: "var(--bg-surface-hover)" }}
          >
            <div style={{ padding: "0" }} onClick={e => e.stopPropagation()}>
              <RuleExpandedPanel rule={rule} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
