import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import useStore from "../utils/Store";
import RuleCard from "../components/rules/RuleCard";
import RuleModal from "../components/rules/RuleModal";
import { getRules, deleteRule } from "../services/api";
import { Plus, ShieldCheck } from "lucide-react";
import { useToast } from "../components/ui/ToastContext";
import useMediaQuery from "../utils/useMediaQuery";

function SkeletonCard() {
  return (
    <div className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
      <div className="skeleton" style={{ height: 16, width: "75%", borderRadius: 4 }} />
      <div className="skeleton" style={{ height: 12, width: "100%", borderRadius: 4 }} />
      <div className="skeleton" style={{ height: 12, width: "83%", borderRadius: 4 }} />
      <div className="skeleton" style={{ height: 12, width: "66%", borderRadius: 4, marginTop: 8 }} />
    </div>
  );
}

export default function Rules() {
  const setTopBar = useStore((state) => state.setTopBar);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const toast = useToast();

  const fetchRules = async () => {
    try {
      setLoading(true);
      setRules(await getRules());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { setTopBar("rules"); fetchRules(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this rule permanently?")) return;
    try {
      await deleteRule(id);
      toast.success("Rule Deleted", "The rule has been removed.");
      fetchRules();
    } catch (e) {
      toast.error("Delete Failed", e.response?.data?.detail || "Could not delete rule.");
    }
  };

  const openModal = (rule = null) => { setEditingRule(rule); setIsModalOpen(true); };

  const systemRules = rules.filter((r) => r.is_template && !r.industry);
  const industryRules = rules.filter((r) => r.is_template && r.industry);
  const myRules = rules.filter((r) => !r.is_template);

  const renderSection = (title, data) => (
    <section style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", margin: 0 }}>{title}</h2>
        <span style={{ padding: "2px 8px", borderRadius: 12, background: "var(--bg-surface-hover)", border: "1px solid var(--border)", fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>
          {data.length}
        </span>
      </div>
      {data.length === 0 ? (
        <div style={{ fontSize: 14, color: "var(--text-muted)", textAlign: "center", padding: "32px 0", background: "var(--bg-surface)", border: "1px dashed var(--border)", borderRadius: 12 }}>
          No rules in this section yet.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {data.map((rule) => (
            <RuleCard key={rule.id} rule={rule} isSystem={!!rule.is_template} onEdit={openModal} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </section>
  );

  return (
    <Layout>
      <div style={{ maxWidth: 1024, margin: "0 auto", paddingBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContents: "space-between", marginBottom: 32 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <ShieldCheck size={18} color="var(--info)" />
              <h1 className="page-title">Compliance Rules</h1>
            </div>
            <p className="page-sub">Legal criteria and logic used for document evaluation.</p>
          </div>
          <button onClick={() => openModal()} className="btn btn-primary" style={{ padding: "10px 16px" }}>
            <Plus size={15} /> Create Rule
          </button>
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <>
            {renderSection("My Custom Rules", myRules)}
            {renderSection("Industry Templates", industryRules)}
            {renderSection("System Defaults", systemRules)}
          </>
        )}

        <RuleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => { toast.success("Saved", "Rule saved successfully."); fetchRules(); }}
          initialData={editingRule}
        />
      </div>
    </Layout>
  );
}
