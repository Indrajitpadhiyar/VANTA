import React, { useState } from 'react';

export default function ProductGallery({ gallery = [], productName = '' }) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  return (
    <div className="flex flex-col">
      {/* Big Main Image Card */}
      <div className="relative w-full aspect-[4/5] bg-neutral-100 rounded-3xl overflow-hidden shadow-sm border border-neutral-200/60 mb-4 group">
        <img 
          src={gallery[activeImageIdx]} 
          alt={productName} 
          className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-105"
        />

        {/* Top Slider Progress Bar Pill */}
        <div className="absolute top-4 inset-x-8 flex justify-center gap-1.5 z-10">
          {gallery.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIdx(idx)}
              className={`h-1 rounded-full transition-all duration-300 ${
                activeImageIdx === idx 
                  ? 'w-10 bg-white/95 shadow-sm' 
                  : 'w-4 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom 3 Angle Thumbnails Row */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {gallery.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImageIdx(idx)}
            className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-200 bg-neutral-100 cursor-pointer
              ${activeImageIdx === idx 
                ? 'border-neutral-950 scale-[1.02] shadow-md ring-2 ring-neutral-950/20' 
                : 'border-transparent opacity-75 hover:opacity-100'
              }
            `}
          >
            <img 
              src={img} 
              alt={`Angle ${idx + 1}`} 
              className="w-full h-full object-cover object-center" 
            />
          </button>
        ))}
      </div>
    </div>
  );
}
