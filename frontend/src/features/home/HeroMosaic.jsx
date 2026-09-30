import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Edit3 } from 'lucide-react';
import { heroModel } from '../../assets';
import { settingsApi } from '../../services';
import { useAuth } from '../../context';

export default function HeroMosaic() {
  const [hoveredBox, setHoveredBox] = useState(null);
  const [heroImage, setHeroImage] = useState(heroModel);
  const [badgeText, setBadgeText] = useState('VANTA SIGNATURE FIT');
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.email === 'admin@vanta.com';

  useEffect(() => {
    let isMounted = true;

    // Load initial configured image & badge
    settingsApi.getHeroConfig().then((cfg) => {
      if (isMounted && cfg) {
        if (cfg.heroImage) setHeroImage(cfg.heroImage);
        if (cfg.badgeText) setBadgeText(cfg.badgeText);
      }
    });

    // Listen to live updates from the Admin Customizer
    const handleUpdate = (e) => {
      if (e.detail) {
        if (e.detail.heroImage) setHeroImage(e.detail.heroImage);
        if (e.detail.badgeText) setBadgeText(e.detail.badgeText);
      }
    };

    window.addEventListener('vanta_hero_updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('vanta_hero_updated', handleUpdate);
    };
  }, []);

  return (
    <div className="relative w-full max-w-[580px] lg:max-w-[620px] mx-auto select-none py-4 group">
      {/* Admin Quick Edit Shortcut Button */}
      {isAdmin && (
        <button
          onClick={() => navigate('/admin/hero-banner')}
          className="absolute -top-2 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-neutral-900/90 hover:bg-orange-500 text-white text-xs font-bold font-cute px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-md cursor-pointer border border-white/20"
          title="Customize Hero Photo in Admin Panel"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Customize Hero</span>
        </button>
      )}

      {/* 
        Single unified image frame cut into the exact rounded mosaic boxes using SVG Mask.
        Guarantees:
        1. Only ONE single continuous photo of the model is loaded.
        2. Zero duplicate body parts or head/torso repeats.
        3. All boxes align seamlessly as windows into the single unified frame.
      */}
      <svg 
        viewBox="0 0 600 660" 
        className="w-full h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.08)] overflow-visible"
      >
        <defs>
          {/* Subtle drop shadow filter for floating elements */}
          <filter id="tileShadow" x="-10%" y="-10%" width="120%" height="125%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000000" floodOpacity="0.08" />
          </filter>

          {/* Linear gradient for orange accent tile */}
          <linearGradient id="orangeTileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B00" />
            <stop offset="100%" stopColor="#FFA000" />
          </linearGradient>

          {/* 
            Mosaic Cutout Mask:
            Black = Hidden (the clean gaps between the tiles).
            White = Visible (the rounded window panes cutting the single photo).
          */}
          <mask id="mosaicCutoutMask">
            <rect width="600" height="660" fill="black" />
            
            {/* ROW 1: Head & Top Studio */}
            {/* Box 1 (Center-Left: Head/Hair) */}
            <rect x="200" y="20" width="180" height="120" rx="24" fill="white" />
            {/* Box 2 (Right: Studio light) */}
            <rect x="395" y="20" width="180" height="120" rx="24" fill="white" />

            {/* ROW 2: Face & Upper Torso & Arms */}
            {/* Box 3 (Center-Left: Face, Neck, Orange Sweatshirt Chest) */}
            <rect x="180" y="155" width="225" height="180" rx="28" fill="white" />
            {/* Box 4 (Right: Arm & Sleeve) */}
            <rect x="420" y="155" width="155" height="180" rx="28" fill="white" />

            {/* ROW 3: Wide Lower Torso / Crossed Legs (Pill Tile matching screenshot) */}
            {/* Box 5 (Full horizontal width of crossed legs) */}
            <rect x="90" y="350" width="485" height="120" rx="28" fill="white" />

            {/* ROW 4: Sneakers & Bottom Hem */}
            {/* Box 6 (Left Foot & Sneaker) */}
            <rect x="110" y="485" width="225" height="145" rx="26" fill="white" />
            {/* Box 7 (Right Foot & Sneaker & Floor Reflection) */}
            <rect x="350" y="485" width="225" height="145" rx="26" fill="white" />
          </mask>
        </defs>

        {/* ============================================================== */}
        {/* Floating Decorative Ambient Tiles                              */}
        {/* ============================================================== */}

        {/* 1. Top-Left Floating Grey Card (tilted) */}
        <g className="animate-float-slow" style={{ transformOrigin: '120px 70px' }}>
          <rect
            x="65"
            y="15"
            width="115"
            height="115"
            rx="26"
            fill="#EAECEF"
            filter="url(#tileShadow)"
            transform="rotate(-5 120 70)"
          />
        </g>

        {/* 2. Top Orange Accent Floating Chip */}
        <g className="animate-float-reverse hidden sm:block" style={{ transformOrigin: '30px 45px' }}>
          <rect
            x="10"
            y="20"
            width="50"
            height="62"
            rx="18"
            fill="url(#orangeTileGrad)"
            filter="url(#tileShadow)"
            transform="rotate(12 35 50)"
          />
        </g>

        {/* 3. Mid-Left Floating Soft-Grey Card */}
        <g className="animate-float-slow" style={{ transformOrigin: '110px 240px' }}>
          <rect
            x="45"
            y="180"
            width="120"
            height="115"
            rx="26"
            fill="#ECEEF2"
            filter="url(#tileShadow)"
            transform="rotate(4 105 237)"
          />
        </g>

        {/* 4. Bottom-Left Floating Soft-Grey Card */}
        <g className="animate-float-reverse" style={{ transformOrigin: '65px 560px' }}>
          <rect
            x="10"
            y="510"
            width="115"
            height="95"
            rx="24"
            fill="#ECEEF2"
            filter="url(#tileShadow)"
            transform="rotate(-6 65 560)"
          />
        </g>

        {/* ============================================================== */}
        {/* THE SINGLE MASTER IMAGE (Masked into the unified mosaic frame) */}
        {/* ============================================================== */}
        <image
          href={heroImage || heroModel}
          x="75"
          y="15"
          width="510"
          height="625"
          preserveAspectRatio="xMidYMid slice"
          mask="url(#mosaicCutoutMask)"
          className="transition-transform duration-700 ease-out hover:scale-[1.015]"
          style={{ transformOrigin: '330px 320px' }}
        />

        {/* ============================================================== */}
        {/* Subtle Glass Borders and Hover Interactivity on each cut box    */}
        {/* ============================================================== */}
        
        {/* Box 1: Head */}
        <rect
          x="200"
          y="20"
          width="180"
          height="120"
          rx="24"
          fill="transparent"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth="1.5"
          className="hover:stroke-orange-500/40 transition-colors cursor-pointer"
        />

        {/* Box 2: Right Background */}
        <rect
          x="395"
          y="20"
          width="180"
          height="120"
          rx="24"
          fill="transparent"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth="1.5"
          className="hover:stroke-orange-500/40 transition-colors cursor-pointer"
        />

        {/* Box 3: Face & Torso */}
        <rect
          x="180"
          y="155"
          width="225"
          height="180"
          rx="28"
          fill="transparent"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth="1.5"
          className="hover:stroke-orange-500/40 transition-colors cursor-pointer"
        />

        {/* Box 4: Arm */}
        <rect
          x="420"
          y="155"
          width="155"
          height="180"
          rx="28"
          fill="transparent"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth="1.5"
          className="hover:stroke-orange-500/40 transition-colors cursor-pointer"
        />

        {/* Box 5: Wide Middle / Thighs Bar */}
        <rect
          x="90"
          y="350"
          width="485"
          height="120"
          rx="28"
          fill="transparent"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth="1.5"
          className="hover:stroke-orange-500/40 transition-colors cursor-pointer"
        />

        {/* Box 6: Left Shoe */}
        <rect
          x="110"
          y="485"
          width="225"
          height="145"
          rx="26"
          fill="transparent"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth="1.5"
          className="hover:stroke-orange-500/40 transition-colors cursor-pointer"
        />

        {/* Box 7: Right Shoe & Floor */}
        <rect
          x="350"
          y="485"
          width="225"
          height="145"
          rx="26"
          fill="transparent"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth="1.5"
          className="hover:stroke-orange-500/40 transition-colors cursor-pointer"
        />

        {/* Floating luxury badge over the horizontal bar */}
        <g transform="translate(400, 368)">
          <rect
            width="155"
            height="28"
            rx="14"
            fill="#FF6500"
            filter="url(#tileShadow)"
          />
          <text
            x="77.5"
            y="18"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="10.5"
            fontWeight="800"
            letterSpacing="0.08em"
            fontFamily="Fredoka, Outfit, sans-serif"
          >
            {badgeText}
          </text>
        </g>
      </svg>
    </div>
  );
}
