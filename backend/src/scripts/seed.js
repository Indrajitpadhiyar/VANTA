import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db.config.js';
import { User } from '../models/User.model.js';
import { Category } from '../models/Category.model.js';
import { Product } from '../models/Product.model.js';
import { Review } from '../models/Review.model.js';
import { Cart } from '../models/Cart.model.js';
import { Order } from '../models/Order.model.js';
import { logger } from '../utils/logger.js';

const SEED_CATEGORIES = [
  {
    name: 'Hoodies',
    description: 'Heavyweight organic cotton and vintage fleece hoodies.',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800',
  },
  {
    name: 'Tracksuits',
    description: '450 GSM French terry cotton matching sets.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
  },
  {
    name: 'Footwear',
    description: 'Retro chunky sneakers and minimalist street footwear.',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
  },
  {
    name: 'Polos & Tops',
    description: 'Classic knit and contrast trim streetwear polos.',
    image: 'https://images.unsplash.com/photo-1625910513413-5853f6087d85?w=800',
  },
  {
    name: 'Street T-Shirts',
    description: 'Oversized boxy streetwear t-shirts in 300 GSM combed jersey.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
  },
  {
    name: 'Outerwear',
    description: 'Lightweight water-repellent vintage track jackets and windbreakers.',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800',
  },
];

const SEED_PRODUCTS = [
  {
    name: 'Loose Fit Hoodie',
    category: 'Hoodies',
    price: 24.99,
    originalPrice: 35.0,
    discount: '-28%',
    tag: 'Bestseller',
    color: 'Burgundy Maroon',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800',
    secondaryImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800',
    detailImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800',
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800',
    ],
    desc: 'Loose-fit sweatshirt hoodie in medium weight cotton-blend fabric with a generous, but not oversized silhouette. Jersey-lined, drawstring hood, dropped shoulders, long sleeves, and a kangaroo pocket. Wide ribbing at cuffs and hem. Soft, brushed inside.',
    stock: 40,
    rating: 4.8,
    numReviews: 24,
    isFeatured: true,
  },
  {
    name: 'VANTA Signature Heavyweight Fleece Set',
    category: 'Tracksuits',
    price: 145.0,
    originalPrice: 180.0,
    discount: '-19%',
    tag: 'Signature',
    color: 'Energetic Orange',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
    secondaryImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800',
    detailImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800',
    ],
    desc: '450 GSM organic French terry cotton with relaxed dropped-shoulder silhouette. Custom dyed in high-vibrancy sunset orange.',
    stock: 25,
    rating: 4.9,
    numReviews: 38,
    isFeatured: true,
  },
  {
    name: 'VANTA Origins Washed Vintage Hoodie',
    category: 'Hoodies',
    price: 110.0,
    originalPrice: 130.0,
    discount: '-15%',
    tag: 'New Drop',
    color: 'Charcoal Black',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800',
    secondaryImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
    detailImage: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800',
    ],
    desc: 'Garment-dyed washed heavyweight fleece with signature double-layered hood and ribbed side gussets.',
    stock: 35,
    rating: 4.7,
    numReviews: 19,
    isFeatured: true,
  },
  {
    name: 'Retro VANTA Court Chunky Sneakers',
    category: 'Footwear',
    price: 135.0,
    originalPrice: 160.0,
    discount: '-15%',
    tag: 'Limited',
    color: 'White / Sunset Orange',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
    secondaryImage: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800',
    detailImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800',
    ],
    desc: 'Premium full-grain leather upper with responsive cushioned gum rubber outsole and sculpted aerodynamic midsole.',
    stock: 20,
    rating: 4.9,
    numReviews: 42,
    isFeatured: true,
  },
  {
    name: 'Polo with Contrast Trims',
    category: 'Polos & Tops',
    price: 212.0,
    originalPrice: 242.0,
    discount: '-20%',
    tag: 'Trending',
    color: 'Cream / Navy',
    image: 'https://images.unsplash.com/photo-1625910513413-5853f6087d85?w=800',
    secondaryImage: 'https://images.unsplash.com/photo-1625910513413-5853f6087d85?w=800',
    detailImage: 'https://images.unsplash.com/photo-1625910513413-5853f6087d85?w=800',
    gallery: ['https://images.unsplash.com/photo-1625910513413-5853f6087d85?w=800'],
    desc: 'Classic knit polo featuring contrast collar and cuff accents with tailored modern hem and pearlized buttons.',
    stock: 30,
    rating: 4.0,
    numReviews: 12,
    isFeatured: false,
  },
  {
    name: 'Gradient Graphic T-shirt',
    category: 'Street T-Shirts',
    price: 145.0,
    originalPrice: 165.0,
    discount: '-12%',
    tag: 'New Drop',
    color: 'Washed Charcoal',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
    secondaryImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
    detailImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
    gallery: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800'],
    desc: 'Oversized boxy streetwear t-shirt crafted in 300 GSM combed jersey with gradient graphic motif on back and chest.',
    stock: 50,
    rating: 3.5,
    numReviews: 8,
    isFeatured: false,
  },
  {
    name: 'Polo with Tipping Details',
    category: 'Polos & Tops',
    price: 180.0,
    originalPrice: 200.0,
    discount: '-10%',
    tag: 'Bestseller',
    color: 'Forest Green',
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800',
    secondaryImage: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800',
    detailImage: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800',
    gallery: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800'],
    desc: 'Refined pique polo shirt featuring dual tipping stripes on the ribbed collar and sleeve cuffs.',
    stock: 45,
    rating: 4.6,
    numReviews: 29,
    isFeatured: false,
  },
  {
    name: 'Striped Jacket',
    category: 'Outerwear',
    price: 120.0,
    originalPrice: 150.0,
    discount: '-30%',
    tag: 'Sale',
    color: 'White / Black',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800',
    secondaryImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800',
    detailImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800',
    gallery: ['https://images.unsplash.com/photo-1544441893-675973e31985?w=800'],
    desc: 'Oversized vintage zip track jacket in lightweight water-repellent shell with contrast piping and dual zippered hand pockets.',
    stock: 22,
    rating: 5.0,
    numReviews: 31,
    isFeatured: true,
  },
];

