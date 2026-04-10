import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../utils/Store";
import { loginUser, registerUser, loginGuest } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Mail, Lock, ArrowRight, User } from "lucide-react";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  
  const isMobile = useMediaQuery("(max-width: 768px)");
  const setToken = useStore((state) => state.setToken);
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
        setError("Registration successful! Please sign in.");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
    } finally {
      setGuestLoading(false);
    }
  };

  const isSuccess = error && error.includes("successful");

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg-base)",
      position: "relative",
      padding: "20px",
    }}>
      {/* Ambient background glows */}
      <div style={{ position: "absolute", top: "20%", left: "15%", width: "500px", height: "500px", borderRadius: "50%", background: "rgba(0, 212, 170, 0.04)", filter: "blur(100px)", pointerEvents: "none" }} />
      
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <div style={{
          background: "rgba(15, 23, 42, 0.9)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          border: "1px solid var(--border)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{ padding: isMobile ? "28px 24px" : "36px 36px 28px", borderBottom: "1px solid var(--border)", textAlign: "center", background: "rgba(255,255,255,0.01)" }}>
            <div style={{
              width: isMobile ? "48px" : "56px", 
              height: isMobile ? "48px" : "56px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #00d4aa22, #2563eb22)",
              border: "1px solid var(--border-accent)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <ShieldCheck size={isMobile ? 22 : 26} color="var(--accent)" />
            </div>
            <h1 style={{ fontSize: isMobile ? "20px" : "24px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "4px" }}>
              DocuAudit <span style={{ color: "var(--accent)" }}>AI</span>
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: 0 }}>
              {isLogin ? "Sign in to your workspace" : "Create a new account"}
            </p>
          </div>


          {/* Form */}
          <div style={{ padding: "28px 36px 32px" }}>
            {/* Error/Success Banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: "20px" }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  style={{
                    background: isSuccess ? "var(--success-dim)" : "var(--danger-dim)",
                    color: isSuccess ? "var(--success)" : "var(--danger)",
                    border: `1px solid ${isSuccess ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                    padding: "12px 16px",
                    borderRadius: "var(--radius-md)",
                    fontSize: "13px",
                    lineHeight: "1.4",
                  }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Email */}
              <div>
                <label style={{ display: "block", color: "var(--text-secondary)", marginBottom: "8px", fontSize: "13px", fontWeight: "500" }}>
                  Email address
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={16} color="var(--text-muted)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    style={{
                      width: "100%",
                      padding: "0 14px 0 42px",
                      height: "44px",
                      borderRadius: "var(--radius-md)",
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border)",
                      color: "var(--text-primary)",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "var(--border-accent)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--border)"; }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ display: "block", color: "var(--text-secondary)", marginBottom: "8px", fontSize: "13px", fontWeight: "500" }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <Lock size={16} color="var(--text-muted)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{
                      width: "100%",
                      padding: "0 14px 0 42px",
                      height: "44px",
                      borderRadius: "var(--radius-md)",
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border)",
                      color: "var(--text-primary)",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "var(--border-accent)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--border)"; }}
                  />
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={!loading ? { scale: 0.99 } : {}}
                style={{
                  width: "100%",
                  height: "44px",
                  borderRadius: "var(--radius-md)",
                  background: "linear-gradient(135deg, #00d4aa, #2563eb)",
                  color: "#020617",
                  fontWeight: "700",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.75 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 4px 14px rgba(0,212,170,0.25)",
                  transition: "opacity 0.2s",
                  marginTop: "4px",
                }}
              >
                {loading ? (
                  <span style={{ width: "16px", height: "16px", border: "2px solid rgba(0,0,0,0.4)", borderTopColor: "rgba(0,0,0,0.9)", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"} <ArrowRight size={16} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider with "or" */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
              <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
              <span style={{ color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>or</span>
              <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
            </div>

            {/* Guest Login Button */}
            <motion.button
              onClick={handleGuestLogin}
              disabled={guestLoading}
              whileHover={{ borderColor: "rgba(0, 212, 170, 0.4)", background: "rgba(0, 212, 170, 0.05)" }}
              whileTap={!guestLoading ? { scale: 0.99 } : {}}
              style={{
                width: "100%",
                height: "44px",
                borderRadius: "var(--radius-md)",
                background: "transparent",
                color: "var(--text-secondary)",
                fontWeight: "600",
                fontSize: "14px",
                fontFamily: "inherit",
                border: "1px solid var(--border)",
                cursor: guestLoading ? "not-allowed" : "pointer",
                opacity: guestLoading ? 0.75 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.2s ease",
              }}
            >
              {guestLoading ? (
                <span style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "rgba(255,255,255,0.7)", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
              ) : (
                <>
                  <User size={16} /> Continue as Guest
                </>
              )}
            </motion.button>

            {/* Toggle */}
            <div style={{ textAlign: "center", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border)" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </span>
              {" "}
              <button
                onClick={() => { setIsLogin(!isLogin); setError(""); }}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--accent)",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  fontFamily: "inherit",
                  padding: 0,
                }}
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Sub-text */}
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "12px", marginTop: "20px" }}>
          AI-Powered Contract Compliance · Secure & Private
        </p>
      </motion.div>
    </div>
  );
}
