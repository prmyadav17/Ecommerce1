const express = require("express");
const { fetchUserById, updateUser } = require("../controller/UserController");

const router = express.Router();

router.get("/myown", fetchUserById).patch("/:id", updateUser);

exports.router = router;
