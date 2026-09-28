import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Compass, ShoppingBag, User } from 'lucide-react';
import { vantaLogo } from '../assets';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[85vh] bg-white text-neutral-900 flex flex-col items-center justify-center px-4 py-16 selection:bg-orange-500 selection:text-white font-['Outfit',sans-serif]">
      <div className="max-w-md w-full text-center relative">
        {/* Glow ambient background element */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Icon */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-3xl bg-neutral-950 flex items-center justify-center shadow-xl ring-1 ring-white/20">
          <img src={vantaLogo} alt="VANTA" className="w-8 h-8 object-contain" />
        </div>

        {/* 404 Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-600 text-xs font-bold uppercase tracking-wider mb-4">
          <Compass className="w-3.5 h-3.5" />
          <span>Error 404 • Missing Capsule</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-neutral-950 tracking-tight mb-3">
          Object Not Found
        </h1>

        <p className="text-sm text-neutral-600 mb-8 leading-relaxed max-w-sm mx-auto">
          The runway drop, profile pathway, or archive link you requested does not exist or has been relocated to private vaults.
        </p>

        {/* Quick action buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full py-3.5 px-6 rounded-2xl bg-neutral-950 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-orange-500/25 cursor-pointer flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </button>

          <button
            onClick={() => {
              navigate('/');
              setTimeout(() => {
                const el = document.getElementById('shop');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="w-full py-3 px-6 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold text-xs uppercase tracking-wider transition-all border border-neutral-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-orange-500" />
            <span>Browse Active Drops</span>
          </button>

          <button
            onClick={() => navigate('/profile')}
            className="w-full py-2.5 text-xs text-neutral-500 hover:text-neutral-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            <span>Access Member Concierge</span>
          </button>
        </div>
      </div>
    </div>
  );
}
