"use client";

import { useState, useEffect } from "react";
import { EnvelopeSimple, LockKey, ShieldCheck, WarningCircle, UserCircle } from "@phosphor-icons/react";
import { createClient } from "@/utils/supabase/client";

const PREMIUM_AVATARS = [
  "https://api.dicebear.com/7.x/micah/svg?seed=Felix&backgroundColor=000000",
  "https://api.dicebear.com/7.x/micah/svg?seed=Aneka&backgroundColor=000000",
  "https://api.dicebear.com/7.x/micah/svg?seed=Jude&backgroundColor=000000",
  "https://api.dicebear.com/7.x/micah/svg?seed=Eden&backgroundColor=000000",
  "https://api.dicebear.com/7.x/micah/svg?seed=Nolan&backgroundColor=000000",
  "https://api.dicebear.com/7.x/micah/svg?seed=Avery&backgroundColor=000000",
  "https://api.dicebear.com/7.x/micah/svg?seed=Mason&backgroundColor=000000",
  "https://api.dicebear.com/7.x/micah/svg?seed=Sophia&backgroundColor=000000",
  "https://api.dicebear.com/7.x/micah/svg?seed=Liam&backgroundColor=000000",
  "https://api.dicebear.com/7.x/micah/svg?seed=Olivia&backgroundColor=000000"
];

export default function SettingsPage() {
  // User State
  const [userEmail, setUserEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  
  // Form States
  const [newEmail, setNewEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    // 1. Initial fetch on page load
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserEmail(user.email ?? "");
        setFullName(user.user_metadata?.full_name || "");
        setAvatarUrl(user.user_metadata?.avatar_url || PREMIUM_AVATARS[0]);
      } else {
        window.location.href = "/";
      }
    });

    // 2. Listen for background changes (like confirming an email)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserEmail(session.user.email ?? "");
        // We also update name and avatar just in case they changed from another tab
        setFullName(session.user.user_metadata?.full_name || "");
        setAvatarUrl(session.user.user_metadata?.avatar_url || PREMIUM_AVATARS[0]);
      }
    });

    // Cleanup listener on unmount
    return () => subscription.unsubscribe();
  }, [supabase]);

  // 1. Update Profile (Name & Avatar)
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.updateUser({ data: { full_name: fullName, avatar_url: avatarUrl } });
    if (error) setMessage({ type: "error", text: error.message });
    else setMessage({ type: "success", text: "Profile updated successfully!" });
    setLoading(false);
  };

  // 2. Update Email
  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) setMessage({ type: "error", text: error.message });
    else {
      setMessage({ type: "success", text: "Security link sent! Please check both your old and new email inboxes to confirm the change." });
      setNewEmail("");
    }
    setLoading(false);
  };

  // 3. Update Password (Strict Verification)
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Step A: Check if new passwords match
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match. Please try again." });
      setLoading(false);
      return;
    }

    // Step B: Verify the old password first by attempting a silent login
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: oldPassword,
    });

    if (verifyError) {
      setMessage({ type: "error", text: "Incorrect current password. Action denied." });
      setLoading(false);
      return;
    }

    // Step C: If old password is correct, update to the new one
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    
    if (updateError) {
      setMessage({ type: "error", text: updateError.message });
    } else {
      setMessage({ type: "success", text: "Your password has been securely updated." });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setLoading(false);
  };

  if (!userEmail) return <div className="min-h-screen flex items-center justify-center text-white">Loading secure data...</div>;

  return (
    <main className="max-w-[1000px] mx-auto px-6 py-24 min-h-screen">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">Account Settings</h1>
        <p className="text-[var(--text-muted)] text-lg">Manage your identity and security preferences.</p>
      </div>

      {/* Global Status Message */}
      {message && (
        <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 border backdrop-blur-md ${message.type === "success" ? "bg-[var(--success)]/10 border-[var(--success)]/30 text-[var(--success)]" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
          {message.type === "success" ? <ShieldCheck size={24} /> : <WarningCircle size={24} />}
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* --- 1. PROFILE & AVATAR SETTINGS --- */}
        <div className="md:col-span-2 relative bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden shadow-2xl">
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/10"><UserCircle size={24} className="text-white" /></div>
            <h2 className="text-xl font-bold text-white">Public Profile</h2>
          </div>

          <form onSubmit={handleUpdateProfile} className="flex flex-col gap-8 relative z-10">
            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-3">Choose Avatar</label>
              <div className="flex flex-wrap gap-4">
                {PREMIUM_AVATARS.map((img) => (
                  <img 
                    key={img} 
                    src={img} 
                    onClick={() => setAvatarUrl(img)}
                    className={`w-16 h-16 rounded-full cursor-pointer border-2 transition-all hover:scale-110 ${avatarUrl === img ? "border-[var(--accent-1)] shadow-[0_0_15px_rgba(139,92,246,0.5)]" : "border-transparent opacity-50 hover:opacity-100"}`}
                    alt="Avatar option"
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full max-w-md bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[var(--accent-1)] transition-colors" />
            </div>

            <button type="submit" disabled={loading} className="self-start px-6 py-2.5 bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] text-white font-bold rounded-xl transition-opacity hover:opacity-90 disabled:opacity-50 shadow-lg">
              Save Profile
            </button>
          </form>
        </div>

        {/* --- 2. EMAIL SETTINGS --- */}
        <div className="relative bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-1)]/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-white/5 rounded-xl border border-white/10"><EnvelopeSimple size={24} className="text-white" /></div>
              <h2 className="text-xl font-bold text-white">Email Address</h2>
            </div>
            <p className="text-sm text-[var(--text-muted)] mb-6">Current email: <span className="text-white font-medium">{userEmail}</span></p>

            <form onSubmit={handleUpdateEmail} className="flex flex-col gap-4">
              <input type="email" placeholder="Enter new email address" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--accent-1)] transition-colors" />
              <button type="submit" disabled={loading} className="self-start px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium rounded-xl transition-colors disabled:opacity-50">
                Update Email
              </button>
            </form>
          </div>
        </div>

        {/* --- 3. PASSWORD SETTINGS --- */}
        <div className="relative bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden shadow-2xl">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--accent-2)]/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-white/5 rounded-xl border border-white/10"><LockKey size={24} className="text-white" /></div>
              <h2 className="text-xl font-bold text-white">Security</h2>
            </div>

            <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
              <input type="password" placeholder="Current Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--accent-1)] transition-colors" />
              
              <div className="h-px w-full bg-white/10 my-1"></div>
              
              <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--accent-1)] transition-colors" />
              <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--accent-1)] transition-colors" />
              
              <button type="submit" disabled={loading} className="self-start mt-2 px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium rounded-xl transition-colors disabled:opacity-50">
                Update Password
              </button>
            </form>
          </div>
        </div>

      </div>
    </main>
  );
}