# ShopKart

ShopKart is a full-stack e-commerce web application built using the **MERN Stack**.

The project provides a complete online shopping experience including user authentication, product browsing, wishlist management, cart management, checkout, order creation, and Razorpay payment integration.

The application is fully deployed using **Vercel**, **Render**, and **MongoDB Atlas**.

---

# Live Application

https://shop-kart-lovat-theta.vercel.app/

---

# GitHub Repository

https://github.com/SRoy2024/ShopKart

---

# Tech Stack

## Frontend

- React.js
- Vite
- React Router
- Axios
- CSS
- JavaScript

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Cookie Parser
- CORS

## Database

- MongoDB Atlas

## Authentication

- JSON Web Tokens (JWT)
- HttpOnly Cookies
- Protected Backend Routes

## Payment Integration

- Razorpay

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

# Features

## User Authentication

ShopKart includes a complete authentication system.

Features include:

- User registration
- User login
- User logout
- JWT authentication
- HttpOnly authentication cookies
- Persistent authentication
- Protected backend routes
- Authentication middleware
- User-specific data

Authentication remains active even after refreshing the website.

---

# Product Management

Users can browse products stored inside MongoDB.

Product functionality includes:

- Fetch products from backend
- Display product information
- Product name
- Product price
- Product images
- Product stock information
- MongoDB based product storage

Products are stored separately from users, carts, wishlists, and orders.

---

# Wishlist

Each authenticated user has their own wishlist.

Wishlist functionality includes:

- Add products to wishlist
- View wishlist
- Remove products from wishlist
- Prevent duplicate wishlist products
- Store wishlist in MongoDB
- Persist wishlist after page refresh
- Associate wishlist with authenticated user
- Validate product IDs
- Validate product existence

Wishlist products are stored as MongoDB `ObjectId` references.

Example:

```js
wishlist: {
  type: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  default: [],
}
```

Instead of storing complete product information inside every user document, ShopKart stores references to products.

Example:

```text
Customer
   |
   |
   └── wishlist
          |
          ├── Product ObjectId
          ├── Product ObjectId
          └── Product ObjectId
```

Mongoose `populate()` can then be used to retrieve complete product information.

---

# Cart

ShopKart contains a user-specific shopping cart.

Cart functionality includes:

- Add products to cart
- View cart
- Update item quantity
- Increase item quantity
- Decrease item quantity
- Remove products from cart
- Store cart information in MongoDB
- Maintain cart for authenticated users
- Persist cart information

Each cart operation is associated with the currently authenticated customer.

---

# Checkout

ShopKart contains a checkout flow where users can review their order before payment.

Checkout functionality includes:

- Cart summary
- Product information
- Quantity information
- Price calculation
- Order total
- Checkout page
- Razorpay payment integration
- Order creation

---

# Orders

After checkout, order information can be stored in MongoDB.

Order functionality includes:

- Create orders
- Store order details
- Associate order with authenticated customer
- Store ordered products
- Store quantities
- Store payment/order information
- Fetch customer orders

---

# Razorpay Integration

ShopKart integrates Razorpay for payment handling.

Razorpay credentials are stored securely using environment variables.

```env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Credentials are never hardcoded into the source code.

---

# Project Structure

```text
ShopKart/
│
├── backend/
│   │
│   ├── controllers/
│   │   ├── customer controllers
│   │   ├── product controllers
│   │   ├── wishlist controllers
│   │   ├── cart controllers
│   │   └── order controllers
│   │
│   ├── models/
│   │   ├── customer model
│   │   ├── product model
│   │   ├── cart/order models
│   │   └── other database models
│   │
│   ├── routes/
│   │   ├── customer.routes.js
│   │   ├── product.routes.js
│   │   ├── wishlist.routes.js
│   │   ├── cart.routes.js
│   │   └── order.routes.js
│   │
│   ├── middlewares/
│   │   └── authentication middleware
│   │
│   ├── scripts/
│   │   └── seedProducts.js
│   │
│   ├── index.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   │
│   ├── src/
│   │   │
│   │   ├── components/
│   │   │
│   │   ├── pages/
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── API configuration
│   │
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json
│   └── .env
│
├── .gitignore
└── README.md
```

---

# API Overview

The backend exposes REST API endpoints for authentication, products, wishlist, cart, and orders.

Backend production URL:

```text
https://shopkart-litz.onrender.com
```

---

# Customer API

## Register Customer

```http
POST /customers/register
```

Used to create a new ShopKart customer account.

Example request:

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210"
}
```

Possible response:

```json
{
  "success": true,
  "message": "Registration successful"
}
```

---

## Login Customer

```http
POST /customers/login
```

Example request:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

After successful authentication, the backend generates a JWT and sends it using an HttpOnly cookie.

---

## Logout Customer

```http
POST /customers/logout
```

