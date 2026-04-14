"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import ComponentCard from "@/components/ComponentCard";
import { MagnifyingGlass, Crown, CircleNotch } from "@phosphor-icons/react";
import AnimatedCheckbox from "@/components/AnimatedCheckbox";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next"
interface CodeComponent {
  id: string;
  title: string;
  description: string;
  html_code: string;
  css_code: string;
  created_at: string;
  author_name: string;
  author_avatar: string;
  likes: { count: number }[]; // Added to hold the like count
}
const CATEGORIES = ["All Categories", "Buttons", "Cards", "Inputs", "Loaders"];

export default function Explore() {
  const [components, setComponents] = useState<CodeComponent[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Categories");

  const supabase = createClient();

  useEffect(() => {
    const fetchComponents = async () => {
      const { data } = await supabase
        .from('components')
        .select('*, likes(count)') // This magically fetches the total likes for each component!
        .order('created_at', { ascending: false });

      if (data) setComponents(data);
      setLoading(false);
    };
    fetchComponents();
  }, [supabase]);
  // Generate interactive preview
  const getPreviewNode = (html: string, css: string) => {
    const srcDoc = `
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
    
    return (
      <iframe 
        srcDoc={srcDoc} 
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-same-origin"
      />
    );
  };

  // Apply Search & Category Filters
  const filteredComponents = components.filter(comp => {
    const matchesSearch = comp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          comp.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === "All Categories" || 
                            comp.description.toLowerCase().includes(activeCategory.toLowerCase().replace('s', ''));

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-24 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
        
        {/* Sidebar Filters */}
        <aside className="glass p-6 rounded-2xl h-fit border border-white/10 bg-black/30 backdrop-blur-xl sticky top-24 shadow-2xl">
          
          {/* Search */}
          <div className="relative mb-6">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..." 
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-light)] rounded-xl py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-[var(--accent-1)] transition-colors text-white placeholder:text-white/40"
            />
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">Category</h3>
            <div className="flex flex-col gap-3">
              {CATEGORIES.map(cat => (
                <div key={cat} onClick={() => setActiveCategory(cat)} className="cursor-pointer">
                   {/* Wrapping in a div to guarantee the onClick works regardless of how AnimatedCheckbox is coded internally */}
                  <AnimatedCheckbox 
                    label={cat} 
                    defaultChecked={activeCategory === cat} 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Frameworks (Visual Only for now) */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">Framework</h3>
            <div className="flex flex-col gap-3">
              <AnimatedCheckbox label="HTML/CSS" defaultChecked />
              <div className="opacity-50 pointer-events-none"><AnimatedCheckbox label="Tailwind CSS" /></div>
              <div className="opacity-50 pointer-events-none"><AnimatedCheckbox label="React" /></div>
            </div>
          </div>

          {/* Sort By */}
          <div>
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Sort By</h3>
            <select className="w-full bg-[var(--bg-surface)] border border-[var(--border-light)] rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-[var(--accent-1)] cursor-pointer appearance-none">
              <option>Newest</option>
              <option>Trending</option>
              <option>Most Liked</option>
            </select>
          </div>
        </aside>

        {/* Main Grid Content */}
        <div className="flex flex-col">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-[var(--text-muted)] font-medium">Showing {filteredComponents.length} components</h2>
            <div className="flex gap-3">
              <button className="px-4 py-1.5 rounded-full text-sm font-medium bg-[var(--text-main)] text-[var(--bg-base)] transition-colors">
                Free
              </button>
              <button className="flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium border border-[var(--border-light)] bg-[var(--bg-surface)] hover:bg-[var(--text-main)] hover:text-[var(--bg-base)] text-white transition-colors">
                Pro <Crown weight="fill" className="text-[var(--warning)]" />
              </button>
            </div>
          </div>

          {/* Grid Area */}
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-white/50">
               <CircleNotch size={32} className="animate-spin mb-4 text-[var(--accent-1)]" />
               Fetching universe...
            </div>
          ) : filteredComponents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredComponents.map((comp) => (
                <Link href={`/component/${comp.id}`} key={comp.id} className="block group">
                  <ComponentCard 
                    title={comp.title}
                    author={comp.author_name} 
                    avatar={comp.author_avatar}
                    likes={comp.likes[0]?.count || 0} 
                    isPro={false}
                    previewNode={getPreviewNode(comp.html_code, comp.css_code)}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-3xl bg-black/20">
              <MagnifyingGlass size={48} className="text-white/20 mb-4" />
              <p className="text-white/60 font-medium">No components found for this search.</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}