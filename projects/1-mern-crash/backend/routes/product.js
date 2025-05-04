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

router.get("/", getProducts);
router.post("/", createProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