Removes or invalidates the authentication cookie.

---

# Product API

## Get Products

```http
GET /products
```

Returns available products stored inside MongoDB.

Example product:

```json
{
  "_id": "PRODUCT_ID",
  "name": "Product Name",
  "price": 2999,
  "stock": 10,
  "image": "product-image-url"
}
```

---

# Wishlist API

## Add Product to Wishlist

```http
POST /wishlist/:productId
```

Example:

```http
POST /wishlist/68e123456789012345678901
```

No request body is required.

The current user is determined from authentication.

Successful response:

```json
{
  "success": true,
  "message": "Product added to wishlist"
}
```

---

## Wishlist Validation

Before adding a product, the backend checks:

```text
Authenticated User
        ↓
Validate Product ObjectId
        ↓
Check Product Exists
        ↓
Check Product Not Already Wishlisted
        ↓
Store Product ObjectId
        ↓
Save Customer
```

---

## Invalid Product ID

Example:

```http
POST /wishlist/hello
```

Response:

```text
400 Bad Request
```

---

## Product Not Found

If the ObjectId is valid but no matching product exists:

```text
404 Not Found
```

---

## Duplicate Wishlist Product

If the product already exists inside the wishlist:

```text
409 Conflict
```

Example response:

```json
{
  "success": false,
  "message": "Product already in wishlist"
}
```

---

## Get Wishlist

```http
GET /wishlist
```

Returns the authenticated customer's wishlist.

Mongoose `populate()` is used to convert stored Product ObjectIds into complete Product documents.

---

## Remove Product From Wishlist

```http
DELETE /wishlist/:productId
```

Example:

```http
DELETE /wishlist/68e123456789012345678901
```

Successful response:

```json
{
  "success": true,
  "message": "Product removed from wishlist"
}
```

---

# Cart API

The cart API handles products selected for purchase.

Typical cart operations include:

```http
GET /cart
```

Used to retrieve the authenticated customer's cart.

```http
POST /cart
```

Used to add an item to the cart.

```http
PATCH /cart
```

Used to update cart information such as product quantity.

```http
DELETE /cart
```

Used to remove products from the cart.

The cart is linked to the authenticated customer and stored in MongoDB.

---

# Cart Flow

```text
User Selects Product
        ↓
Add Product To Cart
        ↓
Backend Authenticates User
        ↓
Validate Product
        ↓
Update Customer Cart
        ↓
Save In MongoDB
        ↓
Return Updated Cart
```

---

# Order API

Orders are handled by the order routes.

Typical order operations include:

```http
POST /orders
```

Creates a new order.

```http
GET /orders
```

Returns orders associated with the authenticated customer.

Order information can contain:

```text
Customer
Products
Product Quantity
Price
Total Amount
Payment Information
Order Information
```

---

# Authentication Architecture

ShopKart uses JWT authentication with HttpOnly cookies.

Authentication flow:

```text
User
 ↓
Login Form
 ↓
POST /customers/login
 ↓
Express Backend
 ↓
Verify Email And Password
 ↓
Generate JWT
 ↓
Set JWT Inside HttpOnly Cookie
 ↓
Browser Stores Cookie
 ↓
Future API Request
 ↓
Cookie Sent Automatically
 ↓
Authentication Middleware
 ↓
Verify JWT
 ↓
Identify Customer
 ↓
Allow Protected Route
```

---

# Authentication Security

The backend does not require the frontend to manually provide a user ID for protected operations.

For example, wishlist requests do not send:

```json
{
  "userId": "some-user-id"
}
```

Instead, the authenticated customer is identified using:

```js
req.user
```

This prevents one customer from directly modifying another customer's wishlist or cart by changing a user ID in the request body.

---

# Axios Configuration

The frontend uses Axios for communication with the backend.

Example API configuration:

```js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export default api;
```

`withCredentials: true` allows authentication cookies to be included with requests to the Render backend.

---

# Frontend Environment Variables

Create:

```text
frontend/.env
```

Local development:

```env
VITE_API_URL=http://localhost:1000
```

Production:

```env
VITE_API_URL=https://shopkart-litz.onrender.com
```

---

# Backend Environment Variables

Create:

```text
backend/.env
```

Example:

```env
PORT=1000

MONGO_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=your_razorpay_key_id

RAZORPAY_KEY_SECRET=your_razorpay_key_secret

NODE_ENV=development
```

The `.env` file must never be committed to GitHub.

---

# Backend Scripts

