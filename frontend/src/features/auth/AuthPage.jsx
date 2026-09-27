import React from 'react';
import { ArrowLeft, Sparkles, ShieldCheck, Flame, Compass } from 'lucide-react';
import { useUI, useAuth } from '../../context';
import AuthForm from '../../components/feedback/AuthForm';

export default function AuthPage() {
  const { goHome } = useUI();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-between selection:bg-orange-500 selection:text-white relative overflow-hidden">
      {/* Background Ambient Orbs */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-orange-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Top Header Bar */}
      <header className="relative z-10 px-6 sm:px-12 py-6 flex items-center justify-between border-b border-white/10 backdrop-blur-xl bg-neutral-950/60">
        <button
          onClick={goHome}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-400 hover:text-white transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-orange-400" />
          <span>Back to Storefront</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
          <span className="text-sm font-black tracking-widest uppercase text-white font-cute">
            VANTA ARCHIVE
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>256-bit Encrypted Portal</span>
        </div>
      </header>

      {/* Main Content Split Grid */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Visual Brand Storytelling (Hidden on mobile) */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-between p-8 rounded-3xl bg-neutral-900/40 border border-white/10 backdrop-blur-2xl relative overflow-hidden h-[620px]">
            {/* Background Texture & Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-neutral-950 via-neutral-900/60 to-orange-950/30" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Top Badge */}
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-orange-500/15 border border-orange-500/30 text-orange-400">
                <Flame className="w-3.5 h-3.5" />
                Drop Season 2026
              </span>
              <h2 className="text-4xl font-extrabold tracking-tight text-white mt-4 font-cute leading-tight">
                Crafted for the modern streetwear vanguard.
              </h2>
              <p className="text-sm text-neutral-400 mt-3 leading-relaxed">
                Unlock exclusive early-access allocations, real-time logistics tracking, private archive reservations, and personalized drops.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="relative z-10 space-y-3 my-6">
              {[
                { title: 'Global Fast Courier', desc: 'Complimentary expedited delivery on all member orders' },
                { title: 'Private Vault Releases', desc: '48-hour headstart before public drops sell out' },
                { title: 'Verified Authentic', desc: 'Every piece is sequentially numbered with NFC certificates' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">{item.title}</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Quote / Assurance */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
              <span>VANTA Design Studios — Milan / Tokyo</span>
              <span className="text-orange-400 font-semibold font-mono">EST. 2026</span>
            </div>
          </div>

          {/* Right Column: Interactive Login / Register Form */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md bg-neutral-900/80 border border-white/15 rounded-3xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(255,107,0,0.15)] backdrop-blur-2xl relative">
              {/* Corner Ambient Pip */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/15 rounded-full blur-2xl pointer-events-none" />

              <div className="mb-6">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-400">
                  Authentication Portal
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-cute mt-1">
                  Welcome to VANTA
                </h1>
                <p className="text-xs text-neutral-400 mt-1">
                  Sign in or create an account to manage your profile and orders.
                </p>
              </div>

              {/* Shared Auth Form */}
              <AuthForm onSuccess={goHome} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 text-center text-xs text-neutral-500 border-t border-white/10 bg-neutral-950/80">
        &copy; {new Date().getFullYear()} VANTA Apparel Group. All Rights Reserved. Pure Streetwear Architecture.
      </footer>
    </div>
  );
}
