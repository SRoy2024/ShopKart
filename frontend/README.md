# ShopKart

ShopKart is a full-stack e-commerce web application built using the **MERN stack**.

It includes user authentication, product browsing, wishlist management, cart functionality, checkout flow, order handling, and payment integration.

## Live Demo

[ShopKart Live Website](https://shop-kart-lovat-theta.vercel.app/)

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Cookie-based authentication

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

### Payments
- Razorpay

---

## Features

### Authentication
- User registration
- User login
- User logout
- JWT-based authentication
- HttpOnly cookie authentication
- Protected routes
- Persistent login across page refreshes

### Products
- Browse available products
- Fetch products from MongoDB
- Product details and pricing
- Product stock information

### Wishlist
- Add products to wishlist
- Prevent duplicate wishlist entries
- Fetch user-specific wishlist
- Remove products from wishlist
- Wishlist data stored in MongoDB
- Wishlist persists across refreshes and login sessions

### Cart
- Add products to cart
- View cart items
- Update cart quantities
- Remove items from cart
- Persistent user-specific cart

### Checkout
- Checkout page
- Order summary
- Order placement
- Razorpay payment integration

### Orders
- Create orders
- Store order details in MongoDB
- Associate orders with authenticated users

### Responsive UI
- Responsive frontend
- Works across desktop and mobile devices
- SPA routing support on Vercel

---

## Project Architecture

```text
ShopKart/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── scripts/
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   ├── public/
│   ├── vercel.json
│   └── package.json
│
└── README.md
