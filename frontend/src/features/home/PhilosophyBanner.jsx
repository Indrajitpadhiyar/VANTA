import React from 'react';
import { ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { vantaLogo } from '../../assets';

export default function PhilosophyBanner() {
  const perks = [
    {
      logo: vantaLogo,
      title: 'VANTA Custom Textiles',
      desc: '100% sustainable 450 GSM French terry cotton engineered for longevity and effortless drape.'
    },
    {
      icon: Truck,
      title: 'Global Express Dispatch',
      desc: 'Complimentary expedited 48-hour delivery on all collection orders exceeding ₹1,200.'
    },
    {
      icon: RefreshCw,
      title: 'Effortless 30-Day Returns',
      desc: 'Seamless prepaid returns and size exchanges with zero friction guaranteed.'
    },
    {
      icon: ShieldCheck,
      title: 'Authenticity & Craftsmanship',
      desc: 'Each drop is certified with unique serial tagging and verified designer finishing.'
    }
  ];

  return (
    <section id="collection" className="relative w-full max-w-7xl mx-auto px-6 sm:px-10 py-16">
      {/* Editorial Statement Box */}
      <div className="relative rounded-3xl bg-neutral-950 text-white p-8 sm:p-12 lg:p-16 overflow-hidden">
        {/* Glow Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <span className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-3 block">
            Our Philosophy
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.15] mb-6 font-cute">
            Wear your mood. <br />
            Command your space with <span className="text-orange-500">VANTA</span><span className="inline-block w-2.5 h-2.5 bg-red-600 rounded-[2px] ml-1"></span>.
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-10 max-w-xl">
            We reject the disposable fashion cycle. Every silhouette is sculpted 
            with deliberate balance, modern architecture, and luxurious street sensibilities 
            crafted to elevate your everyday reality.
          </p>
        </div>

        {/* Perks Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-white/10">
          {perks.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="flex flex-col">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-orange-400 mb-3 border border-white/10">
                  {p.logo ? (
                    <img src={p.logo} alt="VANTA" className="w-5 h-5 object-contain" />
                  ) : (
                    <Icon className="w-5 h-5 stroke-[2]" />
                  )}
                </div>
                <h4 className="text-sm font-bold text-white mb-1 font-cute">
                  {p.title}
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
