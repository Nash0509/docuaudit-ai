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
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-3 w-full rounded" />
      <div className="skeleton h-3 w-5/6 rounded" />
      <div className="skeleton h-3 w-2/3 rounded mt-2" />
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
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
        <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-500">{data.length}</span>
      </div>
      {data.length === 0 ? (
        <div className="text-sm text-slate-400 text-center py-8 bg-white border border-dashed border-slate-200 rounded-xl">
          No rules in this section yet.
        </div>
      ) : (
        <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2 xl:grid-cols-3"}`}>
          {data.map((rule) => (
            <RuleCard key={rule.id} rule={rule} isSystem={!!rule.is_template} onEdit={openModal} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </section>
  );

  return (
    <Layout>
      {/* Page Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck size={18} className="text-indigo-500" />
            <h1 className="text-lg font-bold text-slate-900">Compliance Rules</h1>
          </div>
          <p className="text-sm text-slate-500">Legal criteria and logic used for document evaluation.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
          style={{ fontFamily: "inherit" }}
        >
          <Plus size={15} /> Create Rule
        </button>
      </div>

      {loading ? (
        <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2 xl:grid-cols-3"}`}>
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
    </Layout>
  );
}
