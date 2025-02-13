const express = require("express");
const captainController = require("../controllers/captain.controller");
const { body } = require("express-validator");
const captainRouter = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

captainRouter.post(
  "/register",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("Firstname must be 3 characters long"),

    body("vehicle.color")
      .isLength({ min: 3 })
      .withMessage("Color must be 3 characters long"),
    body("vehicle.plate")
      .isLength({ min: 3 })
      .withMessage("Plate must be 3 characters long"),

    body("vehicle.capacity")
      .isInt({ min: 1 })
      .withMessage("Capacity must be at least 1 passenger"),
    body("vehicle.vehicleType")
      .isIn(["car", "bike", "auto"])
      .withMessage("Vehicle type must be car, bike or auto"),
  ],
  captainController.registerCaptain
);

captainRouter.post("/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ], captainController.loginCaptain);

captainRouter.get("/profile",authMiddleware.authCaptain, captainController.getCaptains);
captainRouter.get("/logout",authMiddleware.authCaptain, captainController.logoutCaptain);

module.exports = captainRouter;
