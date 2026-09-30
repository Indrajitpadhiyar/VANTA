import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Package, 
  User, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  Crown, 
  LogOut, 
  Truck, 
  CheckCircle2, 
  Download, 
  Sparkles, 
  AlertCircle,
  Check,
  Sliders,
  ShoppingCart,
  Phone,
  Mail,
  ChevronRight,
  ShoppingBag,
  Plus
} from 'lucide-react';
import { useAuth, useUI, useCart } from '../../context';
import { vantaLogo } from '../../assets';
import { ordersApi } from '../../services';

export default function ProfileDetailsPage() {
  const { tab: urlTab } = useParams();
  const navigate = useNavigate();
  const { user, token, isAuthenticated, logout, googleLogin, updateProfile } = useAuth();
  const { goHome, activeProfileTab, setActiveProfileTab, openAuth, goToAdminPage } = useUI();
  const { cart, totalCount, openCart } = useCart();

  // Active section controlled by Dynamic Island: 'orders' | 'details' | 'cart' | 'wallet'
  const [activeTab, setActiveTab] = useState(urlTab || activeProfileTab || 'orders');
  const [isIslandHovered, setIsIslandHovered] = useState(false);

  // Synchronize directly with external navigation / URL parameter changes
  useEffect(() => {
    if (urlTab) {
      setActiveTab(urlTab);
      setActiveProfileTab(urlTab);
    } else if (activeProfileTab) {
      setActiveTab(activeProfileTab);
    }
  }, [urlTab, activeProfileTab]);

  const switchTab = (t) => {
    setActiveTab(t);
    setActiveProfileTab(t);
    navigate(`/profile/${t}`);
  };

  // Form states for personal info - dynamically populated from authenticated user
  const [name, setName] = useState(user?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || user?.phone || '');
  const [topSize, setTopSize] = useState(user?.preferences?.topSize || 'L');
  const [shoeSize, setShoeSize] = useState(user?.preferences?.shoeSize || 'US 10.5');
  const [profileSaved, setProfileSaved] = useState(false);

  // Real orders array fetched from backend
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Update local form state when user changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhoneNumber(user.phoneNumber || user.phone || '');
    }
  }, [user]);

  // Fetch genuine orders from backend if authenticated
  useEffect(() => {
    if (!token && !user) return;
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const res = await ordersApi.getMyOrders();
        if (res.success && Array.isArray(res.data)) {
          setOrders(res.data);
        }
      } catch (err) {
        // Silently keep orders as empty array if endpoint or network unavailable
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [token, user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      if (updateProfile) {
        await updateProfile({ name, phoneNumber });
      }
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  // If visitor is guest, show clean light-theme portal
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between selection:bg-orange-500 selection:text-white relative pt-12 font-['Outfit',sans-serif]">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center p-8 sm:p-10 rounded-3xl bg-neutral-50/80 border border-neutral-200 shadow-sm relative">
            <div className="w-16 h-16 mx-auto rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-500 mb-4 shadow-xs">
              <Crown className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Member Portal Restricted</h2>
            <p className="text-xs text-neutral-600 mb-6 leading-relaxed">
              Sign in or create an account to access order tracking, personal info, saved delivery addresses, and VIP concierge drops.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => openAuth('login')}
                className="w-full py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all shadow-md shadow-orange-500/20 cursor-pointer"
              >
                Sign In to Member Profile
              </button>

              <button
                onClick={() => googleLogin()}
                className="w-full py-3 rounded-2xl bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-800 font-medium text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Continue with Google 1-Click</span>
              </button>

              <button
                onClick={goHome}
                className="w-full py-2.5 text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Back to Storefront
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentUser = user || {};
  const isAdmin = currentUser.role === 'admin' || currentUser.email === 'admin@vanta.com';
  const memberId = currentUser._id ? `#VNT-${currentUser._id.slice(-6).toUpperCase()}` : '#VNT-MEMBER';
  const vaultPoints = currentUser.vaultPoints || currentUser.points || 0;

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between selection:bg-orange-500 selection:text-white relative overflow-x-hidden font-['Outfit',sans-serif]">
      
      {/* ======================================================== */}
      {/* 1. DYNAMIC ISLAND FOR PROFILE PAGE                       */}
      {/* (SHOWS ONLY ICONS; EXPANDS & SHOWS NAMES ON HOVER)       */}
      {/* ======================================================== */}
      <div className="sticky top-4 z-50 flex justify-center px-4 pointer-events-auto">
        <nav
          id="profile-dynamic-island"
          onMouseEnter={() => setIsIslandHovered(true)}
          onMouseLeave={() => setIsIslandHovered(false)}
          className={`relative flex items-center rounded-full 
            bg-neutral-950/95 backdrop-blur-2xl border border-white/20
            shadow-[0_20px_50px_rgba(0,0,0,0.35),0_0_20px_rgba(255,107,0,0.15)]
            transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${isIslandHovered ? 'px-4 py-2 scale-100' : 'px-3 py-1.5 scale-95 hover:scale-100'}
          `}
        >
          {/* Logo Button (takes user to Storefront) */}
          <button
            onClick={goHome}
            className="flex items-center gap-1.5 pr-2.5 border-r border-white/15 shrink-0 focus:outline-none cursor-pointer"
            title="Return to Storefront"
          >
            <img src={vantaLogo} alt="VANTA" className="w-5 h-5 object-contain" />
            <span className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] text-[11px] font-bold tracking-wider uppercase text-white whitespace-nowrap font-cute ${
              isIslandHovered ? 'max-w-[70px] opacity-100 ml-1' : 'max-w-0 opacity-0 ml-0 pointer-events-none'
            }`}>
              VANTA
            </span>
          </button>

          {/* DYNAMIC ISLAND NAVIGATION ITEMS */}
          <div className="flex items-center gap-1 sm:gap-1.5 pl-1.5">
            {/* 1. PRODUCT TRACKING */}
            <button
              onClick={() => switchTab('orders')}
              className={`relative flex items-center rounded-full text-white/85 hover:text-white transition-all duration-300 cursor-pointer
                ${isIslandHovered ? 'px-3 py-1.5' : 'p-2'}
                ${activeTab === 'orders' ? 'bg-orange-500 text-white font-bold shadow-md shadow-orange-500/30' : 'hover:bg-white/10'}
              `}
              title="Product Tracking & Live Orders"
            >
              <Truck className={`w-4 h-4 transition-transform duration-300 ${activeTab === 'orders' ? 'text-white' : 'text-orange-400'}`} />
              <span className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] text-xs font-semibold whitespace-nowrap ${
                isIslandHovered ? 'max-w-[130px] opacity-100 ml-2' : 'max-w-0 opacity-0 ml-0 pointer-events-none'
              }`}>
                Product Tracking
              </span>
            </button>

            {/* 2. PERSONAL INFO */}
            <button
              onClick={() => switchTab('details')}
              className={`relative flex items-center rounded-full text-white/85 hover:text-white transition-all duration-300 cursor-pointer
                ${isIslandHovered ? 'px-3 py-1.5' : 'p-2'}
                ${activeTab === 'details' ? 'bg-orange-500 text-white font-bold shadow-md shadow-orange-500/30' : 'hover:bg-white/10'}
              `}
              title="Personal Information"
            >
              <User className={`w-4 h-4 transition-transform duration-300 ${activeTab === 'details' ? 'text-white' : 'text-orange-400'}`} />
              <span className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] text-xs font-semibold whitespace-nowrap ${
                isIslandHovered ? 'max-w-[110px] opacity-100 ml-2' : 'max-w-0 opacity-0 ml-0 pointer-events-none'
              }`}>
                Personal Info
              </span>
            </button>

            {/* 3. CART SECTION */}
            <button
              onClick={() => {
                switchTab('cart');
                openCart();
              }}
              className={`relative flex items-center rounded-full text-white/85 hover:text-white transition-all duration-300 cursor-pointer
                ${isIslandHovered ? 'px-3 py-1.5' : 'p-2'}
                ${activeTab === 'cart' ? 'bg-orange-500 text-white font-bold shadow-md shadow-orange-500/30' : 'hover:bg-white/10'}
              `}
              title="Cart Section"
            >
              <div className="relative flex items-center justify-center">
                <ShoppingCart className={`w-4 h-4 transition-transform duration-300 ${activeTab === 'cart' ? 'text-white' : 'text-orange-400'}`} />
                {totalCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] flex items-center justify-center text-[9px] font-extrabold text-white bg-orange-600 rounded-full px-1 shadow-sm">
                    {totalCount}
                  </span>
                )}
              </div>
              <span className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] text-xs font-semibold whitespace-nowrap ${
                isIslandHovered ? 'max-w-[100px] opacity-100 ml-2' : 'max-w-0 opacity-0 ml-0 pointer-events-none'
              }`}>
                Cart Section
              </span>
            </button>

            {/* 4. PAYMENT & VAULT */}
            <button
              onClick={() => switchTab('wallet')}
              className={`relative flex items-center rounded-full text-white/85 hover:text-white transition-all duration-300 cursor-pointer
                ${isIslandHovered ? 'px-3 py-1.5' : 'p-2'}
                ${activeTab === 'wallet' ? 'bg-orange-500 text-white font-bold shadow-md shadow-orange-500/30' : 'hover:bg-white/10'}
              `}
              title="Payment & Vault"
            >
              <CreditCard className={`w-4 h-4 transition-transform duration-300 ${activeTab === 'wallet' ? 'text-white' : 'text-orange-400'}`} />
              <span className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] text-xs font-semibold whitespace-nowrap ${
                isIslandHovered ? 'max-w-[80px] opacity-100 ml-2' : 'max-w-0 opacity-0 ml-0 pointer-events-none'
              }`}>
                Payment
              </span>
            </button>

            {/* 5. STOREFRONT DROPS */}
            <button
              onClick={goHome}
              className={`relative flex items-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 cursor-pointer
                ${isIslandHovered ? 'px-3 py-1.5' : 'p-2'}
              `}
              title="Return to Storefront"
            >
              <ShoppingBag className="w-4 h-4 text-orange-400" />
              <span className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] text-xs font-semibold whitespace-nowrap ${
                isIslandHovered ? 'max-w-[90px] opacity-100 ml-2' : 'max-w-0 opacity-0 ml-0 pointer-events-none'
              }`}>
                Storefront
              </span>
            </button>

            {/* ADMIN CONSOLE SHORTCUT (IF ADMIN) */}
            {isAdmin && (
              <button
                onClick={goToAdminPage}
                className={`relative flex items-center rounded-full transition-all duration-300 cursor-pointer
                  ${isIslandHovered ? 'px-3 py-1.5' : 'p-2'}
                  bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500 hover:text-white
                `}
                title="Studio Admin Dashboard"
              >
                <Sliders className="w-4 h-4 text-orange-400" />
                <span className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
                  isIslandHovered ? 'max-w-[80px] opacity-100 ml-2' : 'max-w-0 opacity-0 ml-0 pointer-events-none'
                }`}>
                  Admin
                </span>
              </button>
            )}

            {/* LOGOUT */}
            <button
              onClick={() => {
                logout();
                goHome();
              }}
              className="p-2 rounded-full text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Glossy Liquid Glass Highlight */}
          <div className="absolute top-0 inset-x-6 h-[1px] bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none rounded-full" />
        </nav>
      </div>

      {/* 2. MAIN PROFILE VIEWPORT IN 100% WHITE THEME */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
        
        {/* HERO IDENTITY BANNER IN WHITE THEME */}
        <div className="relative p-6 sm:p-8 rounded-3xl bg-neutral-50/70 border border-neutral-200 shadow-xs mb-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-orange-500/10 via-amber-500/5 to-transparent pointer-events-none rounded-full" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            {/* User Info */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="relative shrink-0">
                {currentUser.avatar?.url ? (
                  <img
                    src={currentUser.avatar.url}
                    alt={currentUser.name || 'Member'}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-orange-500/60 shadow-sm"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-neutral-900 text-white font-bold text-xl sm:text-2xl flex items-center justify-center ring-2 ring-orange-500/60 shadow-sm">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'V'}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-xs" />
              </div>

              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                    {currentUser.name || 'Verified Member'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500 text-white shadow-xs">
                    {currentUser.role === 'admin' ? 'Studio Director' : 'VIP Member'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                  {currentUser.email} • Member ID: <span className="font-mono text-orange-600 font-bold">{memberId}</span>
                </p>
                <div className="flex items-center gap-4 mt-2.5 text-xs text-neutral-600">
                  <span className="flex items-center gap-1 text-emerald-600 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Identity Verified
                  </span>
                  <span>•</span>
                  <span>Active Session</span>
                </div>
              </div>
            </div>

            {/* Metrics Chips */}
            <div className="grid grid-cols-3 gap-3 shrink-0">
              <div className="p-3.5 rounded-2xl bg-white border border-neutral-200 text-center shadow-xs">
                <span className="block text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                  Total Orders
                </span>
                <span className="text-lg sm:text-2xl font-black text-neutral-900 mt-0.5 block">
                  {orders.length}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-neutral-200 text-center shadow-xs">
                <span className="block text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                  Vault Points
                </span>
                <span className="text-lg sm:text-2xl font-black text-orange-600 mt-0.5 block">
                  {vaultPoints}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-neutral-200 text-center shadow-xs">
                <span className="block text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                  Cart Items
                </span>
                <span className="text-lg sm:text-2xl font-black text-neutral-900 mt-0.5 block">
                  {totalCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: PRODUCT TRACKING & SHIPMENTS */}
        {(activeTab === 'orders' || !activeTab) && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-neutral-200 gap-2">
              <div>
                <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-orange-500" />
                  <span>Product Tracking & Shipments</span>
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Real-time parcel logistics, delivery checkpoints, and certified invoices.
                </p>
              </div>

              <span className="text-xs text-neutral-500 font-semibold bg-neutral-100 px-3 py-1.5 rounded-full border border-neutral-200">
                {orders.length} Consignments
              </span>
            </div>

            {ordersLoading ? (
              <div className="p-12 text-center rounded-3xl bg-neutral-50/80 border border-neutral-200">
                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-neutral-500">Checking your recent orders...</p>
              </div>
            ) : orders.length === 0 ? (
              /* REAL EMPTY STATE: NO ORDERS PLACED YET */
              <div className="p-12 text-center rounded-3xl bg-neutral-50/80 border border-neutral-200">
                <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-neutral-900">No Orders Placed Yet</h3>
                <p className="text-xs text-neutral-500 mt-1 mb-5 max-w-sm mx-auto">
                  When you purchase limited drops from the store, live tracking and consignment updates will be displayed here.
                </p>
                <button
                  onClick={goHome}
                  className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs inline-flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Explore Storefront Drops</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order._id || order.id}
                    className="rounded-3xl bg-white border border-neutral-200 p-6 sm:p-8 shadow-sm transition-all hover:shadow-md"
                  >
                    {/* Order Top Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-base sm:text-lg font-black text-neutral-900 tracking-wide font-mono">
                            {order.orderNumber || order.id || order._id}
                          </span>
                          <span
                            className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 ${
                              order.status === 'In Transit'
                                ? 'bg-amber-50 border border-amber-200 text-amber-700'
                                : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                            {order.status || 'Processing'}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 mt-1">
                          Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : (order.date || 'Recent')} 
                          {order.carrier && ` • Carrier: ${order.carrier}`}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => alert(`Downloading Certified Tax Invoice for ${order.orderNumber || order.id || order._id}...`)}
                          className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-xs font-semibold text-neutral-700 hover:text-neutral-900 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Invoice</span>
                        </button>

                        <span className="text-lg font-black text-neutral-900">
                          ₹{(order.totalPrice || order.total || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Order Line Items */}
                    <div className="pt-6 space-y-3">
                      {(order.orderItems || order.items || []).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80"
                        >
                          <div className="flex items-center gap-4">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-14 h-14 rounded-xl object-cover shrink-0 ring-1 ring-neutral-200"
                              />
                            )}
                            <div>
                              <h4 className="text-sm font-bold text-neutral-900">{item.name}</h4>
                              <p className="text-xs text-neutral-600 mt-0.5">
                                Size: <span className="text-neutral-900 font-semibold">{item.size || 'Standard'}</span> • Qty: {item.quantity || item.qty || 1}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-bold text-neutral-900">₹{(item.price || 0).toFixed(2)}</span>
                            <span className="block text-[10px] text-emerald-600 font-bold uppercase">Confirmed Item</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: PERSONAL INFORMATION */}
        {activeTab === 'details' && (
          <div className="space-y-6 animate-fade-in max-w-3xl">
            <div className="pb-2 border-b border-neutral-200">
              <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                <User className="w-5 h-5 text-orange-500" />
                <span>Personal Information</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Update client identity, contact channels, and customized sizing preferences.
              </p>
            </div>

            {profileSaved && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Personal information updated successfully across all servers.</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-neutral-700 mb-2">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    placeholder="Enter your full name"
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-neutral-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm text-neutral-900 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-neutral-700 mb-2">
                    Email Address (Registered)
                  </label>
                  <input
                    type="email"
                    value={currentUser.email || ''}
                    disabled
                    className="w-full px-4 py-3 rounded-2xl bg-neutral-100 border border-neutral-200 text-neutral-500 text-sm cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-neutral-700 mb-2">
                    Direct Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    placeholder="Enter contact number"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-neutral-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm text-neutral-900 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-neutral-700 mb-2">
                    Role & Account Type
                  </label>
                  <input
                    type="text"
                    value={currentUser.role === 'admin' ? 'Studio Administrator' : 'Standard Customer'}
                    disabled
                    className="w-full px-4 py-3 rounded-2xl bg-neutral-100 border border-neutral-200 text-neutral-500 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Sizing Preferences */}
              <div className="pt-6 border-t border-neutral-200">
                <h4 className="text-xs uppercase tracking-wider font-bold text-orange-600 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Tailored Sizing Fit (Auto-Applied to Drops)
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] text-neutral-600 mb-1 font-semibold">Tops & Hoodies</label>
                    <select
                      value={topSize}
                      onChange={(e) => setTopSize(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-900 focus:border-orange-500 outline-none"
                    >
                      <option value="S">S (Small - Fitted)</option>
                      <option value="M">M (Medium - Standard)</option>
                      <option value="L">L (Large - Oversized Boxy)</option>
                      <option value="XL">XL (Extra Large)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-600 mb-1 font-semibold">Sneakers / Footwear</label>
                    <select
                      value={shoeSize}
                      onChange={(e) => setShoeSize(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-900 focus:border-orange-500 outline-none"
                    >
                      <option value="US 9">US 9.0 (EU 42)</option>
                      <option value="US 9.5">US 9.5 (EU 43)</option>
                      <option value="US 10">US 10.0 (EU 44)</option>
                      <option value="US 10.5">US 10.5 (EU 44.5)</option>
                      <option value="US 11">US 11.0 (EU 45)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="py-3.5 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm tracking-wide transition-all shadow-md shadow-orange-500/20 cursor-pointer"
              >
                Save Personal Information
              </button>
            </form>
          </div>
        )}

        {/* SECTION 3: CART SECTION */}
        {activeTab === 'cart' && (
          <div className="space-y-6 animate-fade-in max-w-3xl">
            <div className="pb-2 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-orange-500" />
                  <span>Cart Section</span>
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Review selected capsule drops, sizes, and checkout preparation.
                </p>
              </div>

              <button
                onClick={openCart}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Open Cart Drawer</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-neutral-50 border border-neutral-200">
                <ShoppingCart className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-neutral-900">Your Cart is Currently Empty</h3>
                <p className="text-xs text-neutral-500 mt-1 mb-6">Explore the latest drops in the storefront and add your favorite pieces.</p>
                <button
                  onClick={goHome}
                  className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Explore Drops
                </button>
              </div>
            ) : (
              <div className="rounded-3xl bg-white border border-neutral-200 p-6 sm:p-8 shadow-sm space-y-4">
                <div className="divide-y divide-neutral-200">
                  {cart.map((item, idx) => (
                    <div key={idx} className="py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover ring-1 ring-neutral-200" />
                        <div>
                          <h4 className="text-sm font-bold text-neutral-900">{item.name}</h4>
                          <p className="text-xs text-neutral-500">Size: {item.size || 'L'} • Qty: {item.quantity || 1}</p>
                        </div>
                      </div>
                      <span className="font-bold text-sm text-neutral-900">₹{(item.price * (item.quantity || 1)).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-neutral-200 flex justify-end">
                  <button
                    onClick={openCart}
                    className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-orange-500/20 cursor-pointer"
                  >
                    Proceed to Fast Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 4: PAYMENT & DIGITAL VAULT */}
        {activeTab === 'wallet' && (
          <div className="space-y-6 animate-fade-in max-w-4xl">
            <div className="pb-2 border-b border-neutral-200">
              <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-orange-500" />
                <span>Payment & Digital Vault</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Saved luxury payment cards, instant checkout credentials, and vault credits.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Payment Methods (Real Empty State) */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm flex flex-col justify-between min-h-[220px]">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                      Saved Payment Methods
                    </span>
                    <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-full">
                      Zero Saved
                    </span>
                  </div>

                  <div className="py-6 text-center">
                    <CreditCard className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-neutral-800">No Cards Saved</h4>
                    <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                      Credit and debit cards securely saved during checkout will be vaulted here for 1-click ordering.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-200 mt-2">
                  <button
                    onClick={() => alert('Cards are securely added during checkout with 256-bit encryption.')}
                    className="w-full py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-neutral-800 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Payment Method</span>
                  </button>
                </div>
              </div>

              {/* Vault Credits Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                      Vault Store Credit
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      Live Balance
                    </span>
                  </div>

                  <div className="text-3xl sm:text-4xl font-black text-neutral-900">
                    ₹{(vaultPoints * 0.01).toFixed(2)} <span className="text-xs text-neutral-500 font-normal">({vaultPoints} PTS)</span>
                  </div>

                  <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                    Earn 5% back in Vault Credits on every drop order. Credits automatically apply to your cart checkout.
                  </p>
                </div>

                <div className="pt-6 border-t border-neutral-200 mt-6">
                  <button
                    onClick={() => alert('Gift cards and balance reload is available via concierge.')}
                    className="w-full py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-xs font-bold text-white transition-colors cursor-pointer shadow-xs"
                  >
                    Redeem Voucher or Gift Card
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER IN WHITE THEME */}
      <footer className="px-6 py-6 text-center text-xs text-neutral-500 border-t border-neutral-200 bg-white">
        &copy; {new Date().getFullYear()} VANTA Apparel Group. Encrypted Client Environment.
      </footer>
    </div>
  );
}
