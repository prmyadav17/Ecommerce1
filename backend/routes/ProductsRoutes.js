const express = require("express");
const {
  createProduct,
  fetchALlProducts,
  fetchProductById,
  updateProduct,
} = require("../controller/ProductController");
const router = express.Router();

router
  .post("/", createProduct)
  .get("/", fetchALlProducts)
  .get("/:id", fetchProductById)
  .patch("/:id", updateProduct);

exports.router = router;
