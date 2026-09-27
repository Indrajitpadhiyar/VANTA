import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Package, 
  User, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  Crown, 
  LogOut, 
  ExternalLink, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Edit3, 
  Plus, 
  Download, 
  Sparkles, 
  AlertCircle,
  Eye,
  EyeOff,
  Bell,
  Smartphone,
  Flame,
  Check
} from 'lucide-react';
import { useAuth, useUI } from '../../context';
import { PRODUCTS } from '../../data/products';

export default function ProfileDetailsPage() {
  const { user, isAuthenticated, logout, login, googleLogin } = useAuth();
  const { goHome, activeProfileTab, setActiveProfileTab, openAuth } = useUI();

  const [activeTab, setActiveTab] = useState(activeProfileTab || 'orders');

  // Form states for profile editing
  const [name, setName] = useState(user?.name || 'Alex Mathio');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '+91 98765 43210');
  const [topSize, setTopSize] = useState('L');
  const [shoeSize, setShoeSize] = useState('US 10.5');
  const [profileSaved, setProfileSaved] = useState(false);

  // Address states
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'Alex Mathio',
      type: 'Home (Default)',
      street: '42 Fashion Blvd, Penthouse 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India',
      phone: '+91 98765 43210',
      isDefault: true,
    },
    {
      id: 2,
      name: 'Alex Mathio (Studio)',
      type: 'Studio Workspace',
      street: 'VANTA Design Lab, 108 Creative District',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400013',
      country: 'India',
      phone: '+91 98765 43211',
      isDefault: false,
    },
  ]);

  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newPostal, setNewPostal] = useState('');

  // Password update states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Sample realistic luxury orders
  const [orders] = useState([
    {
      id: 'VNT-99824',
      date: '25 Sep 2026',
      status: 'In Transit',
      carrier: 'DHL Express Global',
      trackingNumber: 'DHL-8472910482',
      estimatedDelivery: 'Tomorrow by 4:00 PM',
      total: 280.0,
      step: 3, // 1: Placed, 2: Prepared, 3: In Transit, 4: Delivered
      items: [
        {
          name: 'VANTA Signature Heavyweight Fleece Set',
          category: 'Tracksuits',
          size: 'L',
          color: 'Energetic Orange',
          price: 145.0,
          quantity: 1,
          image: PRODUCTS[1]?.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
        },
        {
          name: 'Retro VANTA Court Chunky Sneakers',
          category: 'Footwear',
          size: 'US 10.5',
          color: 'White / Sunset Orange',
          price: 135.0,
          quantity: 1,
          image: PRODUCTS[3]?.image || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
        },
      ],
    },
    {
      id: 'VNT-87412',
      date: '12 Sep 2026',
      status: 'Delivered',
      carrier: 'FedEx Priority',
      trackingNumber: 'FDX-9948210331',
      deliveryDate: '15 Sep 2026',
      total: 134.99,
      step: 4,
      items: [
        {
          name: 'Loose Fit Hoodie',
          category: 'Hoodies',
          size: 'L',
          color: 'Burgundy Maroon',
          price: 24.99,
          quantity: 1,
          image: PRODUCTS[0]?.image || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400',
        },
        {
          name: 'VANTA Origins Washed Vintage Hoodie',
          category: 'Hoodies',
          size: 'L',
          color: 'Charcoal Black',
          price: 110.0,
          quantity: 1,
          image: PRODUCTS[2]?.image || 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=400',
        },
      ],
    },
    {
      id: 'VNT-75301',
      date: '02 Aug 2026',
      status: 'Delivered',
      carrier: 'BlueDart Air',
      trackingNumber: 'BDA-3104928172',
      deliveryDate: '05 Aug 2026',
      total: 120.0,
      step: 4,
      items: [
        {
          name: 'Striped Jacket',
          category: 'Outerwear',
          size: 'XL',
          color: 'White / Black',
          price: 120.0,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=400',
        },
      ],
    },
  ]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newStreet.trim() || !newCity.trim()) return;

    const newAddr = {
      id: Date.now(),
      name: name || 'Alex Mathio',
      type: 'Alternative Address',
      street: newStreet.trim(),
      city: newCity.trim(),
      state: 'Maharashtra',
      postalCode: newPostal.trim() || '400001',
      country: 'India',
      phone: phoneNumber,
      isDefault: false,
    };

    setAddresses([...addresses, newAddr]);
    setNewStreet('');
    setNewCity('');
    setNewPostal('');
    setShowAddAddress(false);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError('Please provide your current password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordSuccess('Password successfully updated! Your account security is intact.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(''), 4000);
  };

  // If visitor is guest, show high-end invitation screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-between selection:bg-orange-500 selection:text-white relative">
        <header className="px-6 sm:px-12 py-6 border-b border-white/10 flex items-center justify-between backdrop-blur-xl bg-neutral-950/80">
          <button
            onClick={goHome}
            className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-orange-400 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Storefront</span>
          </button>
          <div className="text-sm font-extrabold tracking-widest text-white font-cute uppercase">
            VANTA CLIENTEL
          </div>
          <span className="text-xs text-orange-400 font-mono">ENCRYPTED</span>
        </header>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center p-8 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-2xl shadow-2xl relative">
            <div className="w-16 h-16 mx-auto rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-4 shadow-[0_0_30px_rgba(255,107,0,0.3)]">
              <Crown className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold font-cute mb-2">Member Portal Restricted</h2>
            <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
              Sign in or create an account to access order tracking, private vault drops, loyalty points, and client concierge services.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => openAuth('login')}
                className="w-full py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all shadow-[0_10px_30px_rgba(255,107,0,0.35)] cursor-pointer"
              >
                Sign In to Member Profile
              </button>

              <button
                onClick={() => googleLogin()}
                className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue with Google 1-Click</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentUser = user || {
    name: 'Alex Mathio',
    email: 'alex@vanta.com',
    role: 'customer',
    avatar: { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-between selection:bg-orange-500 selection:text-white relative overflow-x-hidden font-sans">
      {/* Background Luxury Ambient Glows */}
      <div className="absolute top-20 -left-48 w-96 h-96 bg-orange-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -right-48 w-96 h-96 bg-orange-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* 1. TOP HEADER & BREADCRUMBS */}
      <header className="sticky top-0 z-40 px-6 sm:px-12 py-5 border-b border-white/10 backdrop-blur-2xl bg-neutral-950/80 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={goHome}
            className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-orange-400 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Storefront</span>
          </button>
          <span className="text-neutral-600 hidden sm:inline">/</span>
          <span className="text-xs uppercase tracking-widest text-neutral-400 font-mono hidden sm:inline">
            CLIENT PROFILE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-orange-500/15 border border-orange-500/30 text-orange-400">
            <Crown className="w-3.5 h-3.5" />
            VANTA BLACK COHORT
          </span>

          <button
            onClick={() => {
              logout();
              goHome();
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 border border-white/10 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. MAIN PROFILE VIEWPORT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* HERO IDENTITY BANNER */}
        <div className="relative p-6 sm:p-8 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-2xl shadow-2xl mb-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-orange-500/15 via-transparent to-transparent pointer-events-none rounded-full" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            {/* User Info */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="relative shrink-0">
                <img
                  src={currentUser.avatar?.url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'}
                  alt={currentUser.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-orange-500/50 shadow-xl"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-neutral-950 rounded-full" />
              </div>

              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight font-cute">
                    {currentUser.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500 text-white shadow-sm">
                    {currentUser.role === 'admin' ? 'Studio Director' : 'VIP Member'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                  {currentUser.email} • Member ID: <span className="font-mono text-orange-400">#VNT-89421</span>
                </p>
                <div className="flex items-center gap-4 mt-2.5 text-xs text-neutral-400">
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Identity Verified
                  </span>
                  <span>•</span>
                  <span>Joined October 2026</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                <span className="block text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                  Total Orders
                </span>
                <span className="text-lg sm:text-2xl font-black text-white font-cute mt-0.5 block">
                  {orders.length}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                <span className="block text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                  Vault Points
                </span>
                <span className="text-lg sm:text-2xl font-black text-orange-400 font-cute mt-0.5 block">
                  3,450
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                <span className="block text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                  Tier Status
                </span>
                <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mt-1 block font-mono">
                  BLACK 2.0
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. MULTI-TAB NAVIGATION BAR */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-white/10 scrollbar-none">
          {[
            { id: 'orders', label: 'Orders & Tracking', icon: Package, badge: orders.length },
            { id: 'details', label: 'Personal Information', icon: User },
            { id: 'addresses', label: 'Address Book', icon: MapPin, badge: addresses.length },
            { id: 'wallet', label: 'Payment & Vault', icon: CreditCard },
            { id: 'vip', label: 'VIP Society Perks', icon: Crown },
            { id: 'security', label: 'Security & Logins', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-[0_5px_20px_rgba(255,107,0,0.35)]'
                    : 'bg-neutral-900/60 text-neutral-400 hover:text-white hover:bg-neutral-800/80 border border-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-orange-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-black/30 text-white' : 'bg-white/10 text-neutral-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 4. TAB CONTENTS */}

        {/* TAB 1: ORDERS & TRACKING */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-cute text-white">Order Archives & Shipments</h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Live tracking, logistics milestones, and certified digital invoices.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">All shipments routed via insured courier</span>
              </div>
            </div>

            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-3xl bg-neutral-900/50 border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-xl transition-all hover:border-white/20"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-base sm:text-lg font-black font-cute text-white tracking-wide">
                          {order.id}
                        </span>
                        <span
                          className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 ${
                            order.status === 'In Transit'
                              ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
                              : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">
                        Placed on {order.date} • Courier: <span className="text-white font-medium">{order.carrier}</span> ({order.trackingNumber})
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => alert(`Downloading VAT Tax Invoice for ${order.id}...`)}
                        className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Invoice</span>
                      </button>

                      <span className="text-lg font-black font-cute text-white">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Visual Logistics Tracking Progress (for In-Transit orders) */}
                  {order.status === 'In Transit' && (
                    <div className="py-6 border-b border-white/10">
                      <div className="flex items-center justify-between text-xs font-bold text-neutral-300 mb-3">
                        <span className="flex items-center gap-1.5 text-orange-400">
                          <Truck className="w-4 h-4 animate-bounce" />
                          Estimated Delivery: {order.estimatedDelivery}
                        </span>
                        <span className="font-mono text-neutral-400">Hub: Milan Distribution Hub</span>
                      </div>

                      {/* 4-step progress line */}
                      <div className="relative flex items-center justify-between">
                        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-white/10 -z-0" />
                        <div
                          className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500 -z-0"
                          style={{ width: '70%' }}
                        />

                        {[
                          { title: 'Confirmed', done: true },
                          { title: 'Tailored / Packed', done: true },
                          { title: 'In Transit (Air)', done: true, current: true },
                          { title: 'Delivered', done: false },
                        ].map((s, idx) => (
                          <div key={idx} className="flex flex-col items-center relative z-10">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                s.done
                                  ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(255,107,0,0.5)]'
                                  : 'bg-neutral-800 text-neutral-500 border border-white/10'
                              } ${s.current ? 'ring-4 ring-orange-500/30' : ''}`}
                            >
                              {s.done ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                            </div>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider mt-2 ${
                                s.current ? 'text-orange-400 font-extrabold' : s.done ? 'text-white' : 'text-neutral-500'
                              }`}
                            >
                              {s.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Order Line Items */}
                  <div className="pt-6 space-y-4">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 rounded-xl object-cover shrink-0 ring-1 ring-white/10"
                          />
                          <div>
                            <h4 className="text-sm font-bold text-white">{item.name}</h4>
                            <p className="text-xs text-neutral-400 mt-0.5">
                              Size: <span className="text-white font-medium">{item.size}</span> • Color: <span className="text-white font-medium">{item.color}</span> • Qty: {item.quantity}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-bold text-white">${item.price.toFixed(2)}</span>
                          <span className="block text-[10px] text-emerald-400 font-semibold uppercase">Verified Authentic</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PERSONAL INFORMATION */}
        {activeTab === 'details' && (
          <div className="max-w-3xl space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold font-cute text-white">Client Personal File</h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Update your identity details, contact info, and tailored silhouette preferences.
              </p>
            </div>

            {profileSaved && (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Client profile updated successfully across all global nodes.</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="p-6 sm:p-8 rounded-3xl bg-neutral-900/50 border border-white/10 space-y-6 backdrop-blur-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-300 mb-2">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-orange-500 text-sm text-white outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-300 mb-2">
                    Email Address (Registered)
                  </label>
                  <input
                    type="email"
                    value={currentUser.email}
                    disabled
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-neutral-400 text-sm cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-300 mb-2">
                    Direct Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-orange-500 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-300 mb-2">
                    Country / Regional Market
                  </label>
                  <input
                    type="text"
                    defaultValue="India (IN)"
                    disabled
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-neutral-400 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Sizing Preferences */}
              <div className="pt-6 border-t border-white/10">
                <h4 className="text-xs uppercase tracking-wider font-bold text-orange-400 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Tailored Sizing Preferences (Auto-Applied to Drops)
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Tops & Hoodies</label>
                    <select
                      value={topSize}
                      onChange={(e) => setTopSize(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/15 text-xs text-white focus:border-orange-500 outline-none"
                    >
                      <option value="S">S (Small - Fitted)</option>
                      <option value="M">M (Medium - Standard)</option>
                      <option value="L">L (Large - Oversized Boxy)</option>
                      <option value="XL">XL (Extra Large)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Sneaker Size</label>
                    <select
                      value={shoeSize}
                      onChange={(e) => setShoeSize(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/15 text-xs text-white focus:border-orange-500 outline-none"
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
                className="py-3.5 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm tracking-wide transition-all shadow-[0_10px_30px_rgba(255,107,0,0.3)] cursor-pointer"
              >
                Save Client Information
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: ADDRESS BOOK */}
        {activeTab === 'addresses' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-cute text-white">Saved Delivery Destinations</h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Manage primary residences and private studio addresses for express courier drops.
                </p>
              </div>

              <button
                onClick={() => setShowAddAddress(!showAddAddress)}
                className="px-4 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Destination</span>
              </button>
            </div>

            {/* Add Address Form Modal / Box */}
            {showAddAddress && (
              <form onSubmit={handleAddAddress} className="p-6 rounded-3xl bg-neutral-900 border border-orange-500/50 space-y-4">
                <h4 className="text-sm font-bold text-white font-cute">New Delivery Address</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    placeholder="Street & Apartment Number"
                    className="sm:col-span-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white outline-none"
                    required
                  />
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="City (e.g. Mumbai)"
                    className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white outline-none"
                    required
                  />
                  <input
                    type="text"
                    value={newPostal}
                    onChange={(e) => setNewPostal(e.target.value)}
                    placeholder="Postal PIN Code"
                    className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddAddress(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-xs text-neutral-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-orange-500 text-xs font-bold text-white"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-6 rounded-3xl bg-neutral-900/60 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-white font-cute">{addr.type}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Primary
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 text-xs text-neutral-300">
                      <p className="font-semibold text-white">{addr.name}</p>
                      <p>{addr.street}</p>
                      <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                      <p>{addr.country}</p>
                      <p className="text-neutral-400 pt-1">Phone: {addr.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-white/10 mt-4 text-xs">
                    <button
                      onClick={() => alert(`Address ${addr.id} updated.`)}
                      className="text-neutral-400 hover:text-white font-semibold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => setAddresses(addresses.filter(a => a.id !== addr.id))}
                      className="text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PAYMENT & VAULT WALLET */}
        {activeTab === 'wallet' && (
          <div className="space-y-6 animate-fade-in max-w-4xl">
            <div>
              <h2 className="text-xl font-bold font-cute text-white">Payment Vault & Digital Wallet</h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Saved luxury cards, instant 1-click checkout credentials, and vault credits balance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Titanium Luxury Card Mockup */}
              <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-800 border border-white/20 shadow-2xl text-white overflow-hidden aspect-[1.58/1] flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-44 h-44 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between relative z-10">
                  <span className="text-xs font-black tracking-widest uppercase font-mono text-orange-400">
                    VANTA BLACK TITANIUM
                  </span>
                  <span className="text-sm font-black font-cute tracking-tight text-white">
                    VISA SIGNATURE
                  </span>
                </div>

                <div className="relative z-10 py-4">
                  <div className="w-10 h-8 rounded-lg bg-amber-200/40 border border-amber-300/40 mb-4 flex items-center justify-center">
                    <div className="w-6 h-4 border border-amber-400/50 rounded-sm" />
                  </div>
                  <span className="font-mono text-lg sm:text-xl tracking-widest text-neutral-200">
                    •••• •••• •••• 4829
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono relative z-10 text-neutral-400">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider block">Card Holder</span>
                    <span className="text-white font-bold">{currentUser.name.toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider block">Expires</span>
                    <span className="text-white font-bold">09/29</span>
                  </div>
                </div>
              </div>

              {/* Vault Balance Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                      Vault Store Credit
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Ready to spend
                    </span>
                  </div>

                  <div className="text-3xl sm:text-4xl font-black font-cute text-white">
                    $34.50 <span className="text-xs text-neutral-400 font-sans font-normal">(3,450 PTS)</span>
                  </div>

                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                    Earn 5% back in Vault Credits on every order. Credits automatically apply to your cart upon checkout.
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 mt-6">
                  <button
                    onClick={() => alert('Gift cards and balance reload is available via concierge.')}
                    className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    Redeem Voucher or Gift Card
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: VIP SOCIETY BENEFITS */}
        {activeTab === 'vip' && (
          <div className="space-y-6 animate-fade-in max-w-4xl">
            <div>
              <h2 className="text-xl font-bold font-cute text-white">VANTA VIP Society Allocation</h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Exclusive privileges unlocked for Tier 2.0 Black Members.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: '48h Early Drop Access', desc: 'Secure drops and limited capsules before global public release.', active: true },
                { title: 'Free Worldwide Express', desc: 'Complimentary expedited delivery on all orders without threshold.', active: true },
                { title: 'Personal Concierge Fitting', desc: 'Direct WhatsApp and stylist consultations for custom sizing.', active: true },
                { title: 'Private Vault Archive', desc: 'Access to vault re-issues and prototype unreleased garments.', active: true },
                { title: 'Bespoke Atelier Alterations', desc: 'Free lifetime hemming and sizing adjustments in partner ateliers.', active: false },
                { title: 'Milan & Tokyo Runway Invitations', desc: 'Seasonal physical showroom and afterparty entry tickets.', active: false },
              ].map((perk, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all ${
                    perk.active
                      ? 'bg-neutral-900/60 border-orange-500/30 shadow-[0_0_20px_rgba(255,107,0,0.08)]'
                      : 'bg-neutral-900/30 border-white/5 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-white font-cute">{perk.title}</h4>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        perk.active ? 'bg-orange-500 text-white' : 'bg-white/10 text-neutral-400'
                      }`}
                    >
                      {perk.active ? 'Unlocked' : 'Tier 3 Locked'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">{perk.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: SECURITY & PREFERENCES */}
        {activeTab === 'security' && (
          <div className="max-w-3xl space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold font-cute text-white">Security & Account Access</h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Manage your master password, 2-factor authentication, and connected credentials.
              </p>
            </div>

            {/* Password Update Form */}
            <form onSubmit={handlePasswordSubmit} className="p-6 sm:p-8 rounded-3xl bg-neutral-900/50 border border-white/10 space-y-5 backdrop-blur-xl">
              <h4 className="text-sm font-bold text-white font-cute">Change Master Password</h4>

              {passwordError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-300 mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-orange-500 text-sm text-white outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-300 mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-orange-500 text-sm text-white outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-300 mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-orange-500 text-sm text-white outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="py-3 px-5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                Update Password
              </button>
            </form>

            {/* Connected Providers */}
            <div className="p-6 rounded-3xl bg-neutral-900/50 border border-white/10 space-y-4">
              <h4 className="text-sm font-bold text-white font-cute">Connected Authentication</h4>
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                  </svg>
                  <div>
                    <h5 className="text-xs font-bold text-white">Google Authentication</h5>
                    <p className="text-[11px] text-neutral-400">1-click biometric & OAuth sign in enabled</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Connected
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="px-6 py-5 text-center text-xs text-neutral-500 border-t border-white/10 bg-neutral-950/80">
        &copy; {new Date().getFullYear()} VANTA Apparel Group. Encrypted Client Environment.
      </footer>
    </div>
  );
}
