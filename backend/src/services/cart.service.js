import mongoose from 'mongoose';
import { Cart } from '../models/Cart.model.js';
import { Product } from '../models/Product.model.js';
import { ApiError } from '../utils/apiError.js';

/**
 * User Cart Persistence Service
 */
export const CartService = {
  /**
   * Retrieve cart for user or create new empty cart
   * @param {string} userId
   */
  getCartByUserId: async (userId) => {
    let cart = await Cart.findOne({ user: userId }).populate('items.product', 'name price image stock slug');
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }
    return cart;
  },

  /**
   * Add item to user cart
   * @param {string} userId
   * @param {Object} itemData - { productId, size, color, quantity }
   */
  addItemToCart: async (userId, { productId, size = 'M', color = 'Black', quantity = 1 }) => {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw ApiError.badRequest('Invalid product ID format.');
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      throw ApiError.notFound('Product is unavailable or out of stock.');
    }

    if (product.stock < quantity) {
      throw ApiError.badRequest(`Insufficient stock. Only ${product.stock} items available.`);
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if item with matching product, size, and color already exists in cart
    const existingIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        size,
        color,
        quantity,
      });
    }

    await cart.save();
    return await Cart.findById(cart._id).populate('items.product', 'name price image stock slug');
  },

  /**
   * Update quantity of a cart item
   * @param {string} userId
   * @param {string} itemId
   * @param {number} quantity
   */
  updateItemQuantity: async (userId, itemId, quantity) => {
    if (quantity < 1) {
      throw ApiError.badRequest('Quantity must be at least 1.');
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw ApiError.notFound('Cart not found.');
    }

    const item = cart.items.id(itemId);
    if (!item) {
      throw ApiError.notFound('Item not found in cart.');
    }

    item.quantity = quantity;
    await cart.save();
    return cart;
  },

  /**
   * Remove item from cart
   * @param {string} userId
   * @param {string} itemId
   */
  removeItemFromCart: async (userId, itemId) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw ApiError.notFound('Cart not found.');
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    await cart.save();
    return cart;
  },

  /**
   * Clear all items in user's cart
   * @param {string} userId
   */
  clearCart: async (userId) => {
    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    return { message: 'Cart cleared successfully.' };
  },

  /**
   * Sync guest cart items with user's persisted cart upon login
   * @param {string} userId
   * @param {Array} guestItems
   */
  syncGuestCart: async (userId, guestItems = []) => {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    for (const gItem of guestItems) {
      const existing = cart.items.find(
        (i) =>
          i.product.toString() === gItem.id?.toString() &&
          i.size === gItem.size &&
          i.color === gItem.color
      );

      if (existing) {
        existing.quantity += gItem.quantity || 1;
      } else if (gItem.id && mongoose.Types.ObjectId.isValid(gItem.id)) {
        cart.items.push({
          product: gItem.id,
          name: gItem.name,
          price: gItem.price,
          image: gItem.image,
          size: gItem.size || 'M',
          color: gItem.color || 'Black',
          quantity: gItem.quantity || 1,
        });
      }
    }

    await cart.save();
    return cart;
  },
};
