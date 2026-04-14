"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, BookmarkSimple, Copy, Eye, CheckCircle, PaperPlaneRight } from "@phosphor-icons/react";
import { createClient } from "@/utils/supabase/client";

interface CodeComponent {
  id: string;
  title: string;
  description: string;
  html_code: string;
  css_code: string;
  js_code: string;
  created_at: string;
  author_name: string;
  author_avatar: string;
}

interface Comment {
  id: string;
  content: string;
  author_name: string;
  author_avatar: string;
  created_at: string;
}

export default function ComponentDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  // Component & UI States
  const [component, setComponent] = useState<CodeComponent | null>(null);
  const [activeTab, setActiveTab] = useState<"html" | "css" | "js">("html");
  const [copied, setCopied] = useState(false);
  
  // Interaction States
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [particles, setParticles] = useState<number[]>([]);
  
  const [isSaved, setIsSaved] = useState(false);
  
  // Comments States
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const fetchAllData = async () => {
      // 1. Fetch Component Data
      const { data: compData } = await supabase.from("components").select("*").eq("id", id).single();
      if (compData) setComponent(compData);

      // 2. Fetch Total Likes & Comments
      const { count: likeCount } = await supabase.from("likes").select("*", { count: 'exact', head: true }).eq("component_id", id);
      setLikesCount(likeCount || 0);

      const { data: commentsData } = await supabase.from("comments").select("*").eq("component_id", id).order("created_at", { ascending: false });
      if (commentsData) setComments(commentsData);

      // 3. Check User's Personal Status (Liked & Saved)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: likeData } = await supabase.from("likes").select("id").eq("component_id", id).eq("user_id", user.id).single();
        if (likeData) setIsLiked(true);

        const { data: saveData } = await supabase.from("saved_components").select("id").eq("component_id", id).eq("user_id", user.id).single();
        if (saveData) setIsSaved(true);
      }
    };
    fetchAllData();
  }, [id, supabase]);

  // --- HANDLERS ---

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
      setParticles([0, 1, 2, 3, 4, 5]); // Trigger particle burst
      setTimeout(() => setParticles([]), 800);
      await supabase.from("likes").insert({ user_id: user.id, component_id: id });
    }
  };

  const handleSaveToggle = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Please sign in to save components!");

    if (isSaved) {
      setIsSaved(false);
      await supabase.from("saved_components").delete().match({ user_id: user.id, component_id: id });
    } else {
      setIsSaved(true);
      await supabase.from("saved_components").insert({ user_id: user.id, component_id: id });
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Please sign in to comment!");

    setIsSubmittingComment(true);
    const commentData = {
      component_id: id,
      user_id: user.id,
      content: newComment,
      author_name: user.user_metadata?.full_name || user.email?.split('@')[0] || "User",
      author_avatar: user.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/micah/svg?seed=Felix&backgroundColor=000000"
    };

    const { data, error } = await supabase.from("comments").insert([commentData]).select().single();
    if (!error && data) {
      setComments([data, ...comments]); // Optimistically add to top
      setNewComment("");
    }
    setIsSubmittingComment(false);
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

  // Parse tags safely from the description string we saved earlier
  const descriptionParts = component.description.split(' | Tags: ');
  const category = descriptionParts[0].replace('Category: ', '');
  const tagsList = descriptionParts[1] ? descriptionParts[1].split(',').map(t => t.trim()).filter(t => t !== 'None' && t !== '') : [];

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-8">
      
      {/* Particle Animation CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes heart-burst {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
          100% { transform: translate(calc(-50% + cos(var(--angle)) * 35px), calc(-50% + sin(var(--angle)) * 35px)) scale(0); opacity: 0; }
        }
        .particle {
          position: absolute; top: 50%; left: 1.5rem; width: 6px; height: 6px;
          background-color: #ec4899; border-radius: 50%; pointer-events: none;
          animation: heart-burst 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}} />

      {/* Back Button */}
      <Link href="/explore" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border-light)] hover:bg-[var(--bg-surface)] transition-colors mb-6 text-sm font-medium">
        <ArrowLeft weight="bold" /> Back to Explore
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 items-start">
        
        {/* LEFT COLUMN: Preview & Code */}
        <div className="flex flex-col gap-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-3xl font-bold">{component.title}</h1>
            <div className="flex gap-2">
              <button 
                onClick={handleLikeToggle}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium active:scale-95 select-none ${isLiked ? 'border-[var(--accent-2)] text-[var(--accent-2)] bg-pink-500/10' : 'border-[var(--border-light)] hover:bg-[var(--bg-surface)]'}`}
              >
                <Heart weight={isLiked ? "fill" : "regular"} size={18} /> {isLiked ? 'Liked' : 'Like'}
                {/* Embedded Particles! */}
                {particles.map((i) => <div key={i} className="particle" style={{ "--angle": `${i * 60}deg` } as React.CSSProperties} />)}
              </button>
              
              <button 
                onClick={handleSaveToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium active:scale-95 select-none ${isSaved ? 'border-[var(--accent-1)] text-[var(--accent-1)] bg-purple-500/10' : 'border-[var(--border-light)] hover:bg-[var(--bg-surface)]'}`}
              >
                <BookmarkSimple weight={isSaved ? "fill" : "regular"} size={18} /> {isSaved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>

          {/* Live Preview Window (with CSS resize!) */}
          <div className="w-full h-[500px] bg-[var(--bg-base)] rounded-2xl border border-[var(--border-light)] flex items-center justify-center relative overflow-hidden resize-x max-w-full min-w-[320px]">
            {/* The Real Iframe */}
            <iframe 
              srcDoc={getPreviewDoc()} 
              className="w-full h-full border-none"
              sandbox="allow-scripts allow-same-origin"
            />
            {/* Resize handle indicator */}
            <div className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize bg-white/5 hover:bg-[var(--accent-1)] transition-colors flex items-center justify-center group pointer-events-none">
              <div className="h-8 w-[2px] bg-white/30 group-hover:bg-white rounded-full"></div>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-light)] overflow-hidden relative">
            <div className="flex border-b border-[var(--border-light)] bg-black/20">
              <button onClick={() => setActiveTab('html')} className={`px-6 py-3 text-sm font-mono transition-colors border-b-2 ${activeTab === 'html' ? 'border-[var(--accent-1)] text-[var(--text-main)] bg-[var(--bg-surface)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>index.html</button>
              <button onClick={() => setActiveTab('css')} className={`px-6 py-3 text-sm font-mono transition-colors border-b-2 ${activeTab === 'css' ? 'border-[var(--accent-1)] text-[var(--text-main)] bg-[var(--bg-surface)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>styles.css</button>
              <button onClick={() => setActiveTab('js')} className={`px-6 py-3 text-sm font-mono transition-colors border-b-2 ${activeTab === 'js' ? 'border-[var(--accent-1)] text-[var(--text-main)] bg-[var(--bg-surface)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>script.js</button>
            </div>
            
            <button 
              onClick={handleCopy}
              className="absolute right-4 top-[60px] p-2 rounded-lg bg-white/5 border border-white/10 text-[var(--text-muted)] hover:text-white transition-colors"
              title="Copy Code"
            >
              {copied ? <CheckCircle weight="fill" className="text-[var(--success)]" size={20} /> : <Copy size={20} />}
            </button>

            <div className="p-6 overflow-x-auto bg-[#0d0d0f] min-h-[250px]">
              <pre className="text-sm font-mono text-[#a1a1aa] whitespace-pre-wrap">
                <code>
                  {activeTab === 'html' && component.html_code}
                  {activeTab === 'css' && component.css_code}
                  {activeTab === 'js' && component.js_code}
                </code>
              </pre>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar */}
        <div className="flex flex-col gap-6">
          
          {/* Creator Profile */}
          <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-light)]">
            <h3 className="font-bold mb-4">Creator</h3>
            <div className="flex items-center gap-4 mb-6">
              <img src={component.author_avatar} alt="Author" className="w-12 h-12 rounded-full border border-[var(--border-light)] bg-black/50" />
              <div className="overflow-hidden">
                <div className="font-semibold truncate">{component.author_name}</div>
                <div className="text-sm text-[var(--text-muted)] truncate">@{component.author_name.toLowerCase().replace(/\s+/g, '')}</div>
              </div>
              <button className="ml-auto px-4 py-1.5 rounded-lg border border-[var(--border-light)] text-sm font-medium hover:bg-white hover:text-black transition-colors shrink-0">
                Follow
              </button>
            </div>
            
            <div className="flex justify-between items-center text-sm text-[var(--text-muted)] pt-4 border-t border-[var(--border-light)]">
              <div className="flex items-center gap-1"><Eye weight="fill" /> 1.2k</div>
              <div className="flex items-center gap-1"><Heart weight="fill" className={isLiked ? "text-pink-500" : ""} /> {likesCount}</div>
              <div className="flex items-center gap-1"><Copy weight="fill" /> 0</div>
            </div>
          </div>

          {/* Tags */}
          {(category !== 'None' || tagsList.length > 0) && (
            <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-light)]">
              <h3 className="font-bold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {category !== 'None' && (
                  <span className="px-3 py-1 bg-[var(--accent-1)]/20 border border-[var(--accent-1)]/50 text-[var(--accent-1)] rounded-full text-xs transition-colors">
                    {category}
                  </span>
                )}
                {tagsList.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-[var(--bg-base)] border border-[var(--border-light)] rounded-full text-xs hover:bg-white hover:text-black transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-light)] flex flex-col max-h-[500px]">
            <h3 className="font-bold mb-4">Comments ({comments.length})</h3>
            
            <div className="flex flex-col gap-4 overflow-y-auto flex-1 pr-2 mb-4 scroll-smooth">
              {comments.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)] text-center py-4">No comments yet.</p>
              ) : (
                comments.map(comment => (
                  <div key={comment.id} className="flex gap-3 pb-4 border-b border-[var(--border-light)] last:border-0 last:pb-0">
                    <img src={comment.author_avatar} alt="User" className="w-8 h-8 rounded-full bg-black/50 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-white/90">
                        {comment.author_name} 
                        <span className="font-normal text-[var(--text-muted)] ml-2 text-xs">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-sm mt-1 text-[var(--text-muted)]">{comment.content}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <form onSubmit={handlePostComment} className="mt-auto relative pt-4 border-t border-[var(--border-light)]">
              <input 
                type="text" 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..." 
                className="w-full bg-[var(--bg-base)] border border-[var(--border-light)] rounded-lg py-2.5 pl-3 pr-10 text-sm focus:outline-none focus:border-[var(--accent-1)] transition-colors" 
              />
              <button 
                type="submit" 
                disabled={isSubmittingComment || !newComment.trim()}
                className="absolute right-2 top-[26px] p-1.5 text-[var(--accent-1)] hover:text-white disabled:opacity-50 transition-colors"
              >
                <PaperPlaneRight weight="fill" size={18} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}