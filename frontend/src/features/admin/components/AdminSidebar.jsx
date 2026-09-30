import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Package, 
  ShoppingBag, 
  ArrowUpRight, 
  LogOut, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { vantaLogo } from '../../../assets';
import { useAuth } from '../../../context';

export default function AdminSidebar({ 
  activeSection, 
  onSelectSection, 
  isMobileOpen, 
  setIsMobileOpen 
}) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      description: 'Analytics, revenue & live KPIs',
      icon: LayoutDashboard,
    },
    {
      id: 'add-product',
      label: 'Add Product',
      description: 'Create & publish new runway drops',
      icon: PlusCircle,
    },
    {
      id: 'manage-products',
      label: 'Manage Products',
      description: 'Edit inventory, pricing & status',
      icon: Package,
    },
    {
      id: 'manage-orders',
      label: 'Manage Orders',
      description: 'Fulfill, track & dispatch consignments',
      icon: ShoppingBag,
    },
    {
      id: 'hero-banner',
      label: 'Hero Section',
      description: 'Customize mosaic photo & brand badge',
      icon: Sparkles,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="admin-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-neutral-950 text-white flex flex-col justify-between border-r border-neutral-800/80 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Branding */}
        <div>
          <div className="p-6 border-b border-neutral-800/80 flex items-center justify-between">
            <div 
              onClick={() => navigate('/')} 
              className="flex items-center gap-3 cursor-pointer group"
              title="Return to Storefront"
            >
              <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center p-2 group-hover:border-orange-500 transition-colors shadow-xs">
                <img src={vantaLogo} alt="VANTA" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm tracking-wider uppercase font-cute text-white">
                    VANTA
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block -mt-0.5">
                  Studio Admin
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors lg:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-3.5 py-6 space-y-1.5">
            <div className="px-3 pb-2 text-[10px] uppercase font-bold tracking-wider text-neutral-300">
              Operations Console
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  id={`admin-nav-${item.id}`}
                  onClick={() => {
                    onSelectSection(item.id);
                    if (setIsMobileOpen) setIsMobileOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-left transition-all duration-200 cursor-pointer group ${
                    isActive
                      ? 'bg-orange-500 text-white font-bold shadow-lg shadow-orange-500/25 ring-1 ring-orange-400/40'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900/90'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl transition-colors ${
                      isActive 
                        ? 'bg-white/15 text-white' 
                        : 'bg-neutral-900 text-neutral-400 group-hover:text-orange-400 group-hover:bg-neutral-800'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className={`text-xs font-bold font-cute ${isActive ? 'text-white' : 'text-neutral-200 group-hover:text-white'}`}>
                        {item.label}
                      </div>
                      <div className={`text-[10px] line-clamp-1 ${isActive ? 'text-orange-100' : 'text-neutral-300'}`}>
                        {item.description}
                      </div>
                    </div>
                  </div>

                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                    isActive ? 'text-white translate-x-0.5' : 'text-neutral-600 group-hover:text-neutral-400'
                  }`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Section: Storefront Link & Admin Profile */}
        <div className="p-4 border-t border-neutral-800/80 space-y-3">
          {/* Quick link to Storefront */}
          <button
            onClick={() => navigate('/')}
            className="w-full py-2.5 px-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800/90 border border-neutral-800 hover:border-neutral-700 text-xs font-semibold text-neutral-300 hover:text-white transition-all flex items-center justify-between cursor-pointer group"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>View Live Storefront</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          {/* Admin Identity Card */}
          <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate font-cute">
                  {user?.name || 'Studio Administrator'}
                </div>
                <div className="text-[10px] text-neutral-300 truncate">
                  {user?.email || 'admin@vanta.com'}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
              title="Sign Out of Admin Console"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
