const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const rideController = require("../controllers/ride.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post('/create',
    [
        body('pickup').isString().notEmpty().withMessage('Pickup location is required'),
        body('destination').isString().notEmpty().withMessage('Destination is required'),
        body('vehicleType').isIn(['moto', 'auto', 'car']).withMessage('Invalid vehicle type')
    ],
    authMiddleware.authUser,
    rideController.createRide
);

router.post('/calculate-fare',
    [
        body('pickup').isString().notEmpty().withMessage('Pickup location is required'),
        body('destination').isString().notEmpty().withMessage('Destination is required')
    ],
    authMiddleware.authUser,
    rideController.calculateFare
);

router.post(
    '/verify-otp',
    [
        body('rideId')
            .notEmpty()
            .withMessage('Ride ID is required')
            .isString()
            .withMessage('Invalid ride ID format'),
        body('otp')
            .notEmpty()
            .withMessage('OTP is required')
            .isLength({ min: 4, max: 4 })
            .withMessage('OTP must be 4 digits')
            .matches(/^\d+$/)
            .withMessage('OTP must contain only numbers')
    ],
    authMiddleware.authCaptain,
    rideController.verifyOtp
);

module.exports = router;