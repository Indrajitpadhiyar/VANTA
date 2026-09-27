# VANTA Fashion Storefront — Enterprise Backend API

A production-grade, enterprise RESTful API engineered for the **VANTA** fashion platform with strict separation of concerns, defensive security measures, centralized error handling, resilient MongoDB connectivity, and decoupled business logic.

---

## 🏛 Architecture & Design Patterns

The backend follows **Clean Layered Architecture** with strict boundaries between transport, business logic, persistence, and cross-cutting concerns:

```
src/
├── config/             # Environment, Database, CORS & Cloudinary configuration
├── constants/          # HTTP status codes, standard response messages, business enums
├── controllers/        # Thin HTTP request adapters (input extraction & response shaping)
├── middlewares/        # Security headers, JWT protection, RBAC, Rate-Limiting, Error Interceptor
├── models/             # Mongoose schemas with compound indexes, virtuals, and hooks
├── routes/             # Modular, versioned API endpoint route trees (/api/v1)
├── scripts/            # Database seeder scripts with rich catalog & admin accounts
├── services/           # Pure, decoupled business logic (isolated from req/res)
├── utils/              # Structured logger, ApiError, ApiResponse, QueryBuilder, JWT
├── app.js              # Express app definition & middleware pipeline configuration
└── server.js           # Server lifecycle, cluster resilience, and graceful shutdown
```

---

## 🚀 Key Features

1. **Enterprise Layered Separation:**
   - **Controllers:** Single-responsibility HTTP endpoints using `asyncHandler` (no try/catch boilerplate).
   - **Services:** Pure domain logic reusable across CLI, background jobs, or controllers.
   - **Models:** Optimized Mongoose 9 schemas with compound indexes, text search indexes, and virtual fields (`inStock`).

2. **Defensive Error Handling:**
   - Operational vs. Programmer error distinction via custom `ApiError`.
   - Automatic translation of Mongoose `CastError` (400), `ValidationError` (422), duplicate key `11000` (409), and JWT expiry (401).
   - Standardized JSON envelope: `{ success, statusCode, message, data, meta }`.

3. **Advanced API Features (`QueryBuilder`):**
   - Declarative MongoDB comparison filtering (`?price[gte]=50&price[lte]=150`).
   - Case-insensitive multi-field regex/text search (`?search=hoodie`).
   - Multi-field sorting (`?sort=-price,rating`).
   - Field selection/projection (`?fields=name,price,category`).
   - Pagination with complete metadata (`totalRecords`, `totalPages`, `hasNextPage`, `hasPrevPage`).

4. **Security & Production Hardening:**
   - **Helmet:** Modern CSP and HTTP security headers.
   - **CORS:** Origin verification and credential propagation.
   - **Rate Limiter:** Sliding-window in-memory throttling for auth endpoints.
   - **Role-Based Access Control (RBAC):** `customer` and `admin` permission gates.
   - **Graceful Shutdown:** Intercepts `SIGTERM` / `SIGINT` and flushes open connections before termination.

---

## 📦 Environment Setup

Configure `.env` in the backend root directory:

```env
NODE_ENV=development
PORT=4000
CLIENT_URL=http://localhost:5173

MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net
DB_NAME=vanta_store

JWT_SECRET=your_super_secure_jwt_secret_key
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=dex6myw4v
CLOUDINARY_API_KEY=857314168756135
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## 🛠 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts server with `nodemon` hot reloading on port `4000` |
| `npm start` | Runs server in production mode |
| `npm run seed` | Clears and seeds database with VANTA catalog, categories, admin & customer users |

---

## 📋 API Endpoints Reference (`/api/v1`)

### 1. System & Health
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Public | Root metadata & version |
| `GET` | `/api/v1/health` | Public | Process uptime, database state, memory stats |

### 2. Authentication (`/api/v1/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Public (Rate-limited) | Register new customer account |
| `POST` | `/api/v1/auth/login` | Public (Rate-limited) | Sign in and receive JWT token |
| `GET` | `/api/v1/auth/me` | Protected | Get profile for logged-in user |
| `PUT` | `/api/v1/auth/profile` | Protected | Update profile (name, phone, avatar) |
| `PUT` | `/api/v1/auth/change-password` | Protected | Change password |

### 3. Products Catalog (`/api/v1/products`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/products` | Public | List products (search, filter, sort, paginate) |
| `GET` | `/api/v1/products/featured` | Public | Get featured drops showcase |
| `GET` | `/api/v1/products/categories-summary` | Public | Distinct categories with counts |
| `GET` | `/api/v1/products/related` | Public | Related products by category |
| `GET` | `/api/v1/products/:idOrSlug` | Public | Retrieve single product by Mongo ID or Slug |
| `POST` | `/api/v1/products` | Protected (Admin) | Create product |
| `PUT` | `/api/v1/products/:id` | Protected (Admin) | Update product details |
| `DELETE`| `/api/v1/products/:id` | Protected (Admin) | Delete product |
| `POST` | `/api/v1/products/upload-image` | Protected (Admin) | Upload product image to Cloudinary |

### 4. Categories (`/api/v1/categories`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/categories` | Public | List all active categories |
| `GET` | `/api/v1/categories/:id` | Public | Single category details |
| `POST` | `/api/v1/categories` | Protected (Admin) | Create new category |
| `PUT` | `/api/v1/categories/:id` | Protected (Admin) | Update category |
| `DELETE`| `/api/v1/categories/:id` | Protected (Admin) | Remove category |

### 5. Persistent Cart (`/api/v1/cart`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/cart` | Protected | Get current user's cart |
| `POST` | `/api/v1/cart/items` | Protected | Add item to cart |
| `PUT` | `/api/v1/cart/items/:itemId` | Protected | Update item quantity |
| `DELETE`| `/api/v1/cart/items/:itemId` | Protected | Remove item from cart |
| `DELETE`| `/api/v1/cart` | Protected | Clear entire cart |
| `POST` | `/api/v1/cart/sync` | Protected | Sync guest session items with database cart |

### 6. Orders & Checkout (`/api/v1/orders`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/orders` | Protected | Place new order with inventory decrement |
| `GET` | `/api/v1/orders/my-orders` | Protected | View user order history |
| `GET` | `/api/v1/orders/:id` | Protected | Order details (customer/admin) |
| `PUT` | `/api/v1/orders/:id/pay` | Protected | Mark order as paid |
| `GET` | `/api/v1/orders` | Protected (Admin) | List all orders in the system |
| `PUT` | `/api/v1/orders/:id/status` | Protected (Admin) | Update fulfillment status (`Placed`, `Shipped`, `Delivered`) |

### 7. Reviews & Ratings (`/api/v1/reviews`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/reviews/product/:productId` | Public | Get paginated reviews for a product |
| `POST` | `/api/v1/reviews/product/:productId` | Protected | Add review (auto-recalculates rating on Product) |
| `DELETE`| `/api/v1/reviews/:id` | Protected | Delete review (author or admin) |

---

## 👤 Default Seed Credentials

After running `npm run seed`:

- **Administrator:**
  - Email: `admin@vanta.com`
  - Password: `Admin@123456`
- **Customer:**
  - Email: `alex@vanta.com`
  - Password: `Customer@123456`
