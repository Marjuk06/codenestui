"use client";

import { useState } from "react";
import { FloppyDisk } from "@phosphor-icons/react";
import "./SaveDraftButton.css";

interface SaveDraftProps {
  onSave: () => void;
}

export default function SaveDraftButton({ onSave }: SaveDraftProps) {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    if (isActive) return;
    
    setIsActive(true);
    onSave(); // Trigger the actual saving logic

    // Revert the button back to normal after 2.5 seconds (matches the CSS timings)
    setTimeout(() => {
      setIsActive(false);
    }, 2500);
  };

  return (
    <button 
      className={`draft-btn flex-1 md:flex-none ${isActive ? 'is-active' : ''}`}
      onClick={handleClick}
    >
      <span className="draft-btn-text flex items-center justify-center gap-2">
        <FloppyDisk size={20} /> Save Draft
      </span>
    </button>
  );
}