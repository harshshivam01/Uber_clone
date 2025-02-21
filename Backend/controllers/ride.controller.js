const rideservice=require('../services/ride.service');
const {validationResult}=require('express-validator');
const mapService=require('../services/maps.service');
const {sendMessageToSocketId}=require('../socket');

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body;
    try {
        const ride = await rideservice.createRide({
            userId: req.user._id,
            pickup,
            destination,
            vehicleType
        });

        const captainsData = await mapService.findCaptainsInRadius(pickup, 10);
        let notifiedCaptains = 0;

        if (captainsData.captains && captainsData.captains.length > 0) {
            for (const captain of captainsData.captains) {
                if (captain.socketId) {
                    console.log(`Attempting to notify captain ${captain._id} via socket ${captain.socketId}`);
                    const sent = sendMessageToSocketId(captain.socketId, {
                        event: "new-ride",
                        data: {
                            ride: {
                                id: ride._id,
                                pickup,
                                destination,
                                fare: ride.fare,
                                status: ride.status,
                                estimatedTime: 5
                            }
                        }
                    });
                    if (sent) {
                        console.log(`Successfully notified captain ${captain._id}`);
                        notifiedCaptains++;
                    }
                }
            }
        }

        res.status(201).json({
            success: true,
            message: "Ride created and captains notified",
            ride,
            notifiedCaptains
        });
        console.log({message:'ride created successfully'},ride,notifiedCaptains)
    } catch (error) {
        console.error("Error creating ride:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports.calculateFare=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {pickup,destination}=req.body;
    try{
        const fare=await rideservice.getfare(pickup,destination);
        res.status(200).json(fare);
    }catch(error){
        res.status(400).json({message:error.message});
    }

}


module.exports.verifyOtp = async (req, res) => {
    const { error } = validationResult(req);
    if (error) {
        return res.status(400).json({ errors: error.array() });
    }

    try {
        const { rideId, otp } = req.body;
        const ride = await rideservice.verifyOtp(rideId, otp);
        res.status(200).json({ success: true, ride });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

