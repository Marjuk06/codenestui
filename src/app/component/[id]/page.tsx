"use client";

import { useEffect, useState, use } from "react";
import { createClient } from "@/utils/supabase/client";
import { Heart, ChatCircle, BookmarkSimple, ShareNetwork, Copy, Check, X, PaperPlaneRight } from "@phosphor-icons/react";

interface CodeComponent {
  id: string;
  title: string;
  description: string;
  html_code: string;
  css_code: string;
  js_code: string;
  created_at: string;
  user_id: string;
}

interface Comment {
  id: string;
  content: string;
  author_name: string;
  author_avatar: string;
  created_at: string;
}

export default function ComponentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); 
  
  const [component, setComponent] = useState<CodeComponent | null>(null);
  const [activeTab, setActiveTab] = useState<"html" | "css" | "js">("html");
  const [copied, setCopied] = useState(false);
  
  // Like System
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [particles, setParticles] = useState<number[]>([]);
  
  // Comment System
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch Component
      const { data: compData } = await supabase.from("components").select("*").eq("id", id).single();
      if (compData) setComponent(compData);

      // 2. Fetch Likes
      const { count } = await supabase.from("likes").select("*", { count: 'exact', head: true }).eq("component_id", id);
      setLikesCount(count || 0);

      // 3. Fetch Comments
      const { data: commentsData } = await supabase.from("comments").select("*").eq("component_id", id).order("created_at", { ascending: false });
      if (commentsData) setComments(commentsData);

      // 4. Check if Liked
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: likeData } = await supabase.from("likes").select("id").eq("component_id", id).eq("user_id", user.id).single();
        if (likeData) setIsLiked(true);
      }
    };
    fetchData();
  }, [id, supabase]);

  const handleLikeToggle = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Please sign in to like components!");

    if (isLiked) {
      setIsLiked(false);
      setLikesCount(prev => prev - 1);
      await supabase.from("likes").delete().match({ user_id: user.id, component_id: id });
    } else {
      setIsLiked(true);
      setLikesCount(prev => prev + 1);
      setParticles([0, 1, 2, 3, 4, 5]);
      setTimeout(() => setParticles([]), 800);
      await supabase.from("likes").insert({ user_id: user.id, component_id: id });
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Please sign in to comment!");

    setIsSubmitting(true);

    const commentData = {
      component_id: id,
      user_id: user.id,
      content: newComment,
      author_name: user.user_metadata?.full_name || "User",
      author_avatar: user.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/micah/svg?seed=Felix&backgroundColor=000000"
    };

    const { data, error } = await supabase.from("comments").insert([commentData]).select().single();

    if (!error && data) {
      setComments([data, ...comments]); // Optimistically add to top of list
      setNewComment("");
    }
    setIsSubmitting(false);
  };

  const handleCopy = () => {
    if (!component) return;
    const textToCopy = activeTab === "html" ? component.html_code : activeTab === "css" ? component.css_code : component.js_code;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPreviewDoc = () => {
    if (!component) return "";
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: transparent; overflow: hidden; }
            ${component.css_code}
          </style>
        </head>
        <body>${component.html_code}<script>${component.js_code}<\/script></body>
      </html>
    `;
  };

  if (!component) return <div className="min-h-screen flex items-center justify-center text-white">Loading component...</div>;

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-24 min-h-screen relative overflow-hidden">
      
      {/* Particle Animation CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes heart-burst {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
          100% { transform: translate(calc(-50% + cos(var(--angle)) * 35px), calc(-50% + sin(var(--angle)) * 35px)) scale(0); opacity: 0; }
        }
        .particle {
          position: absolute; top: 50%; left: 1.25rem; width: 6px; height: 6px;
          background-color: #ef4444; border-radius: 50%; pointer-events: none;
          animation: heart-burst 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .drawer-slide {
          animation: slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slide-in {
          0% { opacity: 0; transform: translateX(20px) scale(0.95); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
      `}} />

      {/* Ambient Glows */}
      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-[var(--accent-1)]/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[var(--accent-2)]/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
        
        {/* Left Column: Preview & Actions */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{component.title}</h1>
            <p className="text-[var(--text-muted)] text-lg">{component.description.replace('Category: ', '').replace(' | Tags: ', ' • ')}</p>
          </div>

          <div className="w-full h-[450px] bg-[var(--bg-base)] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative flex items-center justify-center">
            <iframe srcDoc={getPreviewDoc()} className="w-full h-full border-none" sandbox="allow-scripts allow-same-origin" />
          </div>

          <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-lg">
            <div className="flex gap-2">
              <button onClick={handleLikeToggle} className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all duration-200 active:scale-[0.85] select-none">
                <Heart size={20} weight={isLiked ? "fill" : "regular"} className={`transition-colors duration-300 ${isLiked ? "text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" : ""}`} />
                <span className="font-medium min-w-[1ch]">{likesCount}</span>
                {particles.map((i) => <div key={i} className="particle" style={{ "--angle": `${i * 60}deg` } as React.CSSProperties} />)}
              </button>

              {/* COMMENTS TOGGLE BUTTON */}
              <button 
                onClick={() => setIsCommentsOpen(!isCommentsOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 active:scale-95 ${isCommentsOpen ? "bg-[var(--accent-1)] text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]" : "bg-white/5 hover:bg-white/10 text-white"}`}
              >
                <ChatCircle size={20} weight={isCommentsOpen ? "fill" : "regular"} /> 
                <span className="font-medium">{comments.length}</span>
              </button>
            </div>
            
            <div className="flex gap-2">
              <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors active:scale-95"><BookmarkSimple size={20} /></button>
              <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors active:scale-95"><ShareNetwork size={20} /></button>
            </div>
          </div>
        </div>

        {/* Right Column: Code Editor OR Comments Drawer */}
        <div className="flex flex-col h-full relative">
          
          {/* 1. CODE EDITOR (Background layer) */}
          <div className={`flex-1 flex flex-col bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl mt-[88px] transition-all duration-500 ${isCommentsOpen ? 'opacity-0 scale-95 pointer-events-none absolute w-full h-[calc(100%-88px)]' : 'opacity-100 scale-100'}`}>
            <div className="flex items-center justify-between border-b border-white/10 bg-black/40 pr-4">
              <div className="flex">
                <button onClick={() => setActiveTab('html')} className={`px-6 py-4 text-sm font-mono transition-colors border-b-2 ${activeTab === 'html' ? 'border-[var(--accent-1)] text-white bg-white/5' : 'border-transparent text-white/50 hover:text-white'}`}>HTML</button>
                <button onClick={() => setActiveTab('css')} className={`px-6 py-4 text-sm font-mono transition-colors border-b-2 ${activeTab === 'css' ? 'border-[var(--accent-1)] text-white bg-white/5' : 'border-transparent text-white/50 hover:text-white'}`}>CSS</button>
                <button onClick={() => setActiveTab('js')} className={`px-6 py-4 text-sm font-mono transition-colors border-b-2 ${activeTab === 'js' ? 'border-[var(--accent-1)] text-white bg-white/5' : 'border-transparent text-white/50 hover:text-white'}`}>JS</button>
              </div>
              <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors text-sm font-medium active:scale-95">
                {copied ? <><Check size={16} className="text-green-400" /> Copied!</> : <><Copy size={16} /> Copy</>}
              </button>
            </div>
            <div className="flex-1 relative p-6 overflow-y-auto bg-[#0d0d0f]/50">
              <pre className="font-mono text-sm text-[#a1a1aa] whitespace-pre-wrap">
                <code>
                  {activeTab === 'html' && component.html_code}
                  {activeTab === 'css' && component.css_code}
                  {activeTab === 'js' && component.js_code}
                </code>
              </pre>
            </div>
          </div>

          {/* 2. COMMENTS DRAWER (Foreground overlay) */}
          {isCommentsOpen && (
            <div className="drawer-slide absolute top-[88px] left-0 w-full h-[calc(100%-88px)] flex flex-col bg-[#0a0a0c]/90 backdrop-blur-3xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10">
              
              {/* Comments Header */}
              <div className="flex justify-between items-center p-6 border-b border-white/10 bg-black/20">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <ChatCircle size={24} className="text-[var(--accent-1)]" weight="fill"/> 
                  Comments ({comments.length})
                </h3>
                <button onClick={() => setIsCommentsOpen(false)} className="p-2 bg-white/5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors">
                  <X size={20}/>
                </button>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scroll-smooth">
                {comments.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-muted)] opacity-50">
                    <ChatCircle size={48} className="mb-4" weight="thin"/>
                    <p>No comments yet. Be the first!</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <img src={comment.author_avatar} alt="avatar" className="w-10 h-10 rounded-full border border-white/10 bg-black/50" />
                      <div className="flex-1 bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-sm text-white">{comment.author_name}</span>
                          <span className="text-xs text-white/40">{new Date(comment.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Comment Input */}
              <div className="p-4 border-t border-white/10 bg-black/40">
                <form onSubmit={handlePostComment} className="flex gap-2 relative">
                  <input 
                    type="text" 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..." 
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--accent-1)] transition-colors"
                  />
                  <button 
                    type="submit" 
                    disabled={isSubmitting || !newComment.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[var(--accent-1)] text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:bg-white/10 transition-all"
                  >
                    <PaperPlaneRight weight="fill" />
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}