import React, { useState } from 'react';
import { ShoppingBag, Heart, Check } from 'lucide-react';
import { useCart, useUI } from '../../../context';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { viewProduct, setDraggingProduct } = useUI();

  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    setIsAdded(true);
    addToCart(product);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(prev => !prev);
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('application/json', JSON.stringify(product));
    e.dataTransfer.effectAllowed = 'copy';
    setIsDragging(true);
    setDraggingProduct(product);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggingProduct(null);
  };

  return (
    <div
      draggable={true}
      onClick={() => viewProduct(product)}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`group relative bg-white rounded-3xl p-4 border border-neutral-100/80 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-500 flex flex-col cursor-pointer select-none
        ${isDragging ? 'opacity-40 scale-95 ring-2 ring-orange-500 shadow-2xl rotate-1' : 'hover:-translate-y-1.5'}
      `}
    >
      {/* Drag Prompt Tooltip on Hover */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20">
        <span className="flex items-center gap-1.5 px-3 py-1 bg-neutral-950 text-white text-[11px] font-bold rounded-full shadow-2xl border border-white/20 whitespace-nowrap font-cute">
          Drag to Island or Click for Details
        </span>
      </div>

      {/* Product Image Frame */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-neutral-50 mb-5 pointer-events-none">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Badge Tag */}
        <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[11px] font-bold text-neutral-900 uppercase tracking-wider shadow-sm font-cute">
          {product.tag}
        </span>

        {/* Wishlist Button */}
        <button
          onClick={handleLike}
          aria-label="Save to Wishlist"
          className="pointer-events-auto absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-neutral-700 hover:text-orange-600 shadow-sm transition-transform duration-200 hover:scale-110 active:scale-95"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-orange-500 text-orange-500' : ''}`} />
        </button>
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider font-cute">
            {product.color}
          </span>
          <span className="text-base sm:text-lg font-black text-neutral-950 font-cute">
            ₹{typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
          </span>
        </div>

        <h3 className="text-lg font-bold text-neutral-900 group-hover:text-orange-600 transition-colors duration-200 mb-2 font-cute">
          {product.name}
        </h3>

        <p className="text-xs text-neutral-500 line-clamp-2 mb-5 leading-relaxed font-sans">
          {product.desc}
        </p>

        {/* Add to Cart button */}
        <button
          onClick={handleAdd}
          className={`mt-auto w-full py-3 px-4 rounded-2xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-sm font-cute ${
            isAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-neutral-950 text-white hover:bg-orange-600 active:scale-98'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              Added to Bag!
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 stroke-[2]" />
              Add to Bag
            </>
          )}
        </button>
      </div>
    </div>
  );
}
