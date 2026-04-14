"use client";

import { useState } from "react";
import { X, EnvelopeSimple, LockKey, User, CheckCircle, GoogleLogo } from "@phosphor-icons/react";
import { createClient } from "@/utils/supabase/client";

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [view, setView] = useState<"login" | "signup" | "forgot">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const supabase = createClient();

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin, // Redirects back to where they are
      },
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (view === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else { window.location.reload(); onClose(); }
    } else if (view === "signup") {
      const { error } = await supabase.auth.signUp({ 
        email, password, options: { data: { full_name: fullName, avatar_url: "https://api.dicebear.com/7.x/micah/svg?seed=Felix&backgroundColor=000000" } }
      });
      if (error) setError(error.message);
      else setSuccessMessage("We sent a secure confirmation link to your email. Click it to activate your account.");
    } else if (view === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/settings` });
      if (error) setError(error.message);
      else setSuccessMessage("We sent a password reset link to your email.");
    }
    setLoading(false);
  };

  const getHeaderText = () => {
    if (successMessage) return "Check Your Email";
    if (view === "login") return "Welcome Back";
    if (view === "signup") return "Join CodeNest";
    if (view === "forgot") return "Reset Password";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[var(--accent-1)] rounded-full mix-blend-screen filter blur-[80px] opacity-50 pointer-events-none"></div>
        
        <div className="p-8 relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">{getHeaderText()}</h2>
            <button onClick={onClose} className="text-white/50 hover:text-white transition-colors"><X size={24} /></button>
          </div>

          {error && <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm">{error}</div>}

          {successMessage ? (
             <div className="flex flex-col items-center justify-center py-6 text-center animate-[fade-in_0.5s_ease]">
               <CheckCircle size={64} weight="fill" className="text-[var(--success)] mb-4" />
               <p className="text-white/80 mb-8">{successMessage}</p>
             </div>
          ) : (
            <>
              {/* GOOGLE LOGIN BUTTON */}
              {view !== "forgot" && (
                <>
                  <button 
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-200 text-black font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50"
                  >
                    <GoogleLogo weight="bold" size={20} />
                    Continue with Google
                  </button>

                  <div className="flex items-center gap-4 my-6">
                    <div className="h-px bg-white/10 flex-1"></div>
                    <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Or continue with email</span>
                    <div className="h-px bg-white/10 flex-1"></div>
                  </div>
                </>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {view === "signup" && (
                  <div className="relative">
                    <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                    <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[var(--accent-1)] transition-colors" />
                  </div>
                )}
                <div className="relative">
                  <EnvelopeSimple size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                  <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[var(--accent-1)] transition-colors" />
                </div>
                {view !== "forgot" && (
                  <div className="relative">
                    <LockKey size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[var(--accent-1)] transition-colors" />
                  </div>
                )}
                {view === "login" && (
                  <div className="flex justify-end -mt-2"><button type="button" onClick={() => { setView("forgot"); setError(null); }} className="text-xs text-[var(--accent-1)] hover:underline">Forgot password?</button></div>
                )}
                <button type="submit" disabled={loading} className="w-full mt-2 bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">
                  {loading ? "Processing..." : (view === "login" ? "Sign In" : view === "signup" ? "Create Account" : "Send Reset Link")}
                </button>
              </form>
              <div className="mt-6 text-center text-sm text-[var(--text-muted)]">
                {view === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                <button type="button" onClick={() => { setView(view === "login" ? "signup" : "login"); setError(null); }} className="text-[var(--accent-1)] font-bold hover:underline">
                  {view === "login" ? "Sign Up" : "Sign In"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}