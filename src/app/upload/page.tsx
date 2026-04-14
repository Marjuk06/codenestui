"use client";

import { useState, useEffect } from "react";
import { ArrowsOut, CheckCircle, WarningCircle } from "@phosphor-icons/react";
import AnimatedPublishButton from "@/components/AnimatedPublishButton";
import SaveDraftButton from "@/components/SaveDraftButton";
import { createClient } from "@/utils/supabase/client";

export default function UploadPage() {
  const [activeTab, setActiveTab] = useState<"html" | "css" | "js">("html");
  const [srcDoc, setSrcDoc] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [htmlCode, setHtmlCode] = useState("<div class=\"box\">\n  Hello CodeNest!\n</div>");
  const [cssCode, setCssCode] = useState(".box {\n  padding: 20px;\n  background: #8b5cf6;\n  color: white;\n  border-radius: 12px;\n  text-align: center;\n  font-family: sans-serif;\n  font-weight: bold;\n}");
  const [jsCode, setJsCode] = useState("// Add your JavaScript here\nconsole.log('Ready!');");

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) window.location.href = "/";
    });
  }, [supabase]);

  // On page load, check if there is a saved draft in the browser
  useEffect(() => {
    const savedDraft = localStorage.getItem('codenest_draft');
    if (savedDraft) {
      const parsed = JSON.parse(savedDraft);
      if (parsed.title) setTitle(parsed.title);
      if (parsed.category) setCategory(parsed.category);
      if (parsed.tags) setTags(parsed.tags);
      if (parsed.htmlCode) setHtmlCode(parsed.htmlCode);
      if (parsed.cssCode) setCssCode(parsed.cssCode);
      if (parsed.jsCode) setJsCode(parsed.jsCode);
    }
  }, []);

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
    }, 250); 
    return () => clearTimeout(timeout);
  }, [htmlCode, cssCode, jsCode]);

  const handleSaveDraft = () => {
    const draftData = { title, category, tags, htmlCode, cssCode, jsCode };
    localStorage.setItem('codenest_draft', JSON.stringify(draftData));
  };

  const handlePublish = async () => {
    if (!title || !htmlCode) {
      setMessage({ type: "error", text: "Title and HTML code are required!" });
      return;
    }

    setMessage(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const fullDescription = `Category: ${category || 'None'} | Tags: ${tags || 'None'}`;

   // Inside handlePublish in src/app/upload/page.tsx
    const { error } = await supabase
      .from('components')
      .insert([{ 
        user_id: user.id,
        title: title,
        description: fullDescription,
        html_code: htmlCode,
        css_code: cssCode,
        js_code: jsCode,
        // ADD THESE TWO LINES:
        author_name: user.user_metadata?.full_name || user.email?.split('@')[0] || "CodeNest User",
        author_avatar: user.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/micah/svg?seed=Felix&backgroundColor=000000"
      }]);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setTimeout(() => {
        setMessage({ type: "success", text: "Component published successfully! 🚀" });
        setTitle("");
        setCategory("");
        setTags("");
        // Clear the draft after successful publish so it doesn't reload old code!
        localStorage.removeItem('codenest_draft'); 
      }, 6600);
    }
  };

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-8 min-h-[calc(100vh-120px)] flex flex-col mt-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-white">Create Component</h1>
        <div className="flex gap-3 w-full md:w-auto">
          
          {/* Your new functional Save Draft Button */}
          <SaveDraftButton onSave={handleSaveDraft} />
          
          <div className="transition-opacity">
            <AnimatedPublishButton 
              onClick={handlePublish}
              isValid={title.trim() !== "" && htmlCode.trim() !== ""}
            />
          </div>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 border backdrop-blur-md ${message.type === "success" ? "bg-[var(--success)]/10 border-[var(--success)]/30 text-[var(--success)]" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
          {message.type === "success" ? <CheckCircle size={24} /> : <WarningCircle size={24} />}
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        <div className="flex flex-col gap-6">
          <div className="bg-black/30 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Component Title (e.g. Neon Button)" className="w-full bg-transparent text-2xl font-bold text-white placeholder:text-white/30 focus:outline-none mb-6" />
            <div className="flex flex-col sm:flex-row gap-4">
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="flex-1 bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white/80 focus:outline-none focus:border-[var(--accent-1)] appearance-none cursor-pointer">
                <option value="">Select Category</option>
                <option value="buttons">Buttons</option>
                <option value="cards">Cards</option>
                <option value="forms">Forms</option>
              </select>
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma separated)" className="flex-1 bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--accent-1)]" />
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-[#0d0d0f] border border-white/10 rounded-2xl overflow-hidden shadow-xl min-h-[400px]">
            <div className="flex border-b border-white/10 bg-black/40">
              <button onClick={() => setActiveTab('html')} className={`flex-1 py-3 text-sm font-mono transition-colors border-b-2 ${activeTab === 'html' ? 'border-[var(--accent-1)] text-white bg-white/5' : 'border-transparent text-white/50 hover:text-white'}`}>HTML</button>
              <button onClick={() => setActiveTab('css')} className={`flex-1 py-3 text-sm font-mono transition-colors border-b-2 ${activeTab === 'css' ? 'border-[var(--accent-1)] text-white bg-white/5' : 'border-transparent text-white/50 hover:text-white'}`}>CSS</button>
              <button onClick={() => setActiveTab('js')} className={`flex-1 py-3 text-sm font-mono transition-colors border-b-2 ${activeTab === 'js' ? 'border-[var(--accent-1)] text-white bg-white/5' : 'border-transparent text-white/50 hover:text-white'}`}>JS</button>
            </div>
            <div className="flex-1 relative p-4">
              <textarea value={htmlCode} onChange={(e) => setHtmlCode(e.target.value)} className={`w-full h-full bg-transparent text-[#a1a1aa] font-mono text-sm resize-none focus:outline-none ${activeTab === 'html' ? 'block' : 'hidden'}`} spellCheck={false} />
              <textarea value={cssCode} onChange={(e) => setCssCode(e.target.value)} className={`w-full h-full bg-transparent text-[#a1a1aa] font-mono text-sm resize-none focus:outline-none ${activeTab === 'css' ? 'block' : 'hidden'}`} spellCheck={false} />
              <textarea value={jsCode} onChange={(e) => setJsCode(e.target.value)} className={`w-full h-full bg-transparent text-[#a1a1aa] font-mono text-sm resize-none focus:outline-none ${activeTab === 'js' ? 'block' : 'hidden'}`} spellCheck={false} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center h-8">
            <h3 className="text-white/60 font-medium">Live Preview</h3>
            <button className="text-white/40 hover:text-white transition-colors p-1"><ArrowsOut size={20} /></button>
          </div>
          <div className="flex-1 bg-[var(--bg-base)] border border-white/10 rounded-2xl overflow-hidden shadow-xl relative min-h-[400px]">
            <iframe srcDoc={srcDoc} title="live-preview" sandbox="allow-scripts" className="w-full h-full border-none" />
          </div>
        </div>
      </div>
    </main>
  );
}