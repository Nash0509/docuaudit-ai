import { useState } from "react";
import { ChevronDown, ShieldAlert } from "lucide-react";
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
        borderColor: open ? "var(--border-hover)" : "var(--border)",
        cursor: "pointer",
        overflow: "hidden"
      }}
    >
      {/* Header Area */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "16px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", color: "var(--text-primary)", fontWeight: "600", fontSize: "15px" }}>
            <ChevronDown
              size={18}
              color="var(--text-muted)"
              style={{
                transform: open ? "rotate(180deg)" : "rotate(-90deg)",
                transition: "transform 0.3s ease",
              }}
            />
            {rule.rule_name}
          </div>

          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            <Badge text={rule.status} />
            <Badge text={rule.severity || "LOW"} dot={false} style={{ opacity: 0.8 }} />
          </div>
        </div>

        {/* Collapsed Snippet */}
        <AnimatePresence initial={false}>
          {!open && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ color: "var(--text-secondary)", fontSize: "13px", paddingLeft: "28px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
            >
              {rule.finding || "No finding details provided."}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ overflow: "hidden", borderTop: "1px solid var(--border)", background: "rgba(0,0,0,0.15)" }}
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
