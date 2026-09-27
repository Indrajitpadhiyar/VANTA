import mongoose from 'mongoose';
import { Category } from '../models/Category.model.js';
import { ApiError } from '../utils/apiError.js';

/**
 * Category Management Service
 */
export const CategoryService = {
  getAllCategories: async () => {
    return await Category.find({ isActive: true }).sort('name');
  },

  getCategoryById: async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw ApiError.badRequest('Invalid category ID format.');
    }
    const category = await Category.findById(id);
    if (!category) {
      throw ApiError.notFound('Category not found.');
    }
    return category;
  },

  createCategory: async (categoryData) => {
    const existing = await Category.findOne({ name: categoryData.name });
    if (existing) {
      throw ApiError.conflict(`Category '${categoryData.name}' already exists.`);
    }
    return await Category.create(categoryData);
  },

  updateCategory: async (id, updateData) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw ApiError.badRequest('Invalid category ID format.');
    }
    const updated = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      throw ApiError.notFound('Category not found.');
    }
    return updated;
  },

  deleteCategory: async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw ApiError.badRequest('Invalid category ID format.');
    }
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      throw ApiError.notFound('Category not found.');
    }
    return { message: 'Category deleted successfully.' };
  },
};
