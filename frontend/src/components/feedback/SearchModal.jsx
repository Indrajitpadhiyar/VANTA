import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { useUI } from '../../context';

export default function SearchModal({
  isOpen: propIsOpen,
  onClose: propOnClose,
  onSelectProduct: propOnSelectProduct
}) {
  const { isSearchOpen, closeSearch, viewProduct } = useUI();

  const isOpen = propIsOpen !== undefined ? propIsOpen : isSearchOpen;
  const onClose = propOnClose || closeSearch;
  const onSelectProduct = propOnSelectProduct || viewProduct;

  const [query, setQuery] = useState('');

  const quickSearches = [
    'Loose Fit Hoodie',
    'Orange Sweatshirt Set',
    'Heavyweight Black Hoodie',
    'Retro Court Sneakers',
    'Spring 2026 Lookbook'
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim() === ''
    ? PRODUCTS
    : PRODUCTS.filter(it => 
        it.name.toLowerCase().includes(query.toLowerCase()) || 
        it.category.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/60 backdrop-blur-md animate-fade-in">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative w-full max-w-xl bg-neutral-900 border border-white/15 rounded-3xl p-5 shadow-2xl text-white z-10 overflow-hidden">
        {/* Input Bar */}
        <div className="relative flex items-center border-b border-white/10 pb-4 mb-4">
          <Search className="w-5 h-5 text-orange-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search drops, hoodies, sneakers..."
            autoFocus
            className="w-full bg-transparent text-white placeholder-neutral-500 text-base sm:text-lg focus:outline-none font-medium font-cute"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1 font-cute">
            <Sparkles className="w-3 h-3 text-orange-400" />
            Popular:
          </span>
          {quickSearches.slice(0, 4).map((tag, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(tag)}
              className="text-xs bg-white/10 hover:bg-orange-500 hover:text-white px-2.5 py-1 rounded-full text-neutral-300 transition-colors font-cute"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2 font-cute">
            Instant Matches ({filtered.length})
          </div>

          {filtered.length === 0 ? (
            <div className="py-8 text-center text-neutral-500 text-sm">
              No matching pieces found for "{query}"
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectProduct(item);
                  onClose();
                }}
                className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-white/10 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-11 h-11 rounded-xl object-cover bg-neutral-800"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-orange-400 transition-colors font-cute">
                      {item.name}
                    </h4>
                    <span className="text-xs text-neutral-400">{item.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white font-cute">
                    ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                  </span>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 group-hover:text-orange-400 transition-transform" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
