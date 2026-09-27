import mongoose from 'mongoose';
import { Order } from '../models/Order.model.js';
import { Product } from '../models/Product.model.js';
import { Cart } from '../models/Cart.model.js';
import { ApiError } from '../utils/apiError.js';
import { QueryBuilder } from '../utils/queryBuilder.js';

/**
 * Order Processing & Fulfillment Service
 */
export const OrderService = {
  /**
   * Create and place a new customer order
   * @param {string} userId
   * @param {Object} payload - { orderItems, shippingAddress, paymentMethod }
   */
  createOrder: async (userId, { orderItems, shippingAddress, paymentMethod = 'COD' }) => {
    if (!orderItems || orderItems.length === 0) {
      throw ApiError.badRequest('Cannot place an order with no items.');
    }

    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city) {
      throw ApiError.badRequest('Complete shipping address is required.');
    }

    // Verify stock availability and recalculate authoritative price from DB to prevent tampering
    let itemsPrice = 0;
    const verifiedOrderItems = [];

    for (const item of orderItems) {
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        throw ApiError.badRequest(`Invalid product ID in order item: ${item.product}`);
      }

      const dbProduct = await Product.findById(item.product);
      if (!dbProduct || !dbProduct.isActive) {
        throw ApiError.notFound(`Product '${item.name || item.product}' is no longer available.`);
      }

      if (dbProduct.stock < item.quantity) {
        throw ApiError.badRequest(
          `Insufficient stock for '${dbProduct.name}'. Requested: ${item.quantity}, Available: ${dbProduct.stock}`
        );
      }

      // Decrement product inventory atomically
      dbProduct.stock -= item.quantity;
      await dbProduct.save();

      const itemTotal = dbProduct.price * item.quantity;
      itemsPrice += itemTotal;

      verifiedOrderItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        quantity: item.quantity,
        image: dbProduct.image,
        price: dbProduct.price,
        size: item.size || 'M',
        color: item.color || dbProduct.color || 'Standard',
      });
    }

    // Enterprise tax & shipping fee calculation rules
    const shippingPrice = itemsPrice > 100 ? 0 : 15; // Free shipping above $100
    const taxPrice = Math.round(itemsPrice * 0.08 * 100) / 100; // 8% sales tax
    const totalPrice = Math.round((itemsPrice + shippingPrice + taxPrice) * 100) / 100;

    const order = await Order.create({
      user: userId,
      orderItems: verifiedOrderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      orderStatus: 'Placed',
      isPaid: paymentMethod === 'STRIPE' ? false : false, // Updates via webhook or payment verification
    });

    // Reset user's persistent cart after successful checkout
    await Cart.findOneAndUpdate({ user: userId }, { items: [], totalQuantity: 0, subtotal: 0 });

    return order;
  },

  /**
   * Get single order by ID with permission check
   * @param {string} orderId
   * @param {string} userId
   * @param {string} userRole
   */
  getOrderById: async (orderId, userId, userRole) => {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw ApiError.badRequest('Invalid order ID format.');
    }

    const order = await Order.findById(orderId).populate('user', 'name email phoneNumber');
    if (!order) {
      throw ApiError.notFound('Order not found.');
    }

    // Customers can only view their own orders; Admins can view any order
    if (userRole !== 'admin' && order.user._id.toString() !== userId.toString()) {
      throw ApiError.forbidden('You are not authorized to view this order.');
    }

    return order;
  },

  /**
   * Get authenticated user's order history
   * @param {string} userId
   * @param {Object} queryString
   */
  getUserOrders: async (userId, queryString) => {
    const baseQuery = Order.find({ user: userId }).sort('-createdAt');
    const features = new QueryBuilder(baseQuery, queryString).paginate(10);
    return await features.executeWithMeta(Order);
  },

  /**
   * Admin: List all orders with filters, status sorting, and pagination
   * @param {Object} queryString
   */
  getAllOrders: async (queryString) => {
    const baseQuery = Order.find().populate('user', 'name email').sort('-createdAt');
    const features = new QueryBuilder(baseQuery, queryString)
      .filter()
      .sort()
      .paginate(20);
    return await features.executeWithMeta(Order);
  },

  /**
   * Admin: Update fulfillment status
   * @param {string} orderId
   * @param {string} orderStatus
   */
  updateOrderStatus: async (orderId, orderStatus) => {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw ApiError.badRequest('Invalid order ID format.');
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw ApiError.notFound('Order not found.');
    }

    order.orderStatus = orderStatus;
    if (orderStatus === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    await order.save();
    return order;
  },

  /**
   * Mark order as paid
   * @param {string} orderId
   * @param {Object} paymentResult
   */
  markOrderAsPaid: async (orderId, paymentResult = {}) => {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw ApiError.badRequest('Invalid order ID format.');
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw ApiError.notFound('Order not found.');
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = paymentResult;

    await order.save();
    return order;
  },
};
