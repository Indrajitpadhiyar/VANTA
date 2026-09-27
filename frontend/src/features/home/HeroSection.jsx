import React from "react";
import { ArrowUpRight } from "lucide-react";
import HeroMosaic from "./HeroMosaic";

export default function HeroSection({ onExploreClick }) {
  const handleScrollToShop = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      const el = document.getElementById('shop');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative w-full max-w-7xl mx-auto px-6 sm:px-10 pt-4 pb-16 lg:py-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Hero Content */}
        <div className="lg:col-span-6 flex flex-col justify-center z-10">
          {/* Badge: Overlapping circles + Collections tag */}
          <div className="flex items-center gap-3 mb-6 sm:mb-8 group cursor-pointer w-fit">
            <div className="relative flex items-center">
              {/* Left soft-grey circle */}
              <span className="w-8 h-8 rounded-full bg-neutral-200/90 border border-white/60 shadow-sm" />
              {/* Overlapping Orange circle */}
              <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 -ml-4 shadow-md transition-transform duration-300 group-hover:scale-110" />
            </div>
            <span className="text-[15px] sm:text-base font-semibold text-neutral-800 tracking-tight flex items-center gap-1.5 font-cute">
              New Spring Collections
            </span>
          </div>

          {/* Heading */}
          <div className="relative">
            {/* Floating orange pill accent badge as seen in screenshot */}
            <div className="absolute -top-3 right-8 sm:right-24 w-11 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl rotate-6 shadow-md pointer-events-none animate-float-slow hidden sm:block" />

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-extrabold text-neutral-950 tracking-[-0.03em] leading-[1.04] mb-7 font-cute">
              Reflect Who <br />
              You Are with <br />
              <span className="text-neutral-950">Our </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 relative inline-block">
                Style
                {/* Subtle curve underline accent */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-orange-500/40"
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,15 Q50,0 100,15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
          </div>

          {/* Description */}
          <p className="text-neutral-500 text-sm sm:text-base leading-relaxed max-w-lg mb-8 font-normal font-sans">
            The power of a great outfit is impossible to overstate. At its best,
            fashion has the ability to transform your mood, identity, and, of
            course, your look. It can be fun, refreshing, and purposeful.
          </p>

          {/* Circular CTA Button (Exact match with screenshot) */}
          <div className="flex items-center gap-4 mb-16">
            <button
              onClick={handleScrollToShop}
              aria-label="Explore Collection"
              className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-neutral-950 text-white shadow-lg hover:shadow-2xl hover:shadow-orange-500/20 hover:scale-105 transition-all duration-300 active:scale-95 cursor-pointer"
            >
              <ArrowUpRight className="w-6 h-6 stroke-[2.2] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />

              {/* Expandable tooltip on hover */}
              <span className="absolute left-16 px-3.5 py-1.5 bg-neutral-900 text-white text-xs font-medium rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md font-cute">
                Discover Lookbook
              </span>
            </button>

            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-cute">
              Explore 2026 Lookbook
            </span>
          </div>

          {/* Brand Partners Strip */}
          <div className="pt-6 border-t border-neutral-100">
            <p className="text-xs font-semibold tracking-wider text-neutral-400 uppercase mb-4 font-cute">
              Our Brand Partners
            </p>
            <div className="flex flex-wrap items-center gap-7 sm:gap-10 text-neutral-800 opacity-80 hover:opacity-100 transition-opacity">
              {/* adidas */}
              <div className="flex items-center gap-1.5 font-bold tracking-tighter text-xl text-neutral-900 group cursor-pointer hover:text-black">
                <svg className="w-7 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C10.5 4.5 9 8 9 11c0 4 2 6 3 7 1-1 3-3 3-7 0-3-1.5-6.5-3-9zm-6 5C4.5 9 3 12 3 14c0 3 1.5 5 2.5 5.5 1-.5 2.5-2.5 2.5-5.5 0-2-1.5-5-2-7zm12 0c-.5 2-2 5-2 7 0 3 1.5 5 2.5 5.5 1-.5 2.5-2.5 2.5-5.5 0-2-1.5-5-3-7z" />
                </svg>
                <span className="text-sm font-black lowercase tracking-tighter">
                  adidas
                </span>
              </div>

              {/* Juicy Couture */}
              <div className="font-serif italic font-bold tracking-tight text-lg text-neutral-900 hover:text-black cursor-pointer">
                Juicy Couture
              </div>

              {/* LEVI'S */}
              <div className="inline-flex items-center justify-center bg-red-600 text-white font-black px-2.5 py-0.5 rounded-sm text-xs tracking-widest uppercase cursor-pointer hover:bg-red-700 transition-colors">
                LEVI'S
              </div>

              {/* NLY accessories */}
              <div className="leading-tight text-neutral-900 hover:text-black cursor-pointer">
                <div className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
                  NLY
                </div>
                <div className="text-sm font-semibold tracking-tight">
                  accessories
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sliced Mosaic Hero Art */}
        <div className="lg:col-span-6 flex justify-center items-center">
          <HeroMosaic />
        </div>
      </div>
    </section>
  );
}
