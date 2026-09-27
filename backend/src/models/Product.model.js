import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required.'],
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Product category is required.'],
      index: true,
      trim: true,
    },
    categoryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required.'],
      min: [0, 'Price cannot be negative.'],
      index: true,
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    discount: {
      type: String,
      default: '',
    },
    tag: {
      type: String,
      enum: ['Bestseller', 'Signature', 'New Drop', 'Limited', 'Trending', 'Sale', ''],
      default: '',
      index: true,
    },
    color: {
      type: String,
      default: 'Black',
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Primary product image is required.'],
    },
    secondaryImage: {
      type: String,
      default: '',
    },
    detailImage: {
      type: String,
      default: '',
    },
    gallery: {
      type: [String],
      default: [],
    },
    desc: {
      type: String,
      required: [true, 'Product description is required.'],
      trim: true,
    },
    sizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL'],
    },
    stock: {
      type: Number,
      default: 50,
      min: [0, 'Stock cannot be negative.'],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [0, 'Rating cannot be less than 0.'],
      max: [5, 'Rating cannot exceed 5.'],
      index: true,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for inStock
productSchema.virtual('inStock').get(function () {
  return this.stock > 0;
});

// Auto-generate slug
productSchema.pre('validate', function () {
  if (this.name && !this.slug) {
    this.slug =
      this.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '') +
      '-' +
      Math.floor(1000 + Math.random() * 9000);
  }
});

// Compound and text indexes for rapid search
productSchema.index({ name: 'text', desc: 'text', category: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ isFeatured: 1, createdAt: -1 });

export const Product = mongoose.model('Product', productSchema);
