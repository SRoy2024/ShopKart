const Product = require("../models/product.model");

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
      stock,
    } = req.body;

    if (
      name === undefined ||
      description === undefined ||
      price === undefined ||
      category === undefined ||
      image === undefined ||
      stock === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (
      typeof name !== "string" ||
      typeof description !== "string" ||
      typeof category !== "string" ||
      typeof image !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid field types",
      });
    }

    if (
      !name.trim() ||
      !description.trim() ||
      !category.trim() ||
      !image.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Text fields cannot be empty",
      });
    }

    if (
      typeof price !== "number" ||
      price <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than 0",
      });
    }

    if (
      typeof stock !== "number" ||
      stock < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Stock cannot be negative",
      });
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price,
      category: category.trim(),
      image: image.trim(),
      stock,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });

  } catch (error) {
    console.error(
      "Create product error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      sort,
    } = req.query;

    const query = {};

    if (search && search.trim()) {
      query.name = {
        $regex: escapeRegExp(search.trim()),
        $options: "i",
      };
    }

    if (
      category &&
      category.trim() &&
      category.toLowerCase() !== "all"
    ) {
      query.category = {
        $regex: `^${escapeRegExp(category.trim())}$`,
        $options: "i",
      };
    }

    let productQuery = Product.find(query).select(
      "name price category image stock"
    );

    if (sort === "price_asc") {
      productQuery = productQuery.sort({
        price: 1,
      });
    }

    if (sort === "price_desc") {
      productQuery = productQuery.sort({
        price: -1,
      });
    }

    const products = await productQuery;

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });

  } catch (error) {
    console.error(
      "Get products error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id).select("-__v");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {
    console.error(
      "Get product by ID error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
module.exports = { createProduct, getAllProducts,getProductById };
