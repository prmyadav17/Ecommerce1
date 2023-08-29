const express = require("express");
const passport = require("passport");
const {
  createUser,
  loginUser,
  checkAuth,
} = require("../controller/AuthController");

const router = express.Router();

router
  .post("/mysignup", createUser)
  .post("/mylogin", passport.authenticate("local"), loginUser)
  .get("/mycheck", passport.authenticate("jwt"), checkAuth);

exports.router = router;
