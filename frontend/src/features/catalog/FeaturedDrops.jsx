import React, { useState } from 'react';
import { vantaLogo } from '../../assets';
import { PRODUCTS, CATEGORIES } from '../../data/products';
import { ProductCard } from './components';

export default function FeaturedDrops() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = activeCategory === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <section id="shop" className="relative w-full max-w-7xl mx-auto px-6 sm:px-10 py-16 sm:py-24 border-t border-neutral-100">
      {/* Header & Category Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/60 text-orange-600 text-xs font-bold tracking-wider uppercase mb-3 font-cute">
            <img src={vantaLogo} alt="VANTA" className="w-3.5 h-3.5 object-contain" />
            Curated Essentials
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
