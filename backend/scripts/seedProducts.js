const mongoose = require("mongoose");
const Product = require("../models/product.model");

const products = [
  {
    name: "Sony WH-1000XM5 Headphones",
    description: "Wireless noise-cancelling headphones with clear calls, rich sound, and a lightweight over-ear design.",
    price: 29990,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&h=900&fit=crop&q=80",
    stock: 18,
  },
  {
    name: "Mechanical Wireless Keyboard",
    description: "Compact mechanical keyboard with tactile switches, wireless connectivity, and a durable aluminium frame.",
    price: 6499,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=900&h=900&fit=crop&q=80",
    stock: 25,
  },
  {
    name: "Classic Cotton Overshirt",
    description: "A versatile cotton overshirt with a relaxed fit, button closure, and practical chest pockets.",
    price: 2299,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=900&h=900&fit=crop&q=80",
    stock: 32,
  },
  {
    name: "The Psychology of Money",
    description: "Morgan Housel's accessible collection of lessons about wealth, greed, happiness, and financial decisions.",
    price: 399,
    category: "Books",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=900&h=900&fit=crop&q=80",
    stock: 40,
  },
  {
    name: "Ceramic Table Lamp",
    description: "Minimal ceramic bedside lamp with a warm fabric shade that adds soft ambient light to any room.",
    price: 1899,
    category: "Home",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&h=900&fit=crop&q=80",
    stock: 14,
  },
  {
    name: "Natural Skincare Set",
    description: "A gentle everyday skincare set featuring cleanser, serum, and moisturiser for a simple daily routine.",
    price: 1599,
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&h=900&fit=crop&q=80",
    stock: 21,
  },
  {
    name: "Red Everyday Sneakers",
    description: "Comfortable lace-up sneakers with a cushioned sole and a bold finish for everyday wear.",
    price: 3499,
    category: "Footwear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&h=900&fit=crop&q=80",
    stock: 17,
  },
  {
    name: "Classic White Trainers",
    description: "Clean low-top trainers with a supportive footbed and versatile styling for casual outfits.",
    price: 4299,
    category: "Footwear",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900&h=900&fit=crop&q=80",
    stock: 0,
  },
  {
    name: "Instant Film Camera",
    description: "Easy-to-use instant camera with automatic exposure and a built-in flash for printed memories in seconds.",
    price: 9999,
    category: "Photography",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=900&h=900&fit=crop&q=80",
    stock: 9,
  },
  {
    name: "Mirrorless Travel Camera",
    description: "Compact mirrorless camera with interchangeable lenses and detailed image quality for travel photography.",
    price: 58990,
    category: "Photography",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&h=900&fit=crop&q=80",
    stock: 6,
  },
  {
    name: "Slim Performance Laptop",
    description: "Lightweight laptop with a bright display, fast solid-state storage, and all-day battery life.",
    price: 74990,
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&h=900&fit=crop&q=80",
    stock: 11,
  },
  {
    name: "Leather Weekender Bag",
    description: "Roomy leather-look travel bag with reinforced handles and a detachable shoulder strap.",
    price: 4999,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&h=900&fit=crop&q=80",
    stock: 16,
  },
  {
    name: "Polarised Sunglasses",
    description: "Timeless sunglasses with lightweight frames and polarised lenses for comfortable sun protection.",
    price: 2799,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=900&h=900&fit=crop&q=80",
    stock: 28,
  },
  {
    name: "Fitness Smartwatch",
    description: "Water-resistant smartwatch with activity tracking, heart-rate monitoring, and phone notifications.",
    price: 8999,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&h=900&fit=crop&q=80",
    stock: 20,
  },
  {
    name: "Stainless Steel Water Bottle",
    description: "Double-wall insulated bottle that keeps drinks cold or hot and fits easily in a backpack.",
    price: 899,
    category: "Home",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=900&h=900&fit=crop&q=80",
    stock: 35,
  },
];

async function seedProducts() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const existingProducts = await Product.find().select("name").lean();
  const existingNames = new Set(existingProducts.map((product) => product.name));
  const availableSlots = Math.max(0, 15 - existingProducts.length);
  const productsToInsert = products
    .filter((product) => !existingNames.has(product.name))
    .slice(0, availableSlots);

  if (productsToInsert.length === 0) {
    console.log(`Product seed complete: 0 inserted, collection already contains ${existingProducts.length} products.`);
    return;
  }

  const operations = productsToInsert.map((product) => ({
    updateOne: {
      filter: { name: product.name },
      update: { $setOnInsert: product },
      upsert: true,
    },
  }));

  const result = await Product.bulkWrite(operations);
  console.log(`Product seed complete: ${result.upsertedCount} inserted, ${existingProducts.length + result.upsertedCount} total.`);
}

seedProducts()
  .catch((error) => {
    console.error("Product seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
