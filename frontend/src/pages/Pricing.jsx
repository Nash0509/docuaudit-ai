import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Sparkles } from "lucide-react";
import Layout from "../components/layout/Layout";
import useStore from "../utils/Store";
import { createCheckoutSession, getCurrentUser, mockSuccessCheckout } from "../services/api";

export default function Pricing() {
  const setTopBar = useStore(s => s.setTopBar);
  const user = useStore(s => s.user);
  const setUser = useStore(s => s.setUser);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTopBar("pricing", "Choose a plan to continue auditing your documents.");
  }, []);

  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);
    try {
      // Bypassing Stripe: Call mock success endpoint directly
      await mockSuccessCheckout();
      
      // Refresh local user state from server
      const updatedUser = await getCurrentUser();
      setUser(updatedUser);
      
      // Provide immediate feedback
      setLoading(false);
      alert("Success! You've been upgraded to Pro. Enjoy unlimited audits.");
      navigate("/documents"); 
    } catch (e) {
      setError(e.response?.data?.detail || "Failed to activate Pro subscription.");
      setLoading(false);
    }
  };

  const isSubscribed = user?.is_subscribed;

  return (
    <Layout>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 0" }}>
        
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "6px 12px", borderRadius: "20px",
              background: "var(--accent-light)",
              color: "var(--accent)", fontSize: "12px", fontWeight: "700",
              textTransform: "uppercase", letterSpacing: "0.05em",
              marginBottom: "16px"
            }}>
              <Sparkles size={14} /> Upgrade to Pro
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{ fontSize: "42px", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "-0.04em", margin: "0 0 16px 0" }}
          >
            Unlock Unlimited Audits
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{ fontSize: "16px", color: "var(--text-secondary)", maxWidth: "500px", margin: "0 auto" }}
          >
            Your first audit is on us. Subscribe today to continue protecting your business from compliance risks.
          </motion.p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", maxWidth: "800px", margin: "0 auto" }}>
          
          {/* FREE PLAN */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              padding: "40px 32px",
              borderRadius: "24px",
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              display: "flex", flexDirection: "column"
            }}
          >
            <div style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px" }}>Free Tier</div>
            <div style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "32px", minHeight: "42px" }}>Perfect for evaluating the platform.</div>
            
            <div style={{ fontSize: "36px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "32px" }}>
              ₹0 <span style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: "500" }}>/ forever</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
              {["1 Document Audit included", "Basic rule checks", "Standard reporting"].map((feat, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-secondary)", fontSize: "14px" }}>
                  <Check size={16} color="var(--success)" /> {feat}
                </div>
              ))}
            </div>
            
            <button
              disabled
              style={{
                marginTop: "32px",
                padding: "16px",
                borderRadius: "12px",
                background: "var(--bg-surface-hover)",
                color: "var(--text-muted)",
                border: "1px solid var(--border)",
                fontSize: "14px",
                fontWeight: "600",
                width: "100%",
                cursor: "not-allowed"
              }}
            >
              Current Plan
            </button>
          </motion.div>

          {/* PRO PLAN */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              padding: "40px 32px",
              borderRadius: "24px",
              background: "linear-gradient(180deg, var(--accent-light) 0%, var(--bg-surface) 100%)",
              border: "1px solid var(--accent)",
              display: "flex", flexDirection: "column",
              position: "relative", overflow: "hidden"
            }}
          >
            <div style={{ position: "absolute", top: 0, insetInline: 0, height: "1px", background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }} />
            
            <div style={{ fontSize: "20px", fontWeight: "700", color: "var(--accent)", marginBottom: "8px" }}>Pro Subscription</div>
            <div style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "32px", minHeight: "42px" }}>Everything you need for full compliance automation.</div>
            
            <div style={{ fontSize: "36px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "32px" }}>
              ₹99 <span style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: "500" }}>/ month</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
              {["Unlimited Document Audits", "Advanced AI Rule Checks", "Priority Activity Feed", "Exportable Dashboards", "24/7 Email Support"].map((feat, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-primary)", fontSize: "14px" }}>
                  <Zap size={16} color="var(--accent)" /> {feat}
                </div>
              ))}
            </div>

            <button
              onClick={handleUpgrade}
              disabled={loading || isSubscribed}
              style={{
                marginTop: "32px",
                padding: "16px",
                borderRadius: "12px",
                background: isSubscribed ? "var(--success)" : "var(--accent)",
                color: "#fff",
                border: "none",
                fontSize: "14px",
                fontWeight: "700",
                width: "100%",
                cursor: (loading || isSubscribed) ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                transition: "opacity 0.2s"
              }}
            >
              {loading ? "Processing..." : isSubscribed ? "Already Subscribed" : "Upgrade to Pro"}
            </button>
            {error && <div style={{ color: "var(--danger)", fontSize: "12px", marginTop: "12px", textAlign: "center" }}>{error}</div>}
          </motion.div>

        </div>

        {/* Terms and Conditions */}
        <div style={{ maxWidth: "800px", margin: "48px auto 0", textAlign: "center" }}>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "8px" }}>Terms & Conditions</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.6 }}>
            The Free Tier includes exactly <span style={{ color: "var(--text-primary)" }}>1 Document Audit</span> for evaluation purposes. 
            Once your free tier is exhausted, you will no longer be able to upload documents or run audits until you subscribe to the Pro Subscription. 
            The Pro Subscription costs <span style={{ color: "var(--accent)" }}>99 INR per month</span> and is billed recursively. You can cancel at any time.
          </div>
        </div>

      </div>
    </Layout>
  );
}
