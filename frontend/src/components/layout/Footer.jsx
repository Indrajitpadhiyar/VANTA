import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { vantaLogo } from '../../assets';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-neutral-950 text-white pt-20 pb-12 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Top Newsletter & Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10 items-start">
          
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 mb-4">
              <img src={vantaLogo} alt="VANTA Logo" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-cute flex items-center">
                VANTA<span className="inline-block w-2 h-2 bg-red-600 rounded-[2px] ml-1"></span>
              </span>
            </div>
            <p className="text-neutral-400 text-sm max-w-md leading-relaxed font-sans">
              Redefining contemporary streetwear through architectural silhouettes, 
              heavyweight textiles, and vibrant unapologetic style.
            </p>
          </div>

          <div className="lg:col-span-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-300 mb-2 font-cute">
              Join the VANTA Inner Circle
            </h4>
            <p className="text-xs text-neutral-400 mb-4 font-sans">
              Unlock private archive access, secret capsule drop alerts, and 15% off your premier order.
            </p>

            <form onSubmit={handleSubmit} className="flex gap-2 max-w-md">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-2xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center gap-1.5 active:scale-95"
              >
                {subscribed ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    Joined!
                  </>
                ) : (
                  <>
                    Join
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Links Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 text-sm border-b border-white/10">
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-4 font-cute">
              Collections
            </h5>
            <ul className="space-y-2.5 text-neutral-400 text-xs">
              <li><a href="#shop" className="hover:text-white transition-colors">Spring 2026 Lookbook</a></li>
              <li><a href="#shop" className="hover:text-white transition-colors">Heavyweight Hoodies</a></li>
              <li><a href="#shop" className="hover:text-white transition-colors">Tracksuit Coordinates</a></li>
              <li><a href="#shop" className="hover:text-white transition-colors">Chunky Court Footwear</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-4 font-cute">
              Brand
            </h5>
            <ul className="space-y-2.5 text-neutral-400 text-xs">
              <li><a href="#home" className="hover:text-white transition-colors">Our Philosophy</a></li>
              <li><a href="#home" className="hover:text-white transition-colors">Sustainable Craft</a></li>
              <li><a href="#home" className="hover:text-white transition-colors">Brand Partners</a></li>
              <li><a href="#home" className="hover:text-white transition-colors">Careers at VANTA</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-4 font-cute">
              Client Support
            </h5>
            <ul className="space-y-2.5 text-neutral-400 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Global Tracking</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Complimentary Exchanges</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Size & Fit Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Concierge Desk</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-4 font-cute">
              Connect
            </h5>
            <div className="flex gap-3 text-neutral-400 mb-4">
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" aria-label="X / Twitter" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
            <p className="text-[11px] text-neutral-500">
              Worldwide Shipping Available. Designed with passion for bold aesthetics.
            </p>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© 2026 VANTA Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-neutral-400">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-400">Terms of Service</a>
            <a href="#" className="hover:text-neutral-400">Security</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
