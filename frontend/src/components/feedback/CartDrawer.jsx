import React from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck, UserCheck } from 'lucide-react';
import { useCart, useUI, useAuth } from '../../context';

export default function CartDrawer({
  isOpen: propIsOpen,
  onClose: propOnClose,
  cartItems: propCartItems,
  onUpdateQuantity: propOnUpdateQuantity,
  onRemoveItem: propOnRemoveItem
}) {
  const cartContext = useCart();
  const { openAuth } = useUI();
  const { isAuthenticated, user } = useAuth();

  const isOpen = propIsOpen !== undefined ? propIsOpen : cartContext.isCartOpen;
  const onClose = propOnClose || cartContext.closeCart;
  const cartItems = propCartItems || cartContext.cartItems;
  const onUpdateQuantity = propOnUpdateQuantity || cartContext.updateQuantity;
  const onRemoveItem = propOnRemoveItem || cartContext.removeItem;

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const freeShippingThreshold = 200;
  const progress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const diff = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-bold text-neutral-950 font-cute">
                Your Bag ({cartItems.reduce((sum, i) => sum + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Tier */}
          <div className="bg-neutral-50 px-6 py-3 border-b border-neutral-100">
            <div className="flex justify-between text-xs font-semibold text-neutral-700 mb-1.5">
              <span>{diff > 0 ? `Add ₹${diff.toFixed(2)} more for Free Express Shipping` : '🎉 You unlocked Free Express Shipping!'}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-500 font-medium font-cute">Your shopping bag is empty</p>
                <button
                  onClick={onClose}
                  className="mt-4 px-6 py-2.5 bg-neutral-950 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-orange-600 transition-colors font-cute"
                >
                  Explore Drops
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 bg-neutral-50/70 border border-neutral-100 rounded-2xl">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover bg-white"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-semibold text-neutral-900 line-clamp-1 font-cute">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-neutral-400 hover:text-red-500 p-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {item.color || 'Standard Fit'} {item.selectedSize ? `• ${item.selectedSize}` : ''}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center border border-neutral-200 rounded-lg bg-white">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-0.5 text-neutral-600 hover:bg-neutral-100 rounded-l-lg text-sm font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-neutral-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-0.5 text-neutral-600 hover:bg-neutral-100 rounded-r-lg text-sm font-bold"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-black text-neutral-900 font-cute">
                        ₹{typeof item.price === 'number' ? (item.price * item.quantity).toFixed(2) : item.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-neutral-100 bg-white space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal</span>
                  <span className="text-neutral-900 font-semibold font-cute">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-semibold font-cute">
                    {diff === 0 ? 'FREE' : '₹15.00'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-neutral-950 pt-2 border-t border-neutral-100 font-cute">
                  <span>Total</span>
                  <span>₹{(subtotal + (diff === 0 ? 0 : 15)).toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  if (!isAuthenticated) {
                    onClose();
                    openAuth('login');
                  } else {
                    alert(`Order initiated for ${user.name}! Proceeding to gateway...`);
                  }
                }}
                className="w-full py-4 bg-neutral-950 hover:bg-orange-600 text-white rounded-2xl font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-orange-500/25 flex items-center justify-center gap-2 group font-cute cursor-pointer"
              >
                <span>{isAuthenticated ? 'Proceed to Checkout' : 'Sign In to Checkout'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <div className="flex items-center justify-center gap-2 text-neutral-400 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Encrypted 256-bit checkout • 14-day global returns</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
