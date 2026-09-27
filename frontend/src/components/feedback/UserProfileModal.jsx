import React from 'react';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  LogOut, 
  Package, 
  MapPin, 
  X, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth, useUI } from '../../context';

export default function UserProfileModal({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const { closeAuth } = useUI();

  if (!isOpen || !user) return null;

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-neutral-950/95 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(255,107,0,0.2)] text-white z-10 overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400">
              Active Member Session
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 mb-6">
          <div className="relative">
            <img
              src={user.avatar?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user.name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-orange-500/50"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-neutral-950 rounded-full" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white truncate font-cute">
                {user.name}
              </h3>
              <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                user.role === 'admin'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-white/10 text-neutral-300'
              }`}>
                {user.role}
              </span>
            </div>
            <p className="text-xs text-neutral-400 truncate mt-0.5">{user.email}</p>
          </div>
        </div>

        {/* Quick Menu Options */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4 text-orange-400" />
              <div>
                <div className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors">
                  My Orders & Shipments
                </div>
                <div className="text-[10px] text-neutral-400">View recent orders and live tracking</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-orange-400" />
              <div>
                <div className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors">
                  Saved Shipping Addresses
                </div>
                <div className="text-[10px] text-neutral-400">1 default delivery address</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              <div>
                <div className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors">
                  Security & Password
                </div>
                <div className="text-[10px] text-neutral-400">Manage account credentials</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
          </div>
        </div>

        {/* Sign Out CTA */}
        <button
          onClick={handleLogout}
          className="w-full py-3 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of VANTA</span>
        </button>
      </div>
    </div>
  );
}
