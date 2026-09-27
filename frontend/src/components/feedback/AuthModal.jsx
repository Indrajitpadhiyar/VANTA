import React, { useEffect } from 'react';
import { X, Sparkles, Lock } from 'lucide-react';
import { useUI } from '../../context';
import AuthForm from './AuthForm';

export default function AuthModal() {
  const { isAuthOpen, closeAuth } = useUI();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeAuth();
    };
    if (isAuthOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAuthOpen, closeAuth]);

  if (!isAuthOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl animate-fade-in">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={closeAuth} />

      {/* Modal Box */}
      <div className="relative w-full max-w-md bg-neutral-950/95 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(255,107,0,0.15)] text-white z-10 overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-orange-400">
              VANTA ACCESS
            </span>
          </div>

          <button
            onClick={closeAuth}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <div className="mb-6 relative z-10">
          <h3 className="text-2xl font-bold tracking-tight text-white font-cute">
            Exclusive Member Portal
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Access limited drops, tailored sizing, order tracking, and private archives.
          </p>
        </div>

        {/* Reusable Auth Form */}
        <div className="relative z-10">
          <AuthForm onSuccess={closeAuth} />
        </div>
      </div>
    </div>
  );
}
