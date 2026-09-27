import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ReviewService } from '../services/review.service.js';
import { HttpStatusCodes } from '../constants/httpStatusCodes.js';
import { ApiError } from '../utils/apiError.js';

export const ReviewController = {
  getProductReviews: asyncHandler(async (req, res) => {
    const { data, meta } = await ReviewService.getProductReviews(req.params.productId, req.query);
    res.status(HttpStatusCodes.OK).json(
      ApiResponse.success(data, 'Product reviews retrieved successfully.', meta)
    );
  }),

  createReview: asyncHandler(async (req, res) => {
    const { rating, comment, avatar } = req.body;
    if (!rating || !comment) {
      throw ApiError.badRequest('Rating and comment are required.');
    }

    const review = await ReviewService.createReview(
      req.user._id,
      req.user.name,
      req.params.productId,
      rating,
      comment,
      avatar || req.user.avatar?.url
    );

    res.status(HttpStatusCodes.CREATED).json(
      ApiResponse.created(review, 'Review submitted successfully.')
    );
  }),

  deleteReview: asyncHandler(async (req, res) => {
    const result = await ReviewService.deleteReview(
      req.params.id,
      req.user._id,
      req.user.role
    );
    res.status(HttpStatusCodes.OK).json(
      ApiResponse.success(null, result.message)
    );
  }),
};
