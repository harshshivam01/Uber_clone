const { validationResult } = require("express-validator");
const rideModel = require("../models/ride.model");
const mapService = require("../services/maps.service");
const crypto = require("crypto");
const { sendMessageToSocketId } = require("../socket");

// ✅ Define `getfare` normally
const getfare = async (pickup, destination) => {
    if (!pickup || !destination) {
        throw new Error("Pickup and destination are required");
    }
    try {
        const startCoordinates = await mapService.getAddressCoordinates(pickup);
        const endCoordinates = await mapService.getAddressCoordinates(destination);
        const { distance, duration } = await mapService.getDistanceTime(startCoordinates, endCoordinates);

        const baseFare = { moto: 20, auto: 30, car: 50 };
        const perKmRate = { moto: 5, auto: 8, car: 12 };
        const perMinuteRate = { moto: 1, auto: 1.5, car: 2 };

        const fareCalculation = (vehicleType, distance, duration) => {
            if (!baseFare[vehicleType]) throw new Error("Invalid vehicle type");
            return baseFare[vehicleType] + (perKmRate[vehicleType] * (distance / 1000)) + (perMinuteRate[vehicleType] * (duration / 60));
        };

        return {
            moto: Math.round(fareCalculation("moto", distance, duration)),
            auto: Math.round(fareCalculation("auto", distance, duration)),
            car: Math.round(fareCalculation("car", distance, duration)),
        };
    } catch (error) {
        throw new Error(error.message);
    }
};


module.exports.getfare = getfare;

const generateOtp = () => crypto.randomInt(1000, 9999).toString();

module.exports.createRide = async ({ userId, pickup, destination, vehicleType }) => {
    if (!userId || !pickup || !destination || !vehicleType) {
        throw new Error("All fields are required");
    }

    try {
        const fare = await getfare(pickup, destination); // ✅ Now calling the function directly
        const otp = generateOtp();

        const ride = await rideModel.create({
            userId,
            pickup,
            destination,
            vehicleType,
            otp,
            fare: fare[vehicleType],

        });

        return ride;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports.verifyOtp = async (rideId, otp, captain) => {
    if (!rideId || !otp) {
        throw new Error("Both ride ID and OTP are required");
    }

    try {
        console.log('Verifying OTP:', { rideId, otp });

        const ride = await rideModel.findById(rideId)
            .populate('userId')
            .populate('captainId')
            .select('+otp');

        console.log('Found ride:', {
            id: ride?._id,
            status: ride?.status,
            otp: ride?.otp
        });

        if (!ride) {
            throw new Error("Ride not found");
        }

        // Update status check
        if (!['accepted', 'pending', 'matched'].includes(ride.status)) {
            throw new Error(`Invalid ride status: ${ride.status}. Ride must be in accepted or matched state`);
        }

        const submittedOtp = parseInt(otp);
        const storedOtp = parseInt(ride.otp);

        if (submittedOtp !== storedOtp) {
            throw new Error("Invalid OTP provided");
        }

        // Update ride status
        const updatedRide = await rideModel.findOneAndUpdate(
            { _id: rideId },
            { status: 'ongoing' },
            { new: true }
        ).populate('userId');

        if (!updatedRide.userId?.socketId) {
            console.warn('No socket ID found for user');
        }

        // Notify user about ride start
        sendMessageToSocketId(updatedRide.userId.socketId, {
            event: 'ride-started',
            data: updatedRide
        });

        return {
            success: true,
            ride: updatedRide
        };
    } catch (error) {
        console.error('OTP verification error:', error);
        throw error; // Preserve original error
    }
};