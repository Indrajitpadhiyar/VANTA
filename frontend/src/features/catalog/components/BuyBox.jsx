import React, { useState } from 'react';
import { 
  Heart, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Tag, 
  Package, 
  Clock, 
  Truck 
} from 'lucide-react';
import { useCountdown } from '../../../hooks';
import { useCart } from '../../../context';

export default function BuyBox({ product }) {
  const { addToCart } = useCart();
  const { formatted } = useCountdown(2, 30, 26);

  const [selectedSize, setSelectedSize] = useState('S');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [isDescOpen, setIsDescOpen] = useState(true);
  const [isShippingOpen, setIsShippingOpen] = useState(true);

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  const handleAdd = () => {
    addToCart({
      ...product,
      selectedSize
    });
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  return (
    <div className="flex flex-col justify-start">
      {/* Category Pill Tag */}
      <div className="mb-3">
        <span className="inline-block px-3.5 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider font-cute">
          {product.category || 'Men Fashion'}
        </span>
      </div>

      {/* Product Title */}
      <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-neutral-950 mb-3 font-cute leading-tight">
        {product.name}
      </h1>

      {/* Price */}
      <div className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-cute mb-5">
        ₹{typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
      </div>

      {/* Next Day Delivery Countdown Notice */}
      <div className="flex items-center gap-2 p-3 bg-neutral-50 border border-neutral-200/70 rounded-2xl text-xs sm:text-sm text-neutral-700 mb-6 shadow-sm">
        <Info className="w-4 h-4 text-neutral-600 shrink-0" />
        <span className="font-sans">
          Order in <strong className="font-bold text-neutral-950 font-cute">{formatted}</strong> to get next day delivery
        </span>
      </div>

      {/* Size Selector */}
      <div className="mb-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2.5 font-cute">
          Select Size
        </label>
        <div className="flex flex-wrap gap-2.5">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`min-w-[48px] h-11 px-3.5 rounded-full text-xs font-extrabold transition-all duration-200 flex items-center justify-center font-cute cursor-pointer
                ${selectedSize === size
                  ? 'bg-neutral-950 text-white shadow-md scale-105'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }
              `}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Action Buttons: Add to Cart & Wishlist */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={handleAdd}
          className="flex-1 py-3.5 px-6 rounded-full bg-neutral-950 hover:bg-orange-600 text-white text-sm sm:text-base font-bold tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 font-cute cursor-pointer"
        >
          {addedAnimation ? (
            <>
              <Check className="w-5 h-5 text-emerald-400 stroke-[3]" />
              Added to Cart!
            </>
          ) : (
            'Add to Cart'
          )}
        </button>

        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          aria-label="Wishlist"
          className={`p-3.5 rounded-full border transition-all duration-200 flex items-center justify-center active:scale-95 cursor-pointer
            ${isWishlisted 
              ? 'border-orange-500 bg-orange-50 text-orange-600 shadow-sm' 
              : 'border-neutral-200 hover:border-neutral-300 text-neutral-700 hover:bg-neutral-50'
            }
          `}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-orange-500 text-orange-500' : ''}`} />
        </button>
      </div>

      {/* Collapsible Accordions: Description & Shipping */}
      <div className="border-t border-neutral-200 divide-y divide-neutral-200">
        {/* Accordion 1: Description & Fit */}
        <div className="py-4">
          <button
            onClick={() => setIsDescOpen(!isDescOpen)}
            className="w-full flex items-center justify-between text-left py-1 text-sm sm:text-base font-bold text-neutral-950 font-cute cursor-pointer"
          >
            <span>Description & Fit</span>
            {isDescOpen ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
          </button>
          {isDescOpen && (
            <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
              {product.desc || 'Loose-fit sweatshirt hoodie in medium weight cotton-blend fabric with a generous, but not oversized silhouette. Jersey-lined, drawstring hood, dropped shoulders, long sleeves, and a kangaroo pocket. Wide ribbing at cuffs and hem. Soft, brushed inside.'}
            </p>
          )}
        </div>

        {/* Accordion 2: Shipping */}
        <div className="py-4">
          <button
            onClick={() => setIsShippingOpen(!isShippingOpen)}
            className="w-full flex items-center justify-between text-left py-1 text-sm sm:text-base font-bold text-neutral-950 font-cute cursor-pointer"
          >
            <span>Shipping</span>
            {isShippingOpen ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
          </button>
          {isShippingOpen && (
            <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                <div className="w-7 h-7 rounded-full bg-neutral-950 text-white flex items-center justify-center shrink-0">
                  <Tag className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400 font-semibold uppercase font-cute">Discount</div>
                  <div className="text-xs font-bold text-neutral-900 font-cute">Disc 50%</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                <div className="w-7 h-7 rounded-full bg-neutral-950 text-white flex items-center justify-center shrink-0">
                  <Package className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400 font-semibold uppercase font-cute">Package</div>
                  <div className="text-xs font-bold text-neutral-900 font-cute">Regular Package</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                <div className="w-7 h-7 rounded-full bg-neutral-950 text-white flex items-center justify-center shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400 font-semibold uppercase font-cute">Delivery Time</div>
                  <div className="text-xs font-bold text-neutral-900 font-cute">3-4 Working Days</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                <div className="w-7 h-7 rounded-full bg-neutral-950 text-white flex items-center justify-center shrink-0">
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400 font-semibold uppercase font-cute">Estimation Arrive</div>
                  <div className="text-xs font-bold text-neutral-900 font-cute">10 - 12 October 2026</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
