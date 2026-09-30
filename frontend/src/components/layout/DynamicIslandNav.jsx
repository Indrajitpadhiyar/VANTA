import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  ShoppingBag, 
  ShoppingCart, 
  Search, 
  User, 
  Truck,
  FileText,
  CreditCard,
  ShieldCheck,
  X, 
  ArrowRight, 
  TrendingUp,
  Check,
  Sliders
} from 'lucide-react';
import { vantaLogo } from '../../assets';
import { useCart, useUI, useAuth } from '../../context';
import { UserProfileModal } from '../feedback';

export default function DynamicIslandNav() {
  const { totalCount, openCart, addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { 
    goHome, 
    viewProduct, 
    draggingProduct, 
    setDraggingProduct,
    openAuth,
    goToProfilePage,
    goToAdminPage,
    activeView,
    activeProfileTab,
    activeOrderAlert
  } = useUI();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragOverIsland, setIsDragOverIsland] = useState(false);
  const [justDropped, setJustDropped] = useState(null);
  
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const isProfileView = activeView === 'profile';

  // Focus input smoothly after dynamic island stretches
  useEffect(() => {
    if (isSearchActive) {
      const focusTimer = setTimeout(() => {
        inputRef.current?.focus();
      }, 180);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          handleCloseSearch();
        }
      };

      const handleClickOutside = (e) => {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
          handleCloseSearch();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        clearTimeout(focusTimer);
        window.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isSearchActive]);

  const handleOpenSearch = () => {
    setIsSearchActive(true);
  };

  const handleCloseSearch = () => {
    setIsSearchActive(false);
    setSearchQuery('');
  };

  const handleSelectProduct = (item) => {
    handleCloseSearch();
    if (item) {
      viewProduct(item);
    } else {
      const el = document.getElementById('shop');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle Drag & Drop to Dynamic Island
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOverIsland(false);
    
    let product = draggingProduct;
    if (!product) {
      try {
        const raw = e.dataTransfer.getData('application/json');
        if (raw) product = JSON.parse(raw);
      } catch (err) {
        console.error('Failed to parse dropped product', err);
      }
    }

    if (product) {
      addToCart(product);
      setJustDropped(product);
      setDraggingProduct(null);
      
      // Auto clear drop success state after 2.5s
      setTimeout(() => {
        setJustDropped(null);
      }, 2500);
    }
  };

  const isDropTargetActive = isDragOverIsland || !!draggingProduct;

  const filteredResults = searchQuery.trim() === ''
    ? []
    : PRODUCTS.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const isAdmin = user?.role === 'admin' || user?.email === 'admin@vanta.com';

  return (
    <div ref={containerRef} className="fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      {/* ======================================================== */}
      {/* MAIN DYNAMIC ISLAND CAPSULE                              */}
      {/* ======================================================== */}
      <nav
        id="dynamic-island-navbar"
        onMouseEnter={() => !isSearchActive && !isDropTargetActive && setIsHovered(true)}
        onMouseLeave={() => !isSearchActive && !isDropTargetActive && setIsHovered(false)}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
          if (!isDragOverIsland) setIsDragOverIsland(true);
        }}
        onDragLeave={(e) => {
          if (containerRef.current && !containerRef.current.contains(e.relatedTarget)) {
            setIsDragOverIsland(false);
          }
        }}
        onDrop={handleDrop}
        className={`relative flex items-center rounded-full 
          bg-neutral-950/95 backdrop-blur-2xl border 
          transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${justDropped
            ? 'w-auto px-4 py-2 border-emerald-500/60 shadow-[0_20px_50px_rgba(16,185,129,0.3)] animate-island-pop'
            : isDropTargetActive
              ? `w-[94vw] max-w-[480px] sm:w-[450px] px-3.5 py-2.5 border-orange-500 shadow-[0_0_35px_rgba(255,107,0,0.5),0_20px_45px_rgba(0,0,0,0.8)] animate-island-pulse ${isDragOverIsland ? 'scale-105 ring-2 ring-orange-500' : ''}`
              : isSearchActive 
                ? 'w-[94vw] max-w-[540px] px-3 sm:px-3.5 py-2 border-white/20 shadow-[0_25px_60px_rgba(255,107,0,0.28),0_0_0_1px_rgba(255,150,50,0.25)_inset]' 
                : isHovered 
                  ? 'scale-100 px-3.5 sm:px-4 py-2 border-white/20 shadow-[0_25px_60px_rgba(255,107,0,0.25),0_0_0_1px_rgba(255,150,50,0.2)_inset]' 
                  : 'scale-95 sm:scale-100 hover:scale-100 px-2.5 sm:px-3 py-1.5 sm:py-2 border-white/15 shadow-[0_15px_35px_-8px_rgba(0,0,0,0.7)]'
          }
        `}
      >
        {/* Brand Anchor Logo */}
        <button 
          onClick={goHome}
          className="flex items-center gap-1.5 pl-1 pr-2 border-r border-white/15 shrink-0 focus:outline-none cursor-pointer"
          title="VANTA Storefront Home"
        >
          <div className="flex items-center justify-center">
            <img 
              src={vantaLogo} 
              alt="VANTA" 
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain transition-transform duration-300 hover:scale-110" 
            />
          </div>
          
          {/* Micro Brand Tag (shows on hover) */}
          <div 
            className={`flex items-center overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
              ${!isSearchActive && !isDropTargetActive && !justDropped && isHovered ? 'max-w-[70px] opacity-100 ml-1 mr-1' : 'max-w-0 opacity-0 ml-0 mr-0'}
            `}
          >
            <span className="flex items-center text-[11px] font-bold tracking-wider uppercase text-white whitespace-nowrap font-cute">
              VANTA<span className="inline-block w-1.5 h-1.5 bg-orange-500 rounded-[2px] ml-0.5"></span>
            </span>
          </div>
        </button>

        {/* STATE 1: JUST DROPPED CONFIRMATION */}
        {justDropped ? (
          <div className="flex items-center gap-2.5 px-2 py-0.5 animate-island-pop">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/60 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
            </div>
            <img 
              src={justDropped.image} 
              alt={justDropped.name} 
              className="w-6 h-6 rounded-lg object-cover border border-white/20 shadow-sm"
            />
            <span className="text-xs font-bold text-white font-cute whitespace-nowrap">
              Added to Cart!
            </span>
            <span className="px-2 py-0.5 rounded-full bg-orange-600 text-white text-[10px] font-extrabold shadow-sm animate-bounce">
              +1
            </span>
          </div>
        ) : isDropTargetActive ? (
          /* STATE 2: ACTIVE DRAGGING MAGNET */
          <div 
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'copy';
              setIsDragOverIsland(true);
            }}
            onDragLeave={() => setIsDragOverIsland(false)}
            onDrop={handleDrop}
            className={`flex-1 flex items-center justify-center gap-2 py-1 px-3 rounded-full border border-dashed transition-all duration-300
              ${isDragOverIsland 
                ? 'bg-orange-500/30 border-orange-400 scale-[1.03] shadow-[0_0_20px_rgba(255,107,0,0.5)]' 
                : 'bg-white/10 border-orange-400/50'
              }
            `}
          >
            <ShoppingCart className={`w-4 h-4 text-orange-400 ${isDragOverIsland ? 'animate-bounce scale-110' : 'animate-pulse'}`} />
            <span className="text-xs font-bold text-white font-cute tracking-wide whitespace-nowrap">
              {isDragOverIsland ? 'Drop here to Add to Cart!' : 'Drop item here to Add'}
            </span>
            {draggingProduct && (
              <span className="hidden sm:inline-block text-[10px] text-orange-300 font-semibold truncate max-w-[110px] font-sans">
                {draggingProduct.name}
              </span>
            )}
          </div>
        ) : isProfileView ? (
          /* ======================================================== */
          /* PROFILE PAGE DYNAMIC ISLAND:                             */
          /* PERSONAL INFO, PRODUCT TRACKING, CART SECTION            */
          /* ON HOVER SHOWS NAME, ELSE JUST ICONS                     */
          /* ======================================================== */
          <>
            <div 
              className={`flex items-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden shrink-0
                ${isSearchActive 
                  ? 'max-w-0 opacity-0 scale-75 pointer-events-none -mr-1' 
                  : 'max-w-[700px] opacity-100 scale-100 gap-1 sm:gap-1.5'
                }
              `}
            >
              {/* 1. PRODUCT TRACKING */}
              <button
                id="island-nav-tracking"
                onClick={() => goToProfilePage('orders')}
                className={`relative flex items-center rounded-full text-white/85 hover:text-white transition-all duration-300 cursor-pointer
                  ${isHovered ? 'px-3 py-1.5' : 'p-2'}
                  ${activeProfileTab === 'orders' || !activeProfileTab ? 'bg-orange-500 text-white font-bold shadow-md shadow-orange-500/30' : 'hover:bg-white/10'}
                `}
                title="Product Tracking"
              >
                <div className="relative flex items-center justify-center">
                  <Truck className={`w-4 h-4 transition-transform duration-300 ${activeProfileTab === 'orders' || !activeProfileTab ? 'text-white' : 'text-orange-400'}`} />
                  {activeOrderAlert?.active && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-ping" />
                  )}
                </div>
                {/* Shows name ONLY when hovered, else just icons */}
                <span className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] text-xs font-semibold whitespace-nowrap ${
                  isHovered ? 'max-w-[130px] opacity-100 ml-2' : 'max-w-0 opacity-0 ml-0 pointer-events-none'
                }`}>
                  Product Tracking
                </span>
              </button>

              {/* 2. PERSONAL INFO */}
              <button
                id="island-nav-personal-info"
                onClick={() => goToProfilePage('details')}
                className={`relative flex items-center rounded-full text-white/85 hover:text-white transition-all duration-300 cursor-pointer
                  ${isHovered ? 'px-3 py-1.5' : 'p-2'}
                  ${activeProfileTab === 'details' ? 'bg-orange-500 text-white font-bold shadow-md shadow-orange-500/30' : 'hover:bg-white/10'}
                `}
                title="Personal Info"
              >
                <User className={`w-4 h-4 transition-transform duration-300 ${activeProfileTab === 'details' ? 'text-white' : 'text-orange-400'}`} />
                {/* Shows name ONLY when hovered, else just icons */}
                <span className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] text-xs font-semibold whitespace-nowrap ${
                  isHovered ? 'max-w-[110px] opacity-100 ml-2' : 'max-w-0 opacity-0 ml-0 pointer-events-none'
                }`}>
                  Personal Info
                </span>
              </button>

              {/* 3. CART SECTION */}
              <button
                id="island-nav-cart-section"
                onClick={() => {
                  goToProfilePage('cart');
                  openCart();
                }}
                className={`relative flex items-center rounded-full text-white/85 hover:text-white transition-all duration-300 cursor-pointer
                  ${isHovered ? 'px-3 py-1.5' : 'p-2'}
                  ${activeProfileTab === 'cart' ? 'bg-orange-500 text-white font-bold shadow-md shadow-orange-500/30' : 'hover:bg-white/10'}
                `}
                title="Cart Section"
              >
                <div className="relative flex items-center justify-center">
                  <ShoppingCart className={`w-4 h-4 transition-transform duration-300 ${activeProfileTab === 'cart' ? 'text-white' : 'text-orange-400'}`} />
                  {totalCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] flex items-center justify-center text-[9px] font-extrabold text-white bg-orange-600 rounded-full px-1 shadow-sm">
                      {totalCount}
                    </span>
                  )}
                </div>
                {/* Shows name ONLY when hovered, else just icons */}
                <span className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] text-xs font-semibold whitespace-nowrap ${
                  isHovered ? 'max-w-[100px] opacity-100 ml-2' : 'max-w-0 opacity-0 ml-0 pointer-events-none'
                }`}>
                  Cart Section
                </span>
              </button>

              {/* 4. RETURN TO STOREFRONT */}
              <button
                id="island-nav-storefront"
                onClick={goHome}
                className={`relative flex items-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 cursor-pointer
                  ${isHovered ? 'px-3 py-1.5' : 'p-2'}
                `}
                title="Back to Storefront"
              >
                <ShoppingBag className="w-4 h-4 text-orange-400" />
                <span className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] text-xs font-semibold whitespace-nowrap ${
                  isHovered ? 'max-w-[90px] opacity-100 ml-2' : 'max-w-0 opacity-0 ml-0 pointer-events-none'
                }`}>
                  Storefront
                </span>
              </button>

              {/* ADMIN CONSOLE LINK (IF ADMIN) */}
              {isAdmin && (
                <button
                  id="island-nav-admin"
                  onClick={goToAdminPage}
                  className={`relative flex items-center rounded-full transition-all duration-300 cursor-pointer
                    ${isHovered ? 'px-3 py-1.5' : 'p-2'}
                    bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500 hover:text-white
                  `}
                  title="Admin Dashboard (with Sidebar)"
                >
                  <Sliders className="w-4 h-4 text-orange-400" />
                  <span className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
                    isHovered ? 'max-w-[80px] opacity-100 ml-2' : 'max-w-0 opacity-0 ml-0 pointer-events-none'
                  }`}>
                    Admin
                  </span>
                </button>
              )}
            </div>

            {/* SEPARATOR */}
            <div className="h-4 w-[1px] bg-white/15 mx-1" />

            {/* SEARCH ICON & INPUT */}
            <div className={`flex items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isSearchActive ? 'flex-1 pl-1' : ''}`}>
              <button
                id="island-item-search"
                onClick={() => {
                  if (!isSearchActive) handleOpenSearch();
                }}
                className={`relative flex items-center rounded-full transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] shrink-0
                  ${isSearchActive 
                    ? 'p-1.5 text-orange-400 cursor-default bg-orange-500/10' 
                    : isHovered 
                      ? 'px-2.5 py-1.5 text-white/80 hover:text-white hover:bg-white/10' 
                      : 'p-2 text-white/80 hover:text-white hover:bg-white/10'
                  }
                `}
                title="Search Drops"
              >
                <Search className={`w-4 h-4 transition-transform duration-300 ${isSearchActive ? 'text-orange-400 scale-105' : ''}`} />
                <span className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] text-xs font-semibold whitespace-nowrap ${
                  !isSearchActive && isHovered ? 'max-w-[70px] opacity-100 ml-1.5' : 'max-w-0 opacity-0 ml-0 pointer-events-none'
                }`}>
                  Search
                </span>
              </button>

              <div 
                className={`flex items-center overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left
                  ${isSearchActive 
                    ? 'max-w-[360px] sm:max-w-[420px] opacity-100 flex-1 ml-1.5 sm:ml-2' 
                    : 'max-w-0 opacity-0 scale-x-50 pointer-events-none'
                  }
                `}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search drops, hoodies, sneakers..."
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-neutral-400 focus:outline-none font-medium tracking-wide"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSelectProduct(filteredResults[0]);
                    }
                  }}
                />

                <span className={`hidden sm:inline-block text-[9px] uppercase font-bold tracking-wider text-neutral-400 border border-white/10 px-1.5 py-0.5 rounded-md bg-white/5 mr-1.5 shrink-0 transition-opacity duration-300 ${isSearchActive ? 'opacity-100' : 'opacity-0'}`}>
                  esc
                </span>

                <button
                  onClick={handleCloseSearch}
                  className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/15 transition-all duration-200 shrink-0"
                  title="Close search"
                >
                  <X className="w-4 h-4 text-neutral-300 hover:text-white" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* ======================================================== */
          /* HOME / PRODUCT / STOREFRONT DYNAMIC ISLAND               */
          /* (HOME, COLLECTION, CART, SEARCH, PROFILE)                */
          /* ON HOVER SHOWS NAME, ELSE JUST ICONS                     */
          /* ======================================================== */
          <>
            <div 
              className={`flex items-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden shrink-0
                ${isSearchActive 
                  ? 'max-w-0 opacity-0 scale-75 pointer-events-none -mr-1' 
                  : 'max-w-[500px] opacity-100 scale-100 gap-1 sm:gap-1.5'
                }
              `}
            >
              {/* Home */}
              <button
                id="island-item-home"
                onClick={goHome}
                className={`relative flex items-center rounded-full text-white/80 hover:text-white transition-all duration-300 cursor-pointer
                  ${isHovered ? 'px-3 py-1.5' : 'p-2'}
                  ${activeView === 'home' ? 'bg-white/15 text-white font-medium shadow-sm' : 'hover:bg-white/10'}
                `}
                title="Home"
              >
                <Home className={`w-4 h-4 transition-transform duration-300 ${activeView === 'home' ? 'text-orange-400' : ''}`} />
                <span className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] text-xs tracking-wide whitespace-nowrap ${
                  isHovered ? 'max-w-[70px] opacity-100 ml-1.5' : 'max-w-0 opacity-0 ml-0 pointer-events-none'
                }`}>
                  Home
                </span>
                {activeView === 'home' && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-2 h-0.5 bg-orange-500 rounded-full" />}
              </button>

              {/* Collection */}
              <button
                id="island-item-collection"
                onClick={() => {
                  goHome();
                  setTimeout(() => {
                    const el = document.getElementById('shop');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className={`relative flex items-center rounded-full text-white/80 hover:text-white transition-all duration-300 cursor-pointer
                  ${isHovered ? 'px-3 py-1.5' : 'p-2'}
                  hover:bg-white/10
                `}
                title="Collection"
              >
                <ShoppingBag className="w-4 h-4 text-orange-400" />
                <span className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] text-xs tracking-wide whitespace-nowrap ${
                  isHovered ? 'max-w-[90px] opacity-100 ml-1.5' : 'max-w-0 opacity-0 ml-0 pointer-events-none'
                }`}>
                  Collection
                </span>
              </button>

              {/* Cart Button */}
              <button
                id="island-item-cart"
                onClick={(e) => {
                  e.preventDefault();
                  openCart();
                }}
                className={`relative flex items-center rounded-full text-white/80 hover:text-white transition-all duration-300 cursor-pointer
                  ${isHovered ? 'px-3 py-1.5' : 'p-2'}
                  hover:bg-white/10
                `}
                title="Cart"
              >
                <div className="relative flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4" />
                  {totalCount > 0 && (
                    <span className="absolute -top-1 -right-1.5 min-w-[15px] h-[15px] flex items-center justify-center text-[9px] font-extrabold text-white bg-orange-600 rounded-full px-1 shadow-sm">
                      {totalCount}
                    </span>
                  )}
                </div>
                <span className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] text-xs tracking-wide whitespace-nowrap ${
                  isHovered ? 'max-w-[70px] opacity-100 ml-1.5' : 'max-w-0 opacity-0 ml-0 pointer-events-none'
                }`}>
                  Cart
                </span>
              </button>
            </div>

            {/* SEPARATOR */}
            <div className="h-4 w-[1px] bg-white/15 mx-1" />

            {/* Search */}
            <div className={`flex items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isSearchActive ? 'flex-1 pl-1' : ''}`}>
              <button
                id="island-item-search"
                onClick={() => {
                  if (!isSearchActive) handleOpenSearch();
                }}
                className={`relative flex items-center rounded-full transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] shrink-0
                  ${isSearchActive 
                    ? 'p-1.5 text-orange-400 cursor-default bg-orange-500/10' 
                    : isHovered 
                      ? 'px-2.5 py-1.5 text-white/80 hover:text-white hover:bg-white/10' 
                      : 'p-2 text-white/80 hover:text-white hover:bg-white/10'
                  }
                `}
                title="Search"
              >
                <Search className={`w-4 h-4 transition-transform duration-300 ${isSearchActive ? 'text-orange-400 scale-105' : ''}`} />
                <span className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] text-xs tracking-wide whitespace-nowrap ${
                  !isSearchActive && isHovered ? 'max-w-[70px] opacity-100 ml-1.5' : 'max-w-0 opacity-0 ml-0 pointer-events-none'
                }`}>
                  Search
                </span>
              </button>

              <div 
                className={`flex items-center overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left
                  ${isSearchActive 
                    ? 'max-w-[360px] sm:max-w-[420px] opacity-100 flex-1 ml-1.5 sm:ml-2' 
                    : 'max-w-0 opacity-0 scale-x-50 pointer-events-none'
                  }
                `}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search drops, vintage hoodies, sneakers..."
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-neutral-400 focus:outline-none font-medium tracking-wide"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSelectProduct(filteredResults[0]);
                    }
                  }}
                />

                <span className={`hidden sm:inline-block text-[9px] uppercase font-bold tracking-wider text-neutral-400 border border-white/10 px-1.5 py-0.5 rounded-md bg-white/5 mr-1.5 shrink-0 transition-opacity duration-300 ${isSearchActive ? 'opacity-100' : 'opacity-0'}`}>
                  esc
                </span>

                <button
                  onClick={handleCloseSearch}
                  className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/15 transition-all duration-200 shrink-0"
                  title="Close search"
                >
                  <X className="w-4 h-4 text-neutral-300 hover:text-white" />
                </button>
              </div>
            </div>

            {/* Profile / Account Trigger */}
            <div 
              className={`flex items-center transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden shrink-0
                ${isSearchActive 
                  ? 'max-w-0 opacity-0 scale-75 pointer-events-none -ml-1' 
                  : 'max-w-[130px] opacity-100 scale-100 ml-1'
                }
              `}
            >
              <button
                id="island-item-account"
                onClick={() => goToProfilePage('orders')}
                className={`relative flex items-center rounded-full text-white/80 hover:text-white transition-all duration-300 cursor-pointer
                  ${isHovered ? 'px-2.5 py-1.5' : 'p-2'}
                  hover:bg-white/10
                `}
                title={isAuthenticated ? `Profile: ${user?.name || 'Member'}` : 'Sign In'}
              >
                {isAuthenticated && user?.avatar?.url ? (
                  <div className="relative shrink-0">
                    <img
                      src={user.avatar.url}
                      alt={user.name}
                      className="w-4 h-4 rounded-full object-cover ring-1 ring-orange-500"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  </div>
                ) : (
                  <User className="w-4 h-4" />
                )}
                <span className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] text-xs tracking-wide whitespace-nowrap ${
                  isHovered ? 'max-w-[80px] opacity-100 ml-1.5' : 'max-w-0 opacity-0 ml-0 pointer-events-none'
                }`}>
                  {isAuthenticated ? (user?.name ? user.name.split(' ')[0] : 'Profile') : 'Sign In'}
                </span>
              </button>
            </div>
          </>
        )}

        {/* Glossy Liquid Glass Highlight along top curve */}
        <div className="absolute top-0 inset-x-6 h-[1px] bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none rounded-full" />
      </nav>

      {/* Floating Dynamic Island Live Search Results Panel */}
      {isSearchActive && (
        <div className="mt-2 w-[94vw] max-w-[540px] bg-neutral-950/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-4 shadow-[0_25px_50px_rgba(0,0,0,0.85),0_0_25px_rgba(255,107,0,0.2)] text-white animate-island-dropdown">
          {searchQuery.trim() === '' ? (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
                <TrendingUp className="w-3.5 h-3.5 text-orange-400" />
                Popular Searches
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Vintage Hoodie', 'Fleece Set', 'Chunky Sneakers', 'Loose Fit Hoodie'].map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSearchQuery(tag)}
                    className="text-xs bg-white/10 hover:bg-orange-500 hover:text-white px-3 py-1.5 rounded-full text-neutral-300 transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Matching Vault Items ({filteredResults.length})
              </div>
              {filteredResults.length === 0 ? (
                <div className="text-center py-6 text-neutral-400 text-xs">
                  No drops found matching "{searchQuery}"
                </div>
              ) : (
                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  {filteredResults.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectProduct(item)}
                      className="w-full flex items-center justify-between p-2 rounded-2xl hover:bg-white/10 transition-colors text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10" 
                        />
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-neutral-400">
                            {item.category} • ${item.price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* User Profile Modal */}
      <UserProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />
    </div>
  );
}
