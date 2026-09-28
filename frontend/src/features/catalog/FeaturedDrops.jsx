import React, { useState, useEffect } from 'react';
import { vantaLogo } from '../../assets';
import { PRODUCTS, CATEGORIES } from '../../data/products';
import { ProductCard } from './components';
import { productsApi } from '../../services';

export default function FeaturedDrops() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [liveProducts, setLiveProducts] = useState(PRODUCTS);
  const [isLoading, setIsLoading] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const params = activeCategory === 'All' ? {} : { category: activeCategory };

    productsApi.getAll(params)
      .then((res) => {
        if (isMounted && res?.data && Array.isArray(res.data) && res.data.length > 0) {
          // Normalize items so each item has id, image, and secondaryImage
          const normalized = res.data.map((item) => ({
            ...item,
            id: item._id || item.id,
          }));
          setLiveProducts(normalized);
          setIsBackendConnected(true);
        } else if (isMounted) {
          // Fallback to local catalog if category has no backend items
          const localFiltered = activeCategory === 'All'
            ? PRODUCTS
            : PRODUCTS.filter((p) => p.category === activeCategory);
          setLiveProducts(localFiltered);
        }
      })
      .catch(() => {
        if (isMounted) {
          // Graceful fallback to local catalog on error
          const localFiltered = activeCategory === 'All'
            ? PRODUCTS
            : PRODUCTS.filter((p) => p.category === activeCategory);
          setLiveProducts(localFiltered);
          setIsBackendConnected(false);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeCategory]);

  return (
    <section id="shop" className="relative w-full max-w-7xl mx-auto px-6 sm:px-10 py-16 sm:py-24 border-t border-neutral-100">
      {/* Header & Category Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/60 text-orange-600 text-xs font-bold tracking-wider uppercase mb-3 font-cute">
            <img src={vantaLogo} alt="VANTA" className="w-3.5 h-3.5 object-contain" />
            <span>Curated Essentials</span>
            {isBackendConnected && (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-extrabold bg-emerald-100/70 px-1.5 py-0.5 rounded-full ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live DB
              </span>
            )}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight font-cute flex items-center">
            Featured Spring Drops<span className="inline-block w-2 h-2 bg-red-600 rounded-[2px] ml-1.5"></span>
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 font-cute cursor-pointer ${
                activeCategory === cat
                  ? 'bg-neutral-950 text-white shadow-md'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="rounded-3xl p-4 border border-neutral-100 bg-neutral-50/50 animate-pulse space-y-4">
              <div className="w-full aspect-square rounded-2xl bg-neutral-200" />
              <div className="h-4 bg-neutral-200 rounded w-3/4" />
              <div className="h-4 bg-neutral-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {liveProducts.map((product) => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
