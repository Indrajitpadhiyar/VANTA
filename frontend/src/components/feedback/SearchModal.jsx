import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { useUI } from '../../context';
import { productsApi, categoriesApi } from '../../services';

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
  const [results, setResults] = useState([]);
  const [quickSearches, setQuickSearches] = useState(['Footwear', 'Hoodies', 'Tracksuits']);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch categories to populate dynamic popular pills
  useEffect(() => {
    let isMounted = true;
    categoriesApi
      .getAll()
      .then((res) => {
        if (isMounted && res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const names = res.data.map((c) => c.name);
          setQuickSearches(names);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Keyboard shortcut (Escape to close)
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

  // Live Database Search with 200ms debounce
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsSearching(true);

    const timer = setTimeout(() => {
      const params = query.trim() ? { search: query.trim(), limit: 12 } : { limit: 12 };
      productsApi
        .getAll(params)
        .then((res) => {
          if (isMounted && res?.data && Array.isArray(res.data)) {
            setResults(res.data);
          } else if (isMounted) {
            setResults([]);
          }
        })
        .catch(() => {
          if (isMounted) setResults([]);
        })
        .finally(() => {
          if (isMounted) setIsSearching(false);
        });
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query, isOpen]);

  if (!isOpen) return null;

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
            placeholder="Search live catalog in database..."
            autoFocus
            className="w-full bg-transparent text-white placeholder-neutral-500 text-base sm:text-lg focus:outline-none font-medium font-cute"
          />
          {isSearching && <Loader2 className="w-4 h-4 text-orange-400 animate-spin mr-2" />}
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        {quickSearches.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1 font-cute">
              <Sparkles className="w-3 h-3 text-orange-400" />
              Categories:
            </span>
            {quickSearches.slice(0, 5).map((tag, idx) => (
              <button
                key={idx}
                onClick={() => setQuery(tag)}
                className="text-xs bg-white/10 hover:bg-orange-500 hover:text-white px-2.5 py-1 rounded-full text-neutral-300 transition-colors font-cute cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2 font-cute">
            Instant Matches ({results.length})
          </div>

          {results.length === 0 ? (
            <div className="py-8 text-center text-neutral-500 text-sm font-cute">
              {query.trim()
                ? `No matching pieces found in database for "${query}"`
                : 'No products in database yet'}
            </div>
          ) : (
            results.map((item) => (
              <div
                key={item._id || item.id}
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
