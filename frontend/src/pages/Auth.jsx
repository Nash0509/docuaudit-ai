import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../utils/Store";
import { loginUser, registerUser, loginGuest } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Mail, Lock, ArrowRight, User, Loader2 } from "lucide-react";

function InputField({ label, type, value, onChange, placeholder, icon: Icon }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <div className="relative">
        <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full pl-10 pr-4 h-11 rounded-lg border text-sm text-slate-900 bg-white outline-none transition-all placeholder:text-slate-400
            ${focused ? "border-indigo-400 ring-3 ring-indigo-50" : "border-slate-300 hover:border-slate-400"}
          `}
          style={{ fontFamily: "inherit" }}
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
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Branding Panel — hidden on small screens */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-indigo-600 p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
            <ShieldCheck size={18} color="white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg tracking-tight">DocuAudit AI</span>
        </div>

        <div>
          <h1 className="text-4xl font-black leading-tight mb-5">
            AI-powered compliance<br />for legal documents
          </h1>
          <p className="text-indigo-200 text-base leading-relaxed mb-8">
            DocuAudit AI helps legal, compliance, and audit teams analyze contracts at scale with precision AI analysis.
          </p>
          <div className="space-y-3">
            {[
              "Automated risk detection in seconds",
              "Clause-level compliance checking",
              "Export audit reports as PDF",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3 text-sm text-indigo-100">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-xs">✓</div>
                {f}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-indigo-300">
          Enterprise-grade security · SOC 2 compliant · Data encrypted at rest
        </p>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <ShieldCheck size={18} color="white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg text-slate-900">DocuAudit AI</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1">
            {isLogin ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-sm text-slate-500 mb-7">
            {isLogin ? "Sign in to your compliance workspace." : "Start auditing documents in minutes."}
          </p>

          {/* Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: "20px" }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className={`text-sm px-4 py-3 rounded-lg border ${isSuccess
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full h-11 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors mt-2"
              style={{ fontFamily: "inherit" }}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : (
                <>{isLogin ? "Sign In" : "Create Account"} <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 uppercase tracking-wide">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <button
            onClick={handleGuestLogin}
            disabled={guestLoading}
            className="w-full h-11 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-60 text-slate-700 font-medium text-sm flex items-center justify-center gap-2 transition-colors"
            style={{ fontFamily: "inherit" }}
          >
            {guestLoading ? <Loader2 size={15} className="animate-spin text-slate-400" /> : <User size={15} className="text-slate-400" />}
            Continue as Guest
          </button>

          <p className="text-center text-sm text-slate-500 mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="text-indigo-600 font-semibold hover:text-indigo-700"
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
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
