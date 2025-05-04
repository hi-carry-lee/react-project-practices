// controller for product
import Product from "../models/product.js";
import mongoose from "mongoose";

// get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, data: products });
    console.log("server get all products: ", products);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// create a product
export const createProduct = async (req, res) => {
  // validate the request body
  if (!req.body.name || !req.body.image || !req.body.price) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: product });
};

// delete a product
export const deleteProduct = async (req, res) => {
  // validate if the id is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid product ID format" });
  }
  // validate if the product exists
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }
  await product.deleteOne();
  res
    .status(200)
    .json({ success: true, message: "Product deleted", data: product });
};

// update a product
export const updateProduct = async (req, res) => {
  // validate if the id is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid product ID format" });
  }
  // validate if the product exists
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  res.status(200).json({
    success: true,
    message: "Product updated",
    data: updatedProduct,
  });
};
