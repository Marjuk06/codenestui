"use client";
import { useId, useState } from "react";

export default function AnimatedCheckbox({ label, defaultChecked = false }: { label: string, defaultChecked?: boolean }) {
  const id = useId();
  // Keep track of the checked state and the bouncing animation
  const [isChecked, setIsChecked] = useState(defaultChecked);
  const [isBouncing, setIsBouncing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
    setIsBouncing(true); // Trigger the bounce on EVERY click
  };

  return (
    <div className="flex items-center gap-3 group">
      <div className="relative flex-shrink-0">
        <input 
          type="checkbox" 
          id={id} 
          className="hidden-xs-up" 
          checked={isChecked}
          onChange={handleChange}
        />
        <label 
          htmlFor={id} 
          onAnimationEnd={() => setIsBouncing(false)} // Reset when done so it can bounce again
          className={`cbx bg-[var(--bg-surface)] ${isBouncing ? 'animate-[jelly_0.6s_ease]' : ''}`}
        ></label>
      </div>
      
      <label 
        htmlFor={id} 
        className="text-sm text-[var(--text-muted)] cursor-pointer group-hover:text-[var(--text-main)] transition-colors"
      >
        {label}
      </label>
    </div>
  );
}