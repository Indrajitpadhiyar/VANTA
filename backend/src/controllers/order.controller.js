import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { OrderService } from '../services/order.service.js';
import { HttpStatusCodes } from '../constants/httpStatusCodes.js';
import { ApiError } from '../utils/apiError.js';

export const OrderController = {
  createOrder: asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod } = req.body;
    const order = await OrderService.createOrder(req.user._id, {
      orderItems,
      shippingAddress,
      paymentMethod,
    });
    res.status(HttpStatusCodes.CREATED).json(
      ApiResponse.created(order, 'Order created successfully.')
    );
  }),

  getOrderById: asyncHandler(async (req, res) => {
    const order = await OrderService.getOrderById(req.params.id, req.user._id, req.user.role);
    res.status(HttpStatusCodes.OK).json(
      ApiResponse.success(order, 'Order retrieved successfully.')
    );
  }),

  getMyOrders: asyncHandler(async (req, res) => {
    const { data, meta } = await OrderService.getUserOrders(req.user._id, req.query);
    res.status(HttpStatusCodes.OK).json(
      ApiResponse.success(data, 'My orders retrieved successfully.', meta)
    );
  }),

  getAllOrders: asyncHandler(async (req, res) => {
    const { data, meta } = await OrderService.getAllOrders(req.query);
    res.status(HttpStatusCodes.OK).json(
      ApiResponse.success(data, 'All orders retrieved successfully.', meta)
    );
  }),

  updateOrderStatus: asyncHandler(async (req, res) => {
    const { orderStatus } = req.body;
    if (!orderStatus) {
      throw ApiError.badRequest('orderStatus field is required.');
    }
    const order = await OrderService.updateOrderStatus(req.params.id, orderStatus);
    res.status(HttpStatusCodes.OK).json(
      ApiResponse.success(order, 'Order status updated successfully.')
    );
  }),

  payOrder: asyncHandler(async (req, res) => {
    const order = await OrderService.markOrderAsPaid(req.params.id, req.body);
    res.status(HttpStatusCodes.OK).json(
      ApiResponse.success(order, 'Order marked as paid.')
    );
  }),
};
