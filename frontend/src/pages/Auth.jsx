import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../utils/Store";
import { loginUser, registerUser, loginGuest } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Mail, Lock, ArrowRight, User, Loader2 } from "lucide-react";
import useMediaQuery from "../utils/useMediaQuery";

function InputField({ label, type, value, onChange, placeholder, icon: Icon }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "var(--text-primary)", marginBottom: 6 }}>{label}</label>
      <div style={{ position: "relative" }}>
        <Icon size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", height: 44, paddingLeft: 40, paddingRight: 16, borderRadius: 8,
            border: `1px solid ${focused ? "var(--accent)" : "var(--border)"}`,
            fontSize: 14, color: "var(--text-primary)", background: "var(--bg-surface)", outline: "none",
            boxShadow: focused ? "0 0 0 3px var(--accent-light)" : "none", transition: "all 0.2s",
            fontFamily: "inherit", boxSizing: "border-box"
          }}
        />
      </div>
    </div>
  );
}

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  const navigate = useNavigate();
  const setToken = useStore((state) => state.setToken);
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        const res = await loginUser(email, password);
        setToken(res.access_token);
        navigate("/");
      } else {
        await registerUser(email, password);
        setIsLogin(true);
        setError("Account created! Please sign in.");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Authentication failed. Please try again.");
    } finally { setLoading(false); }
  };

  const handleGuestLogin = async () => {
    setError("");
    setGuestLoading(true);
    try {
      const res = await loginGuest();
      setToken(res.access_token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Guest login failed. Please try again.");
    } finally { setGuestLoading(false); }
  };

  const isSuccess = error && error.includes("created");

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--bg-base)" }}>
      {/* Left Branding Panel — hidden on small screens */}
      {!isMobile && (
        <div style={{ width: "45%", background: "linear-gradient(135deg, var(--accent) 0%, #3730A3 100%)", padding: 48, color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShieldCheck size={18} color="white" strokeWidth={2.5} />
            </div>
            <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em" }}>DocuAudit AI</span>
          </div>

          <div>
            <h1 style={{ fontSize: 36, fontWeight: 900, lineHeight: 1.2, margin: "0 0 20px 0" }}>
              AI-powered compliance<br />for legal documents
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", lineHeight: 1.6, margin: "0 0 32px 0", maxWidth: 400 }}>
              DocuAudit AI helps legal, compliance, and audit teams analyze contracts at scale with precision AI analysis.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                "Automated risk detection in seconds",
                "Clause-level compliance checking",
                "Export audit reports as PDF",
              ].map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: "rgba(255,255,255,0.9)" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12 }}>✓</div>
                  {f}
                </div>
              ))}
            </div>
          </div>

          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", margin: 0 }}>
            Enterprise-grade security · SOC 2 compliant · Data encrypted at rest
          </p>
        </div>
      )}

      {/* Right Form Panel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ width: "100%", maxWidth: 384 }}
        >
          {/* Mobile Logo */}
          {isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32, justifyContent: "center" }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px var(--accent-light)" }}>
                <ShieldCheck size={18} color="white" strokeWidth={2.5} />
              </div>
              <span style={{ fontWeight: 700, fontSize: 18, color: "var(--text-primary)" }}>DocuAudit AI</span>
            </div>
          )}

          <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 4px 0" }}>
            {isLogin ? "Welcome back" : "Create your account"}
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "0 0 28px 0" }}>
            {isLogin ? "Sign in to your compliance workspace." : "Start auditing documents in minutes."}
          </p>

          {/* Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                style={{ overflow: "hidden" }}
              >
                <div style={{
                  fontSize: 14, padding: "12px 16px", borderRadius: 8,
                  background: isSuccess ? "var(--success-light)" : "var(--danger-light)",
                  color: isSuccess ? "var(--success)" : "var(--danger)",
                  border: `1px solid ${isSuccess ? "var(--success-border)" : "var(--danger-border)"}`
                }}>
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit}>
            <InputField
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              icon={Mail}
            />
            <InputField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={Lock}
            />

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: "100%", height: 44, marginTop: 8, padding: 0 }}
            >
              {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : (
                <>{isLogin ? "Sign In" : "Create Account"} <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          <button
            onClick={handleGuestLogin}
            disabled={guestLoading}
            className="btn"
            style={{ width: "100%", height: 44, background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-secondary)", padding: 0 }}
          >
            {guestLoading ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite", color: "var(--text-muted)" }} /> : <User size={15} color="var(--text-muted)" />}
            Continue as Guest
          </button>

          <p style={{ textAlign: "center", fontSize: 14, color: "var(--text-muted)", marginTop: 24 }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              style={{ color: "var(--accent)", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Auth;