The backend contains the following npm scripts:

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch --env-file=.env index.js",
    "seed:products": "node --env-file=.env scripts/seedProducts.js"
  }
}
```

---

# Frontend Scripts

The frontend uses Vite.

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

---

# Running ShopKart Locally

## Clone Repository

```bash
git clone https://github.com/SRoy2024/ShopKart.git
```

Move into the project:

```bash
cd ShopKart
```

---

# Backend Setup

Move into backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create:

```text
.env
```

Add:

```env
PORT=1000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
NODE_ENV=development
```

Start development server:

```bash
npm run dev
```

Backend should run at:

```text
http://localhost:1000
```

---

# Frontend Setup

Open another terminal.

Move into frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create:

```text
.env
```

Add:

```env
VITE_API_URL=http://localhost:1000
```

Start frontend:

```bash
npm run dev
```

Frontend will usually run at:

```text
http://localhost:5173
```

---

# Product Database Seeding

Products can be inserted into MongoDB using the included seeding script.

Run:

```bash
cd backend
npm run seed:products
```

This executes:

```text
scripts/seedProducts.js
```

and inserts the predefined product data into MongoDB.

---

# MongoDB Architecture

ShopKart uses MongoDB for persistent application storage.

Conceptually:

```text
MongoDB Atlas
│
├── Customers
│   ├── Authentication information
│   ├── Wishlist references
│   └── Customer information
│
├── Products
│   ├── Product name
│   ├── Price
│   ├── Image
│   └── Stock
│
├── Cart Data
│   ├── Customer
│   ├── Products
│   └── Quantities
│
└── Orders
    ├── Customer
    ├── Products
    ├── Amount
    └── Payment information
```

---

# MongoDB Product Relationships

Wishlist products are stored using references instead of copying product objects.

Example:

```text
CUSTOMERS COLLECTION

{
  "_id": "CUSTOMER_ID",

  "wishlist": [
    ObjectId("PRODUCT_1"),
    ObjectId("PRODUCT_2")
  ]
}
```

Products remain inside the Products collection.

```text
PRODUCTS COLLECTION

{
  "_id": "PRODUCT_1",
  "name": "Keyboard",
  "price": 2999
}
```

This allows product information to remain centralized.

---

# CORS Configuration

Because the frontend and backend are deployed on different domains, CORS must allow requests from the Vercel frontend.

Backend configuration:

```js
const cors = require("cors");

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
```

Render environment variable:

```env
FRONTEND_URL=https://shop-kart-lovat-theta.vercel.app
```

---

# Production Cookies

The Vercel frontend and Render backend use different domains.

Production authentication cookies therefore use secure cross-site cookie settings.

Example:

```js
res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production"
    ? "none"
    : "lax",
});
```

---

# SPA Routing

ShopKart is a React Single Page Application.

Vercel must redirect frontend routes to the React application.

The project contains:

```text
frontend/vercel.json
```

Example:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

This allows pages such as:

```text
/
```

```text
/wishlist
```

```text
/cart
```

```text
/checkout
```

to continue working even after directly refreshing the browser.

---

# Deployment Architecture

```text
                    USER
                      |
                      |
                      v
              Vercel Frontend
             React + Vite SPA
                      |
                      |
                HTTPS / Axios
                      |
                      v
               Render Backend
             Node.js + Express
                      |
             -------------------
             |                 |
             v                 v
       MongoDB Atlas       Razorpay
          Database          Payments
```

---

# Frontend Deployment

The frontend is deployed using Vercel.

Production application:

```text
https://shop-kart-lovat-theta.vercel.app/
```

Vercel settings:

```text
Framework Preset:
Vite

Root Directory:
frontend

Build Command:
npm run build

Output Directory:
dist
```

Production environment variable:

```env
VITE_API_URL=https://shopkart-litz.onrender.com
```

---

# Backend Deployment

The backend is deployed using Render.

Production backend:

```text
https://shopkart-litz.onrender.com
```

Render configuration:

```text
Root Directory:
backend

Build Command:
npm install

Start Command:
npm start
```

The backend dynamically uses Render's assigned port.

```js
const PORT = process.env.PORT || 1000;
```

---

# Render Environment Variables

The deployed backend uses environment variables such as:

```env
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
NODE_ENV=production
FRONTEND_URL=https://shop-kart-lovat-theta.vercel.app
```

Render automatically provides its own `PORT`.

---

# Security Features

ShopKart follows several backend security practices.

## HttpOnly Cookies

JWT tokens are stored inside HttpOnly cookies so frontend JavaScript cannot directly access the token.

## JWT Authentication

Protected backend endpoints verify a valid JWT before providing user-specific data.

## User-Specific Data

Wishlist, cart, and order functionality is linked to the authenticated customer.

## Environment Variables

Secrets such as:

```text
MongoDB credentials
JWT secrets
Razorpay keys
```

are stored using environment variables.

## ObjectId Validation

MongoDB IDs are validated before database operations.

## Duplicate Wishlist Prevention

The backend checks whether a product is already present before adding it again.

## CORS Protection

The backend only allows requests from the configured frontend origin.

---

# HTTP Status Codes

ShopKart uses HTTP status codes to represent API results.

```text
200 OK
Successful request
```

```text
201 Created
Resource successfully created
```

```text
400 Bad Request
Invalid request or invalid Product ID
```

```text
401 Unauthorized
Authentication missing or invalid
```

```text
404 Not Found
Requested product/resource does not exist
```

```text
409 Conflict
Duplicate resource such as an existing user or wishlist product
```

```text
500 Internal Server Error
Unexpected backend error
```

---

# Wishlist API Flow

```text
POST /wishlist/:productId
        |
        v
