"use client";

import { useState, useEffect } from "react";
import { PaperPlaneRight } from "@phosphor-icons/react";
import "./AnimatedPublishButton.css";

export default function AnimatedPublishButton() {
  const [status, setStatus] = useState<"idle" | "processing" | "reverting">("idle");

  const handleClick = () => {
    if (status !== "idle") return;
    
    setStatus("processing");

    // The entire animation sequence takes exactly 6.6 seconds
    setTimeout(() => {
      setStatus("reverting");
    }, 6600);
  };

  useEffect(() => {
    if (status === "reverting") {
      // Revert animation takes 1.5 seconds, then reset to idle
      const timer = setTimeout(() => {
        setStatus("idle");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    /* The Wrapper: Forces the space it takes up to be exactly 70% of the original size (210px by 45px) */
    <div className="relative w-[210px] h-[45px] flex-shrink-0">
      
      {/* The Button: Scaled down perfectly from the top-left corner */}
      <div 
        className={`drone-btn absolute top-0 left-0 origin-top-left scale-[0.7] ${status === 'processing' ? 's--processing' : ''} ${status === 'reverting' ? 's--reverting' : ''}`}
        onClick={handleClick}
      >
        <div className="drone-btn__drone-cont drone-btn__drone-cont--takeoff">
          <div className="drone-btn__drone-cont drone-btn__drone-cont--shift-x">
            <div className="drone-btn__drone-cont drone-btn__drone-cont--landing">
              <svg viewBox="0 0 136 112" className="drone-btn__drone">
                <g className="drone-btn__drone-leaving">
                  <path className="drone-btn__drone-arm" d="M52,46 c0,0 -15,5 -15,20 l15,10" />
                  <path className="drone-btn__drone-arm drone-btn__drone-arm--2" d="M52,46 c0,0 -15,5 -15,20 l15,10" />
                  <path className="drone-btn__drone-yellow" d="M28,36 l20,0 a20,9 0,0,1 40,0 l20,0 l0,8 l-10,0 c-10,0 -15,0 -23,10 l-14,0 c-10,-10 -15,-10 -23,-10 l-10,0z" />
                  <path className="drone-btn__drone-green" d="M16,12 a10,10 0,0,1 20,0 l-10,50z" />
                  <path className="drone-btn__drone-green" d="M100,12 a10,10 0,0,1 20,0 l-10,50z" />
                  <path className="drone-btn__drone-yellow" d="M9,8 l34,0 a8,8 0,0,1 0,16 l-34,0 a8,8 0,0,1 0,-16z" />
                  <path className="drone-btn__drone-yellow" d="M93,8 l34,0 a8,8 0,0,1 0,16 l-34,0 a8,8 0,0,1 0,-16z" />
                </g>
                <path className="drone-btn__drone-package drone-btn__drone-green" d="M50,70 l36,0 l-4,45 l-28,0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="drone-btn__circle">
          <div className="drone-btn__circle-inner">
            <svg viewBox="0 0 16 20" className="drone-btn__circle-package">
              <path d="M0,0 16,0 13,20 3,20z" />
            </svg>
            <div className="drone-btn__circle-grabbers"></div>
          </div>
          <svg viewBox="0 0 40 40" className="drone-btn__circle-progress">
            <path className="drone-btn__circle-progress-line" d="M20,0 a20,20 0 0,1 0,40 a20,20 0 0,1 0,-40" />
            <path className="drone-btn__circle-progress-checkmark" d="M14,19 19,24 29,14" />
          </svg>
        </div>

        <div className="drone-btn__text-fields">
          <div className="drone-btn__text drone-btn__text--step-0 gap-2">
            <PaperPlaneRight weight="fill" size={20} /> Publish
          </div>
          <div className="drone-btn__text drone-btn__text--step-1">
            Bundling
            <span className="drone-btn__text-dots"><span>.</span></span>
          </div>
          <div className="drone-btn__text drone-btn__text--step-2">
            Uploading
            <span className="drone-btn__text-dots"><span>.</span></span>
          </div>
          <div className="drone-btn__text drone-btn__text--step-3">Deploying...</div>
          <div className="drone-btn__text drone-btn__text--step-4 text-[var(--bg-surface)] font-bold">Published!</div>
        </div>
        <div className="drone-btn__revert-line"></div>
      </div>
    </div>
  );
}