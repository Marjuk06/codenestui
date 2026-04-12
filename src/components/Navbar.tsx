"use client";

import Link from "next/link";
import { CodeBlock, MagnifyingGlass, Crown, Bell } from "@phosphor-icons/react";

export default function Navbar() {
  return (
    <div className="fixed top-6 left-0 right-0 z-[100] px-6 pointer-events-none">
      {/* ADDED A PINCH OF BLACK: bg-black/30 keeps it dark but highly refractive */}
      <nav className="mx-auto max-w-[1400px] h-[70px] flex justify-between items-center px-6 rounded-full bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl pointer-events-auto">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-1)] to-[var(--accent-3)] flex items-center justify-center shadow-lg">
            <CodeBlock weight="fill" className="text-white" size={24} />
          </div>
          <span className="text-[var(--text-main)] tracking-tight">CodeNest UI</span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex relative w-full max-w-[400px]">
          <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-main)] opacity-60" size={20} />
          <input 
            type="text" 
            placeholder="Search components..." 
            className="w-full bg-black/40 border border-white/10 rounded-full py-2 pl-11 pr-4 text-[var(--text-main)] placeholder:text-white/50 focus:outline-none focus:border-[var(--accent-1)] focus:ring-2 focus:ring-[var(--accent-1)]/30 transition-all backdrop-blur-md"
          />
        </div>

        {/* Links & Actions */}
        <div className="flex items-center gap-6 font-medium text-white/80">
          <Link href="/explore" className="hover:text-white transition-colors">Explore</Link>
          <Link href="/upload" className="hover:text-white transition-colors">Upload</Link>
          
          <button className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--warning)] text-[var(--warning)] hover:bg-[var(--warning)] hover:text-white transition-all text-sm shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Crown weight="fill" size={16} /> Pro
          </button>

          <div className="w-[1px] h-6 bg-white/10"></div>

          <button className="text-white/80 hover:text-white transition-colors">
            <Bell size={24} />
          </button>

          <img 
            src="https://i.pravatar.cc/150?img=32" 
            alt="Profile" 
            className="w-10 h-10 rounded-full bg-[var(--accent-1)] cursor-pointer object-cover border-2 border-white/10 hover:border-[var(--accent-1)] transition-colors"
          />
        </div>

      </nav>
    </div>
  );
}