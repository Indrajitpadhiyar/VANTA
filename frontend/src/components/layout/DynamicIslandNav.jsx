import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  ShoppingBag, 
  ShoppingCart, 
  Search, 
  User, 
  X, 
  ArrowRight, 
  TrendingUp,
  Check
} from 'lucide-react';
import { vantaLogo } from '../../assets';
import { PRODUCTS } from '../../data/products';
import { useCart, useUI } from '../../context';

export default function DynamicIslandNav() {
  const { totalCount, openCart, addToCart } = useCart();
  const { 
    openSearch: openGlobalSearch, 
    goHome, 
    viewProduct, 
    draggingProduct, 
    setDraggingProduct 
  } = useUI();

  const [isHovered, setIsHovered] = useState(false);
  const [activeItem, setActiveItem] = useState('Home');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragOverIsland, setIsDragOverIsland] = useState(false);
  const [justDropped, setJustDropped] = useState(null);
  
  const containerRef = useRef(null);
  const inputRef = useRef(null);

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

  return (
    <div ref={containerRef} className="fixed top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      {/* Main Dynamic Island Capsule with Apple-style fluid spring physics */}
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
          transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${justDropped
            ? 'w-auto px-4 py-2 border-emerald-500/60 shadow-[0_20px_50px_rgba(16,185,129,0.3)] animate-island-pop'
            : isDropTargetActive
              ? `w-[92vw] max-w-[460px] sm:w-[430px] px-3.5 py-2.5 border-orange-500 shadow-[0_0_35px_rgba(255,107,0,0.5),0_20px_45px_rgba(0,0,0,0.8)] animate-island-pulse ${isDragOverIsland ? 'scale-105 ring-2 ring-orange-500' : ''}`
              : isSearchActive 
                ? 'w-[92vw] max-w-[490px] px-3 sm:px-3.5 py-2 border-white/15 shadow-[0_25px_60px_rgba(255,107,0,0.28),0_0_0_1px_rgba(255,150,50,0.25)_inset]' 
                : isHovered 
                  ? 'scale-100 px-3 sm:px-4 py-2 border-white/15 shadow-[0_25px_60px_rgba(255,107,0,0.2),0_0_0_1px_rgba(255,150,50,0.2)_inset]' 
                  : 'scale-95 hover:scale-100 px-3 sm:px-4 py-2 border-white/15 shadow-[0_15px_35px_-8px_rgba(0,0,0,0.6)]'
          }
        `}
      >
        {/* Dynamic Island Brand Anchor with Official VANTA Logo */}
        <button 
          onClick={() => {
            setActiveItem('Home');
            goHome();
          }}
          className="flex items-center gap-1.5 pl-1 pr-2 border-r border-white/15 shrink-0 focus:outline-none cursor-pointer"
        >
          <div className="flex items-center justify-center">
            <img 
              src={vantaLogo} 
              alt="VANTA" 
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain transition-transform duration-300 hover:scale-105" 
            />
          </div>
          
          {/* Micro Brand Tag */}
          <div 
            className={`flex items-center overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]
              ${!isSearchActive && !isDropTargetActive && !justDropped && isHovered ? 'max-w-[120px] opacity-100 mr-1' : 'max-w-0 opacity-0'}
            `}
          >
            <span className="flex items-center text-[12px] font-bold tracking-wider uppercase text-white whitespace-nowrap pl-1 font-cute">
              VANTA<span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-[2px] ml-0.5"></span>
            </span>
          </div>
        </button>

        {/* STATE 1: JUST DROPPED SUCCESS CONFIRMATION ANIMATION */}
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
          /* STATE 2: ACTIVE DRAGGING - ISLAND MORPHS INTO MAGNETIC DROP TARGET */
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
        ) : (
          /* STATE 3: NORMAL NAVIGATION / SEARCH MODE */
          <>
            {/* 1. LEFT NAV ITEMS: Home, Collection, Cart */}
            <div 
              className={`flex items-center transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden shrink-0
                ${isSearchActive 
                  ? 'max-w-0 opacity-0 scale-75 pointer-events-none -mr-1' 
                  : 'max-w-[280px] opacity-100 scale-100 gap-1 sm:gap-1.5'
                }
              `}
            >
              {/* Home */}
              <button
                id="island-item-home"
                onClick={() => {
                  setActiveItem('Home');
                  goHome();
                }}
                className={`relative flex items-center rounded-full text-white/80 hover:text-white transition-all duration-300
                  ${isHovered ? 'px-3 py-1.5' : 'p-2'}
                  ${activeItem === 'Home' ? 'bg-white/15 text-white font-medium shadow-sm' : 'hover:bg-white/10'}
                `}
                title="Home"
              >
                <Home className={`w-4 h-4 sm:w-[18px] sm:h-[18px] transition-transform duration-300 ${activeItem === 'Home' ? 'text-orange-400' : ''}`} />
                <span className={`overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] text-xs tracking-wide ${isHovered ? 'max-w-[100px] opacity-100 ml-2 whitespace-nowrap' : 'max-w-0 opacity-0 ml-0'}`}>
                  Home
                </span>
                {activeItem === 'Home' && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-2 h-0.5 bg-orange-500 rounded-full" />}
              </button>

              {/* Collection */}
              <button
                id="island-item-collection"
                onClick={() => {
                  setActiveItem('Collection');
                  const el = document.getElementById('shop');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`relative flex items-center rounded-full text-white/80 hover:text-white transition-all duration-300
                  ${isHovered ? 'px-3 py-1.5' : 'p-2'}
                  ${activeItem === 'Collection' ? 'bg-white/15 text-white font-medium shadow-sm' : 'hover:bg-white/10'}
                `}
                title="Collection"
              >
                <ShoppingBag className={`w-4 h-4 sm:w-[18px] sm:h-[18px] transition-transform duration-300 ${activeItem === 'Collection' ? 'text-orange-400' : ''}`} />
                <span className={`overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] text-xs tracking-wide ${isHovered ? 'max-w-[100px] opacity-100 ml-2 whitespace-nowrap' : 'max-w-0 opacity-0 ml-0'}`}>
                  Collection
                </span>
                {activeItem === 'Collection' && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-2 h-0.5 bg-orange-500 rounded-full" />}
              </button>

              {/* Cart Button */}
              <button
                id="island-item-cart"
                onClick={(e) => {
                  e.preventDefault();
                  openCart();
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'copy';
                  setIsDragOverIsland(true);
                }}
                onDrop={handleDrop}
                className={`relative flex items-center rounded-full text-white/80 hover:text-white transition-all duration-300
                  ${isHovered ? 'px-3 py-1.5' : 'p-2'}
                  hover:bg-white/10
                `}
                title="Cart"
              >
                <div className="relative flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                  {totalCount > 0 && (
                    <span className="absolute -top-1 -right-1.5 min-w-[15px] h-[15px] flex items-center justify-center text-[9px] font-extrabold text-white bg-orange-600 rounded-full px-1 shadow-sm">
                      {totalCount}
                    </span>
                  )}
                </div>
                <span className={`overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] text-xs tracking-wide ${isHovered ? 'max-w-[100px] opacity-100 ml-2 whitespace-nowrap' : 'max-w-0 opacity-0 ml-0'}`}>
                  Cart
                </span>
              </button>
            </div>

            {/* 2. THE SEARCH UNIT: Search Icon + Fluidly Stretching Input Field */}
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
                      ? 'px-3 py-1.5 text-white/80 hover:text-white hover:bg-white/10' 
                      : 'p-2 text-white/80 hover:text-white hover:bg-white/10'
                  }
                `}
                title="Search"
              >
                <div className="relative flex items-center justify-center">
                  <Search className={`w-4 h-4 sm:w-[18px] sm:h-[18px] transition-transform duration-300 ${isSearchActive ? 'text-orange-400 scale-105' : ''}`} />
                </div>

                {!isSearchActive && (
                  <span className={`overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] text-xs tracking-wide ${isHovered ? 'max-w-[100px] opacity-100 ml-2 whitespace-nowrap' : 'max-w-0 opacity-0 ml-0'}`}>
                    Search
                  </span>
                )}
              </button>

              <div 
                className={`flex items-center overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left
                  ${isSearchActive 
                    ? 'max-w-[380px] sm:max-w-[430px] opacity-100 flex-1 ml-1.5 sm:ml-2' 
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
                  aria-label="Close search"
                >
                  <X className="w-4 h-4 text-neutral-300 hover:text-white" />
                </button>
              </div>
            </div>

            {/* 3. RIGHT NAV ITEM: Global Search Modal Trigger */}
            <div 
              className={`flex items-center transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden shrink-0
                ${isSearchActive 
                  ? 'max-w-0 opacity-0 scale-75 pointer-events-none -ml-1' 
                  : 'max-w-[120px] opacity-100 scale-100 ml-1 sm:ml-1.5'
                }
              `}
            >
              <button
                id="island-item-account"
                onClick={() => openGlobalSearch()}
                className={`relative flex items-center rounded-full text-white/80 hover:text-white transition-all duration-300
                  ${isHovered ? 'px-3 py-1.5' : 'p-2'}
                  hover:bg-white/10
                `}
                title="Account / Search"
              >
                <User className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                <span className={`overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] text-xs tracking-wide ${isHovered ? 'max-w-[100px] opacity-100 ml-2 whitespace-nowrap' : 'max-w-0 opacity-0 ml-0'}`}>
                  Account
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
        <div className="mt-2 w-[92vw] max-w-[490px] bg-neutral-950/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-4 shadow-[0_25px_50px_rgba(0,0,0,0.85),0_0_25px_rgba(255,107,0,0.2)] text-white animate-island-dropdown">
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
                    className="text-xs bg-white/10 hover:bg-orange-500 hover:text-white px-3 py-1.5 rounded-full text-neutral-300 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Instant Matches ({filteredResults.length})
              </div>

              {filteredResults.length === 0 ? (
                <div className="py-4 text-center text-sm text-neutral-500">
                  No products found for "{searchQuery}"
                </div>
              ) : (
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {filteredResults.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectProduct(item)}
                      className="flex items-center justify-between p-2 rounded-2xl hover:bg-white/10 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-orange-400 transition-colors line-clamp-1">
                            {item.name}
                          </h4>
                          <span className="text-[11px] text-neutral-400">{item.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-white">${item.price}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-1 group-hover:text-orange-400 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
