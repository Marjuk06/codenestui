"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, BookmarkSimple, Copy, Eye, CheckCircle } from "@phosphor-icons/react";

export default function ComponentDetail() {
  const [activeTab, setActiveTab] = useState<"html" | "css" | "js">("html");
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fake code snippets for the prototype
  const codeSnippets = {
    html: `<div class="glass-card">\n  <h3>Login</h3>\n  <input type="email" placeholder="Email" />\n  <input type="password" placeholder="Password" />\n  <button class="submit-btn">Sign In</button>\n</div>`,
    css: `.glass-card {\n  background: rgba(255, 255, 255, 0.1);\n  backdrop-filter: blur(10px);\n  border-radius: 16px;\n  padding: 32px;\n}`,
    js: `const btn = document.querySelector('.submit-btn');\nbtn.addEventListener('click', () => {\n  alert('Logged in!');\n});`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-8">
      
      {/* Back Button */}
      <Link href="/explore" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border-light)] hover:bg-[var(--bg-surface)] transition-colors mb-6 text-sm font-medium">
        <ArrowLeft weight="bold" /> Back to Explore
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 items-start">
        
        {/* LEFT COLUMN: Preview & Code */}
        <div className="flex flex-col gap-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-3xl font-bold">Glassmorphism Login Card</h1>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors text-sm font-medium ${isLiked ? 'border-[var(--accent-2)] text-[var(--accent-2)] bg-pink-500/10' : 'border-[var(--border-light)] hover:bg-[var(--bg-surface)]'}`}
              >
                <Heart weight={isLiked ? "fill" : "regular"} size={18} /> {isLiked ? 'Liked' : 'Like'}
              </button>
              <button 
                onClick={() => setIsSaved(!isSaved)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors text-sm font-medium ${isSaved ? 'border-[var(--accent-1)] text-[var(--accent-1)] bg-purple-500/10' : 'border-[var(--border-light)] hover:bg-[var(--bg-surface)]'}`}
              >
                <BookmarkSimple weight={isSaved ? "fill" : "regular"} size={18} /> {isSaved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>

          {/* Live Preview Window (with CSS resize!) */}
          <div className="w-full h-[500px] bg-black rounded-2xl border border-[var(--border-light)] flex items-center justify-center relative overflow-hidden resize-x max-w-full min-w-[320px]">
            {/* Fake component rendering */}
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 w-[300px] shadow-2xl">
              <h3 className="text-xl font-bold mb-4 text-white">Login</h3>
              <input type="text" placeholder="Email" className="w-full p-3 mb-3 rounded-lg border-none bg-black/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent-1)]" />
              <input type="password" placeholder="Password" className="w-full p-3 mb-4 rounded-lg border-none bg-black/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent-1)]" />
              <button className="w-full p-3 rounded-lg bg-[var(--accent-1)] text-white font-bold hover:opacity-90 transition-opacity">Sign In</button>
            </div>
            {/* Resize handle indicator */}
            <div className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize bg-white/5 hover:bg-white/20 transition-colors flex items-center justify-center">
              <div className="h-8 w-[2px] bg-white/30 rounded-full"></div>
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
              className="absolute right-4 top-[60px] p-2 rounded-lg glass text-[var(--text-muted)] hover:text-white transition-colors"
              title="Copy Code"
            >
              {copied ? <CheckCircle weight="fill" className="text-[var(--success)]" size={20} /> : <Copy size={20} />}
            </button>

            <div className="p-6 overflow-x-auto bg-[#0d0d0f] min-h-[250px]">
              <pre className="text-sm font-mono text-[#a1a1aa] whitespace-pre-wrap">
                {codeSnippets[activeTab]}
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
              <img src="https://i.pravatar.cc/150?img=11" alt="Author" className="w-12 h-12 rounded-full border border-[var(--border-light)]" />
              <div>
                <div className="font-semibold">Alex Developer</div>
                <div className="text-sm text-[var(--text-muted)]">@alexdev</div>
              </div>
              <button className="ml-auto px-4 py-1.5 rounded-lg border border-[var(--border-light)] text-sm font-medium hover:bg-white hover:text-black transition-colors">
                Follow
              </button>
            </div>
            
            <div className="flex justify-between items-center text-sm text-[var(--text-muted)] pt-4 border-t border-[var(--border-light)]">
              <div className="flex items-center gap-1"><Eye weight="fill" /> 1.2k</div>
              <div className="flex items-center gap-1"><Heart weight="fill" /> 342</div>
              <div className="flex items-center gap-1"><Copy weight="fill" /> 89</div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-light)]">
            <h3 className="font-bold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[var(--bg-base)] border border-[var(--border-light)] rounded-full text-xs cursor-pointer hover:bg-white hover:text-black transition-colors">Glassmorphism</span>
              <span className="px-3 py-1 bg-[var(--bg-base)] border border-[var(--border-light)] rounded-full text-xs cursor-pointer hover:bg-white hover:text-black transition-colors">Login</span>
              <span className="px-3 py-1 bg-[var(--bg-base)] border border-[var(--border-light)] rounded-full text-xs cursor-pointer hover:bg-white hover:text-black transition-colors">Form</span>
              <span className="px-3 py-1 bg-[var(--bg-base)] border border-[var(--border-light)] rounded-full text-xs cursor-pointer hover:bg-white hover:text-black transition-colors">CSS Only</span>
            </div>
          </div>

          {/* Comments */}
          <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-light)]">
            <h3 className="font-bold mb-4">Comments (2)</h3>
            <div className="flex flex-col gap-4">
              
              <div className="flex gap-3 pb-4 border-b border-[var(--border-light)]">
                <img src="https://i.pravatar.cc/150?img=4" alt="User" className="w-8 h-8 rounded-full" />
                <div>
                  <div className="text-sm font-semibold">Sarah J. <span className="font-normal text-[var(--text-muted)] ml-2 text-xs">2 days ago</span></div>
                  <div className="text-sm mt-1 text-[var(--text-muted)]">This looks incredibly clean! Definitely using it in my next dashboard.</div>
                </div>
              </div>

              <div className="flex gap-3">
                <img src="https://i.pravatar.cc/150?img=8" alt="User" className="w-8 h-8 rounded-full" />
                <div>
                  <div className="text-sm font-semibold">Mike T. <span className="font-normal text-[var(--text-muted)] ml-2 text-xs">1 week ago</span></div>
                  <div className="text-sm mt-1 text-[var(--text-muted)]">Is there a Tailwind version of this?</div>
                </div>
              </div>

            </div>
            
            <div className="mt-6 relative">
              <input type="text" placeholder="Add a comment..." className="w-full bg-[var(--bg-base)] border border-[var(--border-light)] rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[var(--accent-1)] transition-colors" />
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}