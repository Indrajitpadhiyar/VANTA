import mongoose from 'mongoose';
import { Product } from '../models/Product.model.js';
import { ApiError } from '../utils/apiError.js';
import { QueryBuilder } from '../utils/queryBuilder.js';
import { UploadService } from './upload.service.js';
import { logger } from '../utils/logger.js';

/**
 * Product Catalog Business Logic Service
 */
export const ProductService = {
  /**
   * Get all active products with dynamic filtering, full-text search, sorting, and pagination
   * @param {Object} queryString - Express req.query
   */
  getAllProducts: async (queryString) => {
    const baseQuery = Product.find({ isActive: true });

    const features = new QueryBuilder(baseQuery, queryString)
      .filter()
      .search(['name', 'desc', 'category', 'tag', 'color'])
      .sort()
      .limitFields()
      .paginate(12);

    return await features.executeWithMeta(Product);
  },

  /**
   * Find product by MongoDB ObjectId or Slug
   * @param {string} identifier - ObjectId string or unique slug
   */
  getProductByIdOrSlug: async (identifier) => {
    let product;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      product = await Product.findById(identifier);
    } else {
      product = await Product.findOne({ slug: identifier, isActive: true });
    }

    if (!product) {
      throw ApiError.notFound(`Product not found for identifier '${identifier}'.`);
    }

    return product;
  },

  /**
   * Retrieve featured drops / showcase products
   * @param {number} [limit=8]
   */
  getFeaturedProducts: async (limit = 8) => {
    return await Product.find({ isActive: true, isFeatured: true })
      .sort('-createdAt')
      .limit(limit);
  },

  /**
   * Fetch related products matching the category, excluding the current product
   * @param {string} productId
   * @param {string} category
   * @param {number} [limit=4]
   */
  getRelatedProducts: async (productId, category, limit = 4) => {
    const filter = {
      isActive: true,
      category,
    };

    if (mongoose.Types.ObjectId.isValid(productId)) {
      filter._id = { $ne: productId };
    }

    return await Product.find(filter).limit(limit);
  },

  /**
   * Helper to normalize and upload base64 images to Cloudinary
   */
  processBase64Images: async (data) => {
    const clone = { ...data };

    // Process primary image
    if (clone.image && typeof clone.image === 'string' && clone.image.startsWith('data:image/')) {
      try {
        const uploaded = await UploadService.uploadBase64(clone.image);
        clone.image = uploaded.url;
      } catch (err) {
        logger.warn('Failed to upload primary base64 image to Cloudinary:', err.message);
      }
    }

    // Process secondary image
    if (clone.secondaryImage && typeof clone.secondaryImage === 'string' && clone.secondaryImage.startsWith('data:image/')) {
      try {
        const uploaded = await UploadService.uploadBase64(clone.secondaryImage);
        clone.secondaryImage = uploaded.url;
      } catch (err) {
        logger.warn('Failed to upload secondary base64 image to Cloudinary:', err.message);
      }
    }

    // Process gallery images
    if (Array.isArray(clone.gallery)) {
      clone.gallery = await Promise.all(
        clone.gallery.map(async (item) => {
          if (typeof item === 'string' && item.startsWith('data:image/')) {
            try {
              const res = await UploadService.uploadBase64(item);
              return res.url;
            } catch {
              return item;
            }
          }
          return item;
        })
      );
    }

    return clone;
  },

  /**
   * Create a new product (Admin)
   * @param {Object} productData
   */
  createProduct: async (productData) => {
    const processedData = await ProductService.processBase64Images(productData);
    return await Product.create(processedData);
  },

  /**
   * Update existing product by ID (Admin)
   * @param {string} id
   * @param {Object} updateData
   */
  updateProduct: async (id, updateData) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw ApiError.badRequest('Invalid product ID format.');
    }

    const processedData = await ProductService.processBase64Images(updateData);
    const updatedProduct = await Product.findByIdAndUpdate(id, processedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      throw ApiError.notFound('Product to update does not exist.');
    }

    return updatedProduct;
  },

  /**
   * Soft delete or hard delete product (Admin)
   * @param {string} id
   */
  deleteProduct: async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw ApiError.badRequest('Invalid product ID format.');
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      throw ApiError.notFound('Product to delete does not exist.');
    }

    return { message: 'Product deleted successfully.' };
  },

  /**
   * Get distinct categories with count of products
   */
  getCategoriesSummary: async () => {
    const categories = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { name: '$_id', count: 1, _id: 0 } },
      { $sort: { name: 1 } },
    ]);

    return categories;
  },
};
