"use client";

import { useState, useEffect } from "react";
import { FloppyDisk, ArrowsOut } from "@phosphor-icons/react";
import AnimatedPublishButton from "@/components/AnimatedPublishButton";

export default function UploadPage() {
  const [activeTab, setActiveTab] = useState<"html" | "css" | "js">("html");
  const [htmlCode, setHtmlCode] = useState("<div class=\"box\">\n  Hello CodeNest!\n</div>");
  const [cssCode, setCssCode] = useState(".box {\n  padding: 20px;\n  background: #8b5cf6;\n  color: white;\n  border-radius: 12px;\n  text-align: center;\n  font-family: sans-serif;\n  font-weight: bold;\n}");
  const [jsCode, setJsCode] = useState("// Add your JavaScript here\nconsole.log('Ready!');");
  const [srcDoc, setSrcDoc] = useState("");

  // Update the live preview whenever code changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: transparent; }
              ${cssCode}
            </style>
          </head>
          <body>
            ${htmlCode}
            <script>${jsCode}<\/script>
          </body>
        </html>
      `);
    }, 250); // Small debounce to prevent lag while typing

    return () => clearTimeout(timeout);
  }, [htmlCode, cssCode, jsCode]);

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-8 min-h-[calc(100vh-120px)] flex flex-col">
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Create Component</h1>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-white/10 bg-black/30 backdrop-blur-xl hover:bg-white/10 transition-colors font-medium">
            <FloppyDisk size={20} /> Save Draft
          </button>
          
          {/* Your massive new Drone Button! */}
          <AnimatedPublishButton />

        </div>
      </div>

      {/* Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        
        {/* Left: Settings & Editor */}
        <div className="flex flex-col gap-6">
          
          {/* Metadata Settings */}
          <div className="bg-black/30 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl">
            <input 
              type="text" 
              placeholder="Component Title (e.g. Neon Button)" 
              className="w-full bg-transparent text-2xl font-bold text-white placeholder:text-white/30 focus:outline-none mb-6"
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <select className="flex-1 bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white/80 focus:outline-none focus:border-[var(--accent-1)] appearance-none cursor-pointer">
                <option value="">Select Category</option>
                <option value="buttons">Buttons</option>
                <option value="cards">Cards</option>
                <option value="forms">Forms</option>
              </select>
              <input 
                type="text" 
                placeholder="Tags (comma separated)" 
                className="flex-1 bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--accent-1)]"
              />
            </div>
          </div>

          {/* Code Editor Area */}
          <div className="flex-1 flex flex-col bg-[#0d0d0f] border border-white/10 rounded-2xl overflow-hidden shadow-xl min-h-[400px]">
            {/* Tabs */}
            <div className="flex border-b border-white/10 bg-black/40">
              <button onClick={() => setActiveTab('html')} className={`flex-1 py-3 text-sm font-mono transition-colors border-b-2 ${activeTab === 'html' ? 'border-[var(--accent-1)] text-white bg-white/5' : 'border-transparent text-white/50 hover:text-white'}`}>HTML</button>
              <button onClick={() => setActiveTab('css')} className={`flex-1 py-3 text-sm font-mono transition-colors border-b-2 ${activeTab === 'css' ? 'border-[var(--accent-1)] text-white bg-white/5' : 'border-transparent text-white/50 hover:text-white'}`}>CSS</button>
              <button onClick={() => setActiveTab('js')} className={`flex-1 py-3 text-sm font-mono transition-colors border-b-2 ${activeTab === 'js' ? 'border-[var(--accent-1)] text-white bg-white/5' : 'border-transparent text-white/50 hover:text-white'}`}>JS</button>
            </div>
            
            {/* Textareas */}
            <div className="flex-1 relative p-4">
              <textarea 
                value={htmlCode} 
                onChange={(e) => setHtmlCode(e.target.value)} 
                className={`w-full h-full bg-transparent text-[#a1a1aa] font-mono text-sm resize-none focus:outline-none ${activeTab === 'html' ? 'block' : 'hidden'}`} 
                spellCheck={false}
              />
              <textarea 
                value={cssCode} 
                onChange={(e) => setCssCode(e.target.value)} 
                className={`w-full h-full bg-transparent text-[#a1a1aa] font-mono text-sm resize-none focus:outline-none ${activeTab === 'css' ? 'block' : 'hidden'}`} 
                spellCheck={false}
              />
              <textarea 
                value={jsCode} 
                onChange={(e) => setJsCode(e.target.value)} 
                className={`w-full h-full bg-transparent text-[#a1a1aa] font-mono text-sm resize-none focus:outline-none ${activeTab === 'js' ? 'block' : 'hidden'}`} 
                spellCheck={false}
              />
            </div>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center h-8">
            <h3 className="text-white/60 font-medium">Live Preview</h3>
            <button className="text-white/40 hover:text-white transition-colors p-1">
              <ArrowsOut size={20} />
            </button>
          </div>
          
          <div className="flex-1 bg-[var(--bg-base)] border border-white/10 rounded-2xl overflow-hidden shadow-xl relative min-h-[400px]">
            {/* The iframe renders the live code safely */}
            <iframe 
              srcDoc={srcDoc} 
              title="live-preview" 
              sandbox="allow-scripts" 
              className="w-full h-full border-none"
            />
          </div>
        </div>

      </div>
    </main>
  );
}