"use client";

import { Heart, LockKey } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

interface ComponentCardProps {
  id?: number;
  title: string;
  author: string;
  avatar: string;
  likes: number;
  isPro: boolean;
  previewNode: React.ReactNode;
}

export default function ComponentCard({ id, title, author, avatar, likes, isPro, previewNode }: ComponentCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    // If it's a Pro component, we will eventually show a modal here.
    // For now, only navigate if it's free!
    if (!isPro) {
      router.push("/component");
    }
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stops the click from triggering the card navigation
    // Add your like logic here later
    console.log("Liked component:", id);
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`relative flex flex-col bg-[var(--bg-surface)] border border-[var(--border-light)] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[var(--border-focus)] hover:shadow-2xl cursor-pointer group ${isPro ? 'locked' : ''}`}
    >
      
      {/* Preview Area */}
      <div className="h-[200px] bg-black relative flex items-center justify-center overflow-hidden">
        {isPro && (
          <div className="absolute top-3 right-3 bg-gradient-to-br from-[var(--warning)] to-amber-700 text-white text-[0.7rem] font-bold px-2 py-1 rounded-md z-10 tracking-wider">
            PRO
          </div>
        )}
        
        <div className={`transition-all duration-300 w-full h-full flex items-center justify-center ${isPro ? 'group-hover:blur-md group-hover:opacity-50' : ''}`}>
          {previewNode}
        </div>

        {isPro && (
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <LockKey weight="fill" size={32} className="text-white mb-2" />
            <button className="bg-gradient-to-br from-[var(--warning)] to-amber-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-lg">
              Unlock
            </button>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-[1.1rem] text-[var(--text-main)]">{title}</h3>
          <button 
            onClick={handleLikeClick}
            className="text-[var(--text-muted)] hover:text-[var(--accent-2)] transition-colors p-1 z-10 relative"
          >
            <Heart weight="fill" size={20} className="hover:scale-110 transition-transform" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[var(--text-muted)] text-sm">
          <div className="flex items-center gap-2">
            <img src={avatar} alt={author} className="w-6 h-6 rounded-full object-cover" />
            <span>{author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart weight="fill" size={16} /> {likes}
          </div>
        </div>
      </div>
    </div>
  );
}