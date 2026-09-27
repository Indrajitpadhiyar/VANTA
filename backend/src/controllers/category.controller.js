import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { CategoryService } from '../services/category.service.js';
import { HttpStatusCodes } from '../constants/httpStatusCodes.js';
import { ApiError } from '../utils/apiError.js';

export const CategoryController = {
  getCategories: asyncHandler(async (req, res) => {
    const categories = await CategoryService.getAllCategories();
    res.status(HttpStatusCodes.OK).json(
      ApiResponse.success(categories, 'Categories retrieved successfully.')
    );
  }),

  getCategory: asyncHandler(async (req, res) => {
    const category = await CategoryService.getCategoryById(req.params.id);
    res.status(HttpStatusCodes.OK).json(
      ApiResponse.success(category, 'Category retrieved successfully.')
    );
  }),

  createCategory: asyncHandler(async (req, res) => {
    const { name, description, image } = req.body;
    if (!name) {
      throw ApiError.badRequest('Category name is required.');
    }
    const category = await CategoryService.createCategory({ name, description, image });
    res.status(HttpStatusCodes.CREATED).json(
      ApiResponse.created(category, 'Category created successfully.')
    );
  }),

  updateCategory: asyncHandler(async (req, res) => {
    const updated = await CategoryService.updateCategory(req.params.id, req.body);
    res.status(HttpStatusCodes.OK).json(
      ApiResponse.success(updated, 'Category updated successfully.')
    );
  }),

  deleteCategory: asyncHandler(async (req, res) => {
    const result = await CategoryService.deleteCategory(req.params.id);
    res.status(HttpStatusCodes.OK).json(
      ApiResponse.success(null, result.message)
    );
  }),
};
