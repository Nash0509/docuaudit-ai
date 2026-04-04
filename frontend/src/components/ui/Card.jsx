import { motion } from "framer-motion";

export default function Card({ children, style = {}, hover = true, accent = false, onClick, className = "" }) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, scale: 1.005 } : {}}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={onClick}
      className={className}
      style={{
        background: "var(--bg-surface)",
        border: `1px solid ${accent ? "var(--border-accent)" : "var(--border)"}`,
        borderRadius: "var(--radius-lg)",
        padding: "20px 24px",
        cursor: onClick ? "pointer" : "default",
        boxShadow: accent ? "var(--shadow-glow)" : "var(--shadow-sm)",
        transition: "border-color 0.2s ease",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}