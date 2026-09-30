import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ProductService } from '../services/product.service.js';
import { UploadService } from '../services/upload.service.js';
import { HttpStatusCodes } from '../constants/httpStatusCodes.js';
import { ApiError } from '../utils/apiError.js';

export const ProductController = {
  /**
   * Get all products with filtering, search, sorting, and pagination
   */
  getProducts: asyncHandler(async (req, res) => {
    const { data, meta } = await ProductService.getAllProducts(req.query);
    res.status(HttpStatusCodes.OK).json(
      ApiResponse.success(data, 'Products retrieved successfully.', meta)
    );
  }),

  /**
   * Get single product by ID or Slug
   */
  getProduct: asyncHandler(async (req, res) => {
    const product = await ProductService.getProductByIdOrSlug(req.params.idOrSlug);
    res.status(HttpStatusCodes.OK).json(
      ApiResponse.success(product, 'Product retrieved successfully.')
    );
  }),

  /**
   * Get featured products showcase
   */
  getFeatured: asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 8;
    const featured = await ProductService.getFeaturedProducts(limit);
    res.status(HttpStatusCodes.OK).json(
      ApiResponse.success(featured, 'Featured products retrieved successfully.')
    );
  }),

  /**
   * Get related products by category
   */
  getRelated: asyncHandler(async (req, res) => {
    const { productId, category } = req.query;
    let related = [];
    if (category) {
      related = await ProductService.getRelatedProducts(productId, category);
    }
    if (!related || related.length === 0) {
      related = await ProductService.getFeaturedProducts(4);
    }
    res.status(HttpStatusCodes.OK).json(
      ApiResponse.success(related, 'Related products retrieved successfully.')
    );
  }),

  /**
   * Get summary of product categories
   */
  getCategoriesSummary: asyncHandler(async (req, res) => {
    const categories = await ProductService.getCategoriesSummary();
    res.status(HttpStatusCodes.OK).json(
      ApiResponse.success(categories, 'Categories summary retrieved successfully.')
    );
  }),

  /**
   * Create new product (Admin)
   */
  createProduct: asyncHandler(async (req, res) => {
    const product = await ProductService.createProduct(req.body);
    res.status(HttpStatusCodes.CREATED).json(
      ApiResponse.created(product, 'Product created successfully.')
    );
  }),

  /**
   * Update product (Admin)
   */
  updateProduct: asyncHandler(async (req, res) => {
    const updated = await ProductService.updateProduct(req.params.id, req.body);
    res.status(HttpStatusCodes.OK).json(
      ApiResponse.success(updated, 'Product updated successfully.')
    );
  }),

  /**
   * Delete product (Admin)
   */
  deleteProduct: asyncHandler(async (req, res) => {
    const result = await ProductService.deleteProduct(req.params.id);
    res.status(HttpStatusCodes.OK).json(
      ApiResponse.success(null, result.message)
    );
  }),

  /**
   * Upload image to Cloudinary (Admin)
   */
  uploadImage: asyncHandler(async (req, res) => {
    if (!req.file) {
      throw ApiError.badRequest('Please upload an image file.');
    }

    const uploaded = await UploadService.uploadImageBuffer(
      req.file.buffer,
      'vanta_store/products'
    );

    res.status(HttpStatusCodes.CREATED).json(
      ApiResponse.created(uploaded, 'Image uploaded successfully to Cloudinary.')
    );
  }),

  /**
   * Upload multiple images to Cloudinary (Admin)
   */
  uploadMultipleImages: asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
      throw ApiError.badRequest('Please upload at least one image file.');
    }

    const uploadPromises = req.files.map((file) =>
      UploadService.uploadImageBuffer(file.buffer, 'vanta_store/products')
    );

    const uploaded = await Promise.all(uploadPromises);

    res.status(HttpStatusCodes.CREATED).json(
      ApiResponse.created(uploaded, 'Images uploaded successfully to Cloudinary.')
    );
  }),
};