Authentication Middleware
        |
        v
Get Authenticated Customer
        |
        v
Validate Product ID
        |
        +---- Invalid ----> 400
        |
        v
Check Product Exists
        |
        +---- Missing ----> 404
        |
        v
Check Wishlist
        |
        +---- Exists -----> 409
        |
        v
Push Product ObjectId
        |
        v
Save Customer
        |
        v
200 Success
```

---

# Cart Flow

```text
Customer
   |
   v
Select Product
   |
   v
Add To Cart
   |
   v
Backend Authentication
   |
   v
Product Validation
   |
   v
Store / Update Cart
   |
   v
MongoDB
   |
   v
Updated Cart Returned
```

---

# Checkout Flow

```text
Customer Cart
     |
     v
Checkout Page
     |
     v
Order Summary
     |
     v
Payment
     |
     v
Razorpay
     |
     v
Order Creation
     |
     v
MongoDB
```

---

# Application Testing

The deployed application has been manually tested for the following functionality.

## Authentication Testing

```text
✓ Registration
✓ Login
✓ Logout
✓ Authentication cookie
✓ Login persistence
✓ Refresh while logged in
✓ Protected routes
✓ Unauthorized access
```

## Product Testing

```text
✓ Product loading
✓ Product information
✓ MongoDB product retrieval
```

## Wishlist Testing

```text
✓ Add product
✓ Retrieve wishlist
✓ Duplicate prevention
✓ Remove product
✓ Persistence after refresh
✓ User-specific wishlist
```

## Cart Testing

```text
✓ Add to cart
✓ View cart
✓ Update quantity
✓ Remove cart product
✓ Cart persistence
```

## Checkout Testing

```text
✓ Checkout page
✓ Order summary
✓ Order creation
✓ Payment integration
```

## Deployment Testing

```text
✓ Vercel frontend
✓ Render backend
✓ MongoDB Atlas
✓ CORS
✓ Cross-domain cookies
✓ SPA page refresh
✓ API environment variables
✓ Desktop browser
✓ Mobile browser
```

---

# Production Smoke Test

The following workflow can be used to verify the complete application:

```text
1. Open ShopKart

2. Register a new customer

3. Login

4. Refresh browser

5. Browse products

6. Add product to wishlist

7. Open wishlist

8. Refresh wishlist

9. Remove wishlist product

10. Add product to cart

11. Modify cart quantity

12. Open checkout

13. Complete order/payment flow

14. Logout

15. Refresh

16. Verify authentication is removed
```

---

# Future Improvements

Possible future additions include:

- Product search
- Product filtering
- Product categories
- Sorting
- Pagination
- Product reviews
- Ratings
- Admin dashboard
- Admin authentication
- Product CRUD
- Inventory management
- Order tracking
- User profile management
- Forgot password
- Reset password
- Email verification
- Order confirmation emails
- Better loading skeletons
- Improved error states
- Improved mobile UI
- Automated backend tests
- Automated frontend tests
- CI/CD testing
- Payment verification improvements

---

# What This Project Demonstrates

ShopKart demonstrates practical implementation of full-stack web development concepts including:

```text
React frontend development

Node.js backend development

Express REST APIs

MongoDB database design

Mongoose relationships

JWT authentication

HttpOnly cookies

Middleware

Protected routes

CRUD operations

REST API design

Axios API communication

CORS configuration

Environment variables

Payment integration

MongoDB Atlas deployment

Render deployment

Vercel deployment

SPA routing

Production debugging
```

---

# MERN Architecture

ShopKart follows the MERN architecture.

```text
M
MongoDB
Database and persistent storage

E
Express.js
Backend API framework

R
React.js
Frontend user interface

N
Node.js
Backend JavaScript runtime
```

Architecture:

```text
React
   |
   |
 Axios
   |
   v
Express
   |
   v
Node.js
   |
   v
Mongoose
   |
   v
MongoDB
```

---

# Author

**Soham Roy**

GitHub:

https://github.com/SRoy2024

---

# Repository

https://github.com/SRoy2024/ShopKart

---

# Live Demo

https://shop-kart-lovat-theta.vercel.app/

---

# ShopKart

**A full-stack MERN e-commerce application with authentication, products, wishlist, cart, checkout, orders, Razorpay integration, MongoDB persistence, and production deployment using Vercel and Render.**
