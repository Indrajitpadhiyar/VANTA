import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    size: { type: String, default: 'M' },
    color: { type: String, default: 'Black' },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1.'],
      default: 1,
    },
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    items: [cartItemSchema],
    totalQuantity: {
      type: Number,
      default: 0,
    },
    subtotal: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-calculate subtotal and totalQuantity
cartSchema.pre('save', function () {
  this.totalQuantity = this.items.reduce((total, item) => total + item.quantity, 0);
  this.subtotal = this.items.reduce((total, item) => total + item.price * item.quantity, 0);
  this.subtotal = Math.round(this.subtotal * 100) / 100;
});

export const Cart = mongoose.model('Cart', cartSchema);
