// product routes
import express from "express";
// import controllers
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/product.js";

const router = express.Router();

// create route based on the controllers, the path has a prefix of /api

router.get("/api/products", getProducts);
router.post("/api/products", createProduct);
router.delete("/api/products/:id", deleteProduct);
router.patch("/api/products/:id", updateProduct);

export default router;