const seedDatabase = async () => {
  try {
    logger.info('Starting database seeding...');
    await connectDB();

    // Clear existing collections safely
    logger.warn('Clearing collections (User, Category, Product, Review, Cart, Order)...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Review.deleteMany({}),
      Cart.deleteMany({}),
      Order.deleteMany({}),
    ]);

    // 1. Create Default Users
    logger.info('Creating default Admin and Customer accounts...');
    const adminUser = await User.create({
      name: 'VANTA Administrator',
      email: 'admin@vanta.com',
      password: 'Admin@123456',
      role: 'admin',
      phoneNumber: '+91 9876543210',
      avatar: {
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      },
    });

    const customerUser = await User.create({
      name: 'Alex Mathio',
      email: 'alex@vanta.com',
      password: 'Customer@123456',
      role: 'customer',
      phoneNumber: '+91 9876543211',
      avatar: {
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      },
      addresses: [
        {
          street: '42 Fashion Blvd, Downtown',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
          country: 'India',
          isDefault: true,
        },
      ],
    });

    logger.success(`Created users: Admin [${adminUser.email}] and Customer [${customerUser.email}]`);

    // 2. Seed Categories
    logger.info('Seeding categories...');
    const createdCategories = await Category.insertMany(SEED_CATEGORIES);
    logger.success(`Created ${createdCategories.length} categories.`);

    // Map category name to category document for fast referencing
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    // 3. Seed Products with Category References
    logger.info('Seeding catalog products...');
    const productsWithRefs = SEED_PRODUCTS.map((prod) => ({
      ...prod,
      categoryRef: categoryMap[prod.category] || null,
    }));

    const createdProducts = await Product.insertMany(productsWithRefs);
    logger.success(`Created ${createdProducts.length} products.`);

    // 4. Seed Reviews for first product
    logger.info('Seeding initial customer reviews...');
    const firstProduct = createdProducts[0];
    await Review.create({
      product: firstProduct._id,
      user: customerUser._id,
      author: 'Alex Mathio',
      rating: 5,
      comment:
        "VANTA's dedication to sustainability and ethical practices resonates strongly with today's consumers, positioning the brand as a responsible choice in the fashion world.",
      avatar: customerUser.avatar.url,
    });

    logger.success('Database seeded successfully with enterprise test data!');
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    logger.error('Error during database seeding:', error.stack);
    await disconnectDB();
    process.exit(1);
  }
};

seedDatabase();
