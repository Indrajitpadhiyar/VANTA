import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { CartService } from '../services/cart.service.js';
import { HttpStatusCodes } from '../constants/httpStatusCodes.js';
import { ApiError } from '../utils/apiError.js';

export const CartController = {
  getCart: asyncHandler(async (req, res) => {
    const cart = await CartService.getCartByUserId(req.user._id);
    res.status(HttpStatusCodes.OK).json(
      ApiResponse.success(cart, 'Cart retrieved successfully.')
    );
  }),

  addToCart: asyncHandler(async (req, res) => {
    const { productId, size, color, quantity } = req.body;
    if (!productId) {
      throw ApiError.badRequest('Product ID is required.');
    }
    const cart = await CartService.addItemToCart(req.user._id, {
      productId,
      size,
      color,
      quantity: Number(quantity) || 1,
    });
    res.status(HttpStatusCodes.OK).json(
      ApiResponse.success(cart, 'Item added to cart.')
    );
  }),

  updateCartItem: asyncHandler(async (req, res) => {
    const { quantity } = req.body;
    if (quantity === undefined) {
      throw ApiError.badRequest('Quantity is required.');
    }
    const cart = await CartService.updateItemQuantity(req.user._id, req.params.itemId, Number(quantity));
    res.status(HttpStatusCodes.OK).json(
      ApiResponse.success(cart, 'Cart updated.')
    );
  }),

  removeItem: asyncHandler(async (req, res) => {
    const cart = await CartService.removeItemFromCart(req.user._id, req.params.itemId);
    res.status(HttpStatusCodes.OK).json(
      ApiResponse.success(cart, 'Item removed from cart.')
    );
  }),

  clearCart: asyncHandler(async (req, res) => {
    const result = await CartService.clearCart(req.user._id);
    res.status(HttpStatusCodes.OK).json(
      ApiResponse.success(null, result.message)
    );
  }),

  syncGuestCart: asyncHandler(async (req, res) => {
    const { items } = req.body;
    const cart = await CartService.syncGuestCart(req.user._id, items);
    res.status(HttpStatusCodes.OK).json(
      ApiResponse.success(cart, 'Cart synchronized successfully.')
    );
  }),
};
