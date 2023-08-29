const express = require("express");

const {
  fetchOrdersByUser,
  updateOrder,
  deleteOrder,
  createOrder,
  fetchAllOrders,
} = require("../controller/OrderController");

const router = express.Router();

router
  .post("/", createOrder)
  .get("/myown/", fetchOrdersByUser)
  .delete("/:id", deleteOrder)
  .patch("/:id", updateOrder)
  .get("/", fetchAllOrders);

exports.router = router;
