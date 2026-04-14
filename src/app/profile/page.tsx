"use client";

import { useState, useEffect } from "react";
import { GearSix, SignOut, CodeBlock } from "@phosphor-icons/react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

interface CodeComponent {
  id: string;
  title: string;
  description: string;
  html_code: string;
  css_code: string;
  created_at: string;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"posts" | "saved" | "drafts">("posts");
  const [user, setUser] = useState<User | null>(null);
  const [components, setComponents] = useState<CodeComponent[]>([]);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();

  useEffect(() => {
    const loadProfileAndData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/";
        return;
      }
      setUser(user);

      const { data } = await supabase
        .from('components')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) setComponents(data);
      setLoading(false);
    };

    loadProfileAndData();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const getPreviewDoc = (html: string, css: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: transparent; overflow: hidden; }
          ${css}
        </style>
      </head>
      <body>${html}</body>
    </html>
  `;

  if (!user) return <div className="min-h-screen flex items-center justify-center text-white">Loading profile...</div>;

  const username = user.email?.split('@')[0] || "user";

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12 min-h-screen mt-16">
      
      <div className="flex flex-col md:flex-row gap-8 items-start mb-16 relative">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[var(--accent-1)]/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>

        <div className="flex flex-col gap-4 w-full md:w-auto items-center md:items-start">
          <div className="w-40 h-40 rounded-[32px] bg-white/5 border border-white/10 p-2 shadow-2xl backdrop-blur-xl">
            <img src={user.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/micah/svg?seed=Felix&backgroundColor=000000"} alt="Profile" className="w-full h-full rounded-[24px] object-cover bg-black/50" />
          </div>
          
          <div className="flex w-full gap-2 mt-2">
            <Link href="/settings" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-colors">
              <GearSix size={18} /> Settings
            </Link>
            <button onClick={handleLogout} className="flex items-center justify-center p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-colors" title="Logout">
              <SignOut size={18} />
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-center pt-2 text-center md:text-left w-full">
          <h1 className="text-4xl font-bold text-white mb-1">{user.user_metadata?.full_name || "User"}</h1>
          <p className="text-[var(--text-muted)] text-lg mb-6">@{username}</p>

          <div className="flex items-center justify-center md:justify-start gap-8">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-2xl font-bold text-white">{components.length}</span>
              <span className="text-sm text-[var(--text-muted)]">Posts</span>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="text-2xl font-bold text-white">0</span>
              <span className="text-sm text-[var(--text-muted)]">Saved</span>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="text-2xl font-bold text-white">0</span>
              <span className="text-sm text-[var(--text-muted)]">Followers</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex gap-6 border-b border-white/10 pb-px overflow-x-auto hide-scrollbar">
          {(["posts", "saved", "drafts"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-white' : 'text-white/40 hover:text-white/80'}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-t-full shadow-[0_-2px_10px_rgba(255,255,255,0.5)]"></div>}
            </button>
          ))}
        </div>
        
        <div className="pt-8">
          {loading ? (
            <div className="text-center text-white/50 py-10">Fetching your components...</div>
          ) : activeTab === "posts" && components.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {components.map((comp) => (
                <div key={comp.id} className="group relative bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-xl hover:border-white/20 transition-all duration-300 flex flex-col">
                  
                  {/* INTERACTIVE Live Preview (No dark overlay!) */}
                  <div className="w-full h-56 bg-[var(--bg-base)] relative overflow-hidden flex items-center justify-center border-b border-white/10">
                    <iframe 
                      srcDoc={getPreviewDoc(comp.html_code, comp.css_code)} 
                      className="w-full h-full border-none"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  </div>

                  {/* Component Info & View Code Button */}
                  <div className="p-5 flex justify-between items-end flex-1">
                    <div className="overflow-hidden pr-4">
                      <h3 className="text-lg font-bold text-white truncate">{comp.title}</h3>
                      <p className="text-sm text-white/50 mt-1 truncate">
                        {comp.description.replace('Category: ', '').replace(' | Tags: ', ' • ')}
                      </p>
                      <div className="mt-4 text-xs text-white/30 font-mono">
                        {new Date(comp.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <Link 
                      href={`/component/${comp.id}`} 
                      className="shrink-0 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <CodeBlock size={16} /> Code
                    </Link>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-white/50 py-10">
              No {activeTab} found yet.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}