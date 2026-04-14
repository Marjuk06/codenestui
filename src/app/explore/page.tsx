"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { MagnifyingGlass, CodeBlock, Sparkle } from "@phosphor-icons/react";
import Link from "next/link";

interface CodeComponent {
  id: string;
  title: string;
  description: string;
  html_code: string;
  css_code: string;
  created_at: string;
}

const CATEGORIES = ["All", "Buttons", "Cards", "Forms", "Loaders"];

export default function ExplorePage() {
  const [components, setComponents] = useState<CodeComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const supabase = createClient();

  useEffect(() => {
    const fetchAllComponents = async () => {
      // Fetch all published components from newest to oldest
      const { data } = await supabase
        .from('components')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setComponents(data);
      setLoading(false);
    };

    fetchAllComponents();
  }, [supabase]);

  // Helper to generate the mini iframe preview safely
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

  // Filter logic for Search + Categories
  const filteredComponents = components.filter(comp => {
    const matchesSearch = comp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          comp.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === "All" || 
                            comp.description.toLowerCase().includes(activeCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen relative overflow-hidden pt-24 pb-16">
      
      {/* Massive Ambient Background Glows */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] rounded-full blur-[150px] opacity-20 pointer-events-none -z-10"></div>

      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[var(--accent-1)] text-sm font-bold mb-6 backdrop-blur-md">
            <Sparkle weight="fill" /> Premium UI Library
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)]">Next-Gen</span> UI
          </h1>
          <p className="text-[var(--text-muted)] text-lg md:text-xl max-w-2xl mb-12">
            Explore hundreds of open-source glassmorphism, neumorphism, and modern UI components built by the community.
          </p>

          {/* Search Bar */}
          <div className="relative w-full max-w-2xl group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-white/40 group-focus-within:text-[var(--accent-1)] transition-colors">
              <MagnifyingGlass size={24} />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search components, tags, or categories..." 
              className="w-full bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full py-5 pl-16 pr-8 text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--accent-1)] focus:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all text-lg"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category 
                  ? 'bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] scale-105' 
                  : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Components Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-white/10 border-t-[var(--accent-1)] rounded-full animate-spin"></div>
            <p className="text-white/50 font-medium">Loading universe...</p>
          </div>
        ) : filteredComponents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredComponents.map((comp) => (
              <div key={comp.id} className="group relative bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-xl hover:border-white/20 hover:shadow-2xl transition-all duration-300 flex flex-col hover:-translate-y-1">
                
                {/* Interactive Live Preview */}
                <div className="w-full h-56 bg-[var(--bg-base)] relative overflow-hidden flex items-center justify-center border-b border-white/10">
                  <iframe 
                    srcDoc={getPreviewDoc(comp.html_code, comp.css_code)} 
                    className="w-full h-full border-none"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>

                {/* Component Info */}
                <div className="p-5 flex justify-between items-end flex-1 bg-gradient-to-b from-transparent to-black/20">
                  <div className="overflow-hidden pr-4">
                    <h3 className="text-lg font-bold text-white truncate group-hover:text-[var(--accent-1)] transition-colors">{comp.title}</h3>
                    <p className="text-sm text-white/50 mt-1 truncate">
                      {comp.description.replace('Category: ', '').replace(' | Tags: ', ' • ')}
                    </p>
                  </div>
                  
                  <Link 
                    href={`/component/${comp.id}`} 
                    className="shrink-0 px-4 py-2 bg-white/5 hover:bg-[var(--accent-1)] border border-white/10 hover:border-transparent rounded-xl text-white text-sm font-medium transition-all duration-300 flex items-center gap-2"
                  >
                    <CodeBlock size={16} /> Code
                  </Link>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-black/20 border border-white/5 rounded-3xl backdrop-blur-xl">
            <MagnifyingGlass size={48} className="text-white/20 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No components found</h3>
            <p className="text-[var(--text-muted)]">Try adjusting your search or category filter.</p>
            <button 
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

      </div>
    </main>
  );
}