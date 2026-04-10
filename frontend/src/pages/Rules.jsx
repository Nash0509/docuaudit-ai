import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import useStore from "../utils/Store";
import RuleCard from "../components/rules/RuleCard";
import RuleModal from "../components/rules/RuleModal";
import { getRules, deleteRule } from "../services/api";
import { Plus, SearchX } from "lucide-react";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import { useToast } from "../components/ui/ToastContext";
import useMediaQuery from "../utils/useMediaQuery";

export default function Rules() {
  const setTopBar = useStore(state => state.setTopBar);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const toast = useToast();

  const fetchRules = async () => {
    try {
      setLoading(true);
      const data = await getRules();
      setRules(data);
    } catch (error) {
      console.error("Failed to fetch rules:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    setTopBar("rules");
    fetchRules(); 
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this rule?")) return;
    try {
      await deleteRule(id);
      toast.success("Rule Deleted", "The custom rule has been removed.");
      fetchRules();
    } catch (error) {
      toast.error("Failed to delete", error.response?.data?.detail || "An error occurred.");
    }
  };

  const openModal = (rule = null) => {
    setEditingRule(rule);
    setIsModalOpen(true);
  };

  const systemRules = rules.filter(r => r.is_template && !r.industry);
  const industryRules = rules.filter(r => r.is_template && r.industry);
  const myRules = rules.filter(r => !r.is_template);

  const renderSection = (title, data, isSystem) => (
    <div style={{ marginBottom: "40px" }}>
      <h2 style={{ fontSize: "16px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
        {title}
        <span style={{ background: "var(--bg-surface-hover)", border: "1px solid var(--border)", fontSize: "12px", padding: "2px 8px", borderRadius: "12px", color: "var(--text-muted)" }}>
          {data.length}
        </span>
      </h2>
      
      {data.length === 0 ? (
        <EmptyState 
           icon={<SearchX size={20} />}
           title="No rules here"
           description={`There are no rules in the "${title}" section.`}
        />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
          {data.map(rule => (
            <RuleCard key={rule.id} rule={rule} isSystem={isSystem} onEdit={openModal} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Layout>
      <div style={{ 
        display: "flex", 
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between", 
        alignItems: isMobile ? "flex-start" : "center", 
        marginBottom: "32px", 
        background: "var(--bg-surface)", 
        padding: "24px 28px", 
        borderRadius: "var(--radius-lg)", 
        border: "1px solid var(--border)",
        gap: isMobile ? "20px" : "0"
      }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "4px", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Compliance Rules</h1>
          <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "14px" }}>
            Legal criteria for audits.
          </p>
        </div>
        <Button variant="primary" onClick={() => openModal()} icon={<Plus size={16} />} style={{ width: isMobile ? "100%" : "auto" }}>
          Create Rule
        </Button>
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} height="180px" />
          ))}
        </div>
      ) : (
        <>
          {renderSection("My Custom Rules", myRules, false)}
          {renderSection("Industry Templates", industryRules, true)}
          {renderSection("System Defaults", systemRules, true)}
        </>
      )}

      <RuleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={() => { toast.success("Saved", "Rule updated successfully."); fetchRules(); }} initialData={editingRule} />
    </Layout>
  );
}
