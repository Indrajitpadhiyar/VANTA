import React, { useState, useEffect, useRef } from 'react';
import { vantaLogo } from '../../assets';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('filling'); // 'filling' | 'complete' | 'exit' | 'done'
  const [wavePath, setWavePath] = useState('');
  const [crestPath, setCrestPath] = useState('');
  const startTimeRef = useRef(performance.now());

  // 1. Fluid Water Level Progression (Smooth organic cadence)
  useEffect(() => {
    let current = 0;
    let lastTime = performance.now();
    let id;

    const tick = (now) => {
      const delta = now - lastTime;
      lastTime = now;

      // Smooth fluid flow pace (takes ~3.5s to fill completely)
      const step = 0.44 + Math.random() * 0.12;
      current = Math.min(100, current + step);
      setProgress(current);

      if (current < 100) {
        id = requestAnimationFrame(tick);
      } else {
        setStage('complete');
        // Gentle bloom pause before exit
        setTimeout(() => {
          setStage('exit');
        }, 500);
        setTimeout(() => {
          setStage('done');
          if (onComplete) onComplete();
        }, 1250);
      }
    };

    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [onComplete]);

  // 2. Real-Time Dynamic Sine-Wave Water Meniscus Simulation
  useEffect(() => {
    let id;

    const animateWaves = () => {
      const elapsed = (performance.now() - startTimeRef.current) * 0.0035;
      
      // Calculate water surface level in 400x400 coordinate space
      // At 0%: level y = 420 (below logo)
      // At 100%: level y = -20 (fully covering logo)
      const currentProg = progress;
      const targetY = 410 - (currentProg / 100) * 430;

      // Organic fluid wave heights
      const w1 = Math.sin(elapsed * 4.5) * 12;
      const w2 = Math.cos(elapsed * 3.8) * 10;
      const w3 = Math.sin(elapsed * 5.2 + 1.2) * 8;

      // Closed liquid body path (fills from bottom y=420 up to the moving wave line)
      const path = `
        M 0 420
        L 0 ${targetY + w1}
        Q 100 ${targetY - 14 + w2}, 200 ${targetY + w3}
        T 400 ${targetY - w1}
        L 400 420
        Z
      `;

      // Surface water meniscus crest line
      const crest = `
        M 0 ${targetY + w1}
        Q 100 ${targetY - 14 + w2}, 200 ${targetY + w3}
        T 400 ${targetY - w1}
      `;

      setWavePath(path);
      setCrestPath(crest);

      id = requestAnimationFrame(animateWaves);
    };

    id = requestAnimationFrame(animateWaves);
    return () => cancelAnimationFrame(id);
  }, [progress]);

  // Keyboard shortcut to skip
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.code === 'Space') {
        setProgress(100);
        setStage('exit');
        setTimeout(() => {
          setStage('done');
          if (onComplete) onComplete();
        }, 500);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage, onComplete]);

  if (stage === 'done') return null;

  return (
    <div
      className="fixed inset-0 z-[999999] pointer-events-auto select-none overflow-hidden bg-white flex items-center justify-center"
      aria-label="VANTA Liquid Water Preloader"
    >
      {/* ========================================================
          WHITE SPLIT SHUTTERS (CURTAINS)
          Positioned at z-0 behind the logo; slides open on exit
          ======================================================== */}
      
      {/* Top Shutter */}
      <div 
        className={`absolute top-0 left-0 right-0 h-1/2 bg-white z-0 transition-transform duration-800 ease-[cubic-bezier(0.85,0,0.15,1)]
          ${stage === 'exit' ? '-translate-y-full shadow-[0_15px_35px_rgba(0,0,0,0.06)]' : 'translate-y-0'}
        `}
      />

      {/* Bottom Shutter */}
      <div 
        className={`absolute bottom-0 left-0 right-0 h-1/2 bg-white z-0 transition-transform duration-800 ease-[cubic-bezier(0.85,0,0.15,1)]
          ${stage === 'exit' ? 'translate-y-full shadow-[0_-15px_35px_rgba(0,0,0,0.06)]' : 'translate-y-0'}
        `}
      />

      {/* Soft Ambient Warm Spotlight */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(255, 107, 0, 0.08) 0%, rgba(255, 160, 0, 0.02) 50%, transparent 70%)',
          filter: 'blur(50px)'
        }}
      />

      {/* ========================================================
          CENTER STAGE: LIQUID WATER FILL ANIMATION
          (NO SIDE TEXT, NO BOTTOM TEXT - PURE FLUID ANIMATION)
          ======================================================== */}
      <div 
        className="relative z-10 w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center transition-all duration-700 ease-out"
        style={{
          transform: stage === 'complete' ? 'scale(1.04)' : stage === 'exit' ? 'scale(1.08)' : 'scale(1)',
          opacity: stage === 'exit' ? 0 : 1
        }}
      >
        <svg 
          viewBox="0 0 400 400" 
          className="w-full h-full select-none pointer-events-none"
        >
          <defs>
            {/* Dynamic Real-time Water Wave Clip Path */}
            <clipPath id="vantaLiquidWaterClip">
              <path d={wavePath} />
            </clipPath>

            <filter id="waterGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ----------------------------------------------------
              LAYER 1: THE FADED LOGO (Base raw silhouette)
              ---------------------------------------------------- */}
          <image 
            href={vantaLogo} 
            x="0" 
            y="0" 
            width="400" 
            height="400" 
            preserveAspectRatio="xMidYMid meet"
            style={{ 
              filter: 'grayscale(100%) opacity(0.2) contrast(1.1) brightness(0.95)' 
            }} 
          />

          {/* ----------------------------------------------------
              LAYER 2: THE COLOR LOGO FILLED BY LIQUID WATER
              (Clipped seamlessly by the rising undulating wave path)
              ---------------------------------------------------- */}
          <g clipPath="url(#vantaLiquidWaterClip)">
            <image 
              href={vantaLogo} 
              x="0" 
              y="0" 
              width="400" 
              height="400" 
              preserveAspectRatio="xMidYMid meet"
              style={{ 
                filter: 'drop-shadow(0 12px 25px rgba(255, 90, 0, 0.35))' 
              }} 
            />
          </g>

          {/* ----------------------------------------------------
              LAYER 3: LIQUID WATER MENISCUS CREST LINE
              (The glowing, rippling wave line at the liquid surface)
              ---------------------------------------------------- */}
          {progress > 1 && progress < 99 && (
            <g>
              {/* Outer Golden-Amber Water Glow */}
              <path
                d={crestPath}
                fill="none"
                stroke="#ff7a00"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.85"
                filter="url(#waterGlow)"
              />
              {/* Core Bright White Fluid Surface Reflection */}
              <path
                d={crestPath}
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.95"
              />
            </g>
          )}
        </svg>

        {/* Completion Liquid Ripple Ring */}
        {stage === 'complete' && (
          <div 
            className="absolute inset-0 rounded-full border border-orange-400/60 pointer-events-none"
            style={{
              animation: 'preloaderShockwave 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
          />
        )}
      </div>
    </div>
  );
}
