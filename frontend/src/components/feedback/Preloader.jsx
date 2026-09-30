import React, { useState, useEffect } from 'react';
import { vantaLogo } from '../../assets';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('loading'); // 'loading' | 'complete' | 'exit' | 'done'

  // Smooth, snappy fade progression (~1.8 seconds)
  useEffect(() => {
    let current = 0;
    let id;

    const tick = () => {
      // Step increment for organic smooth acceleration
      const step = 0.85 + Math.random() * 0.45;
      current = Math.min(100, current + step);
      setProgress(current);

      if (current < 100) {
        id = requestAnimationFrame(tick);
      } else {
        setStage('complete');
        // Brief pause once full vibrant color is reached, then trigger curtain exit
        setTimeout(() => {
          setStage('exit');
        }, 400);
        setTimeout(() => {
          setStage('done');
          if (onComplete) onComplete();
        }, 1100);
      }
    };

    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [onComplete]);

  // Keyboard shortcut to skip
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.code === 'Space') {
        setProgress(100);
        setStage('exit');
        setTimeout(() => {
          setStage('done');
          if (onComplete) onComplete();
        }, 450);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onComplete]);

  if (stage === 'done') return null;

  const colorRatio = Math.min(1, progress / 100);

  return (
    <div
      className="fixed inset-0 z-[999999] pointer-events-auto select-none overflow-hidden bg-white flex items-center justify-center"
      aria-label="VANTA Logo Loader"
    >
      {/* ========================================================
          WHITE SPLIT SHUTTERS (CURTAINS)
          Slides smoothly open on exit to reveal the website
          ======================================================== */}
      
      {/* Top Shutter */}
      <div 
        className={`absolute top-0 left-0 right-0 h-1/2 bg-white z-0 transition-transform duration-700 ease-[cubic-bezier(0.85,0,0.15,1)]
          ${stage === 'exit' ? '-translate-y-full shadow-[0_15px_35px_rgba(0,0,0,0.06)]' : 'translate-y-0'}
        `}
      />

      {/* Bottom Shutter */}
      <div 
        className={`absolute bottom-0 left-0 right-0 h-1/2 bg-white z-0 transition-transform duration-700 ease-[cubic-bezier(0.85,0,0.15,1)]
          ${stage === 'exit' ? 'translate-y-full shadow-[0_-15px_35px_rgba(0,0,0,0.06)]' : 'translate-y-0'}
        `}
      />

      {/* Soft Ambient Warm Spotlight */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] sm:w-[600px] sm:h-[600px] rounded-full pointer-events-none z-0 transition-opacity duration-700"
        style={{
          background: 'radial-gradient(circle, rgba(255, 107, 0, 0.12) 0%, rgba(255, 160, 0, 0.03) 50%, transparent 70%)',
          filter: 'blur(50px)',
          opacity: 0.3 + colorRatio * 0.7,
        }}
      />

      {/* ========================================================
          CENTER STAGE: SIMPLE LOGO FADE TO COLOR
          ======================================================== */}
      <div 
        className="relative z-10 flex flex-col items-center justify-center transition-all duration-700 ease-out"
        style={{
          transform: stage === 'complete' ? 'scale(1.04)' : stage === 'exit' ? 'scale(1.08)' : 'scale(1)',
          opacity: stage === 'exit' ? 0 : 1,
        }}
      >
        <div className="relative w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center">
          {/* Base Layer: Grayscale / Faded Silhouette */}
          <img
            src={vantaLogo}
            alt="VANTA"
            className="w-full h-full object-contain pointer-events-none select-none"
            style={{
              filter: 'grayscale(100%) opacity(0.18)',
            }}
          />

          {/* Color Layer: Smoothly fades in to vibrant brand color */}
          <img
            src={vantaLogo}
            alt="VANTA"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none transition-opacity duration-150 ease-out"
            style={{
              opacity: colorRatio,
              filter: `drop-shadow(0 10px 30px rgba(255, 107, 0, ${colorRatio * 0.4}))`,
            }}
          />

          {/* Gentle expansion shockwave on completion */}
          {stage === 'complete' && (
            <div 
              className="absolute inset-0 rounded-full border border-orange-400/50 pointer-events-none"
              style={{
                animation: 'preloaderShockwave 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards'
              }}
            />
          )}
        </div>

        {/* Minimal Subtle Brand Tagline */}
        <div className="mt-5 flex items-center gap-2">
          <span 
            className="text-[11px] font-bold tracking-[0.25em] uppercase text-neutral-400 transition-colors duration-500 font-cute"
            style={{
              color: colorRatio > 0.8 ? '#ff6b00' : 'rgba(115, 115, 115, 0.7)',
            }}
          >
            VANTA
          </span>
          <span 
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              backgroundColor: colorRatio > 0.8 ? '#ff6b00' : '#d4d4d4',
              transform: `scale(${0.8 + colorRatio * 0.4})`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
