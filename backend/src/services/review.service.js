import mongoose from 'mongoose';
import { Review } from '../models/Review.model.js';
import { Product } from '../models/Product.model.js';
import { ApiError } from '../utils/apiError.js';
import { QueryBuilder } from '../utils/queryBuilder.js';

/**
 * Review & Rating Business Logic Service
 */
export const ReviewService = {
  /**
   * Get paginated reviews for a specific product
   * @param {string} productId
   * @param {Object} queryString
   */
  getProductReviews: async (productId, queryString) => {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw ApiError.badRequest('Invalid product ID.');
    }

    const baseQuery = Review.find({ product: productId }).sort('-createdAt');
    const features = new QueryBuilder(baseQuery, queryString).paginate(10);
    return await features.executeWithMeta(Review);
  },

  /**
   * Create a new product review
   * @param {string} userId
   * @param {string} author
   * @param {string} productId
   * @param {number} rating
   * @param {string} comment
   * @param {string} avatar
   */
  createReview: async (userId, author, productId, rating, comment, avatar) => {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw ApiError.badRequest('Invalid product ID.');
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      throw ApiError.notFound('Product not found.');
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ product: productId, user: userId });
    if (existingReview) {
      throw ApiError.conflict('You have already submitted a review for this product.');
    }

    const review = await Review.create({
      product: productId,
      user: userId,
      author,
      rating: Number(rating),
      comment: comment.trim(),
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    });

    return review;
  },

  /**
   * Delete review by author or admin
   * @param {string} reviewId
   * @param {string} userId
   * @param {string} userRole
   */
  deleteReview: async (reviewId, userId, userRole) => {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw ApiError.badRequest('Invalid review ID.');
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      throw ApiError.notFound('Review not found.');
    }

    if (userRole !== 'admin' && review.user.toString() !== userId.toString()) {
      throw ApiError.forbidden('You are not authorized to delete this review.');
    }

    await Review.findOneAndDelete({ _id: reviewId });
    return { message: 'Review deleted successfully.' };
  },
};
