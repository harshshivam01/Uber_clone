const mongoose = require("mongoose");
require("dotenv").config();

const rideSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    captainId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "captain",

    },
    pickup: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    fare: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'],
        default: 'pending',
    },
    distance: {
        type: Number,


    },
    duration: {
        type: Number,
    },
    paymentId:{
        type: String,
    },
    orderId:{
        type: String,
    },
    signature:{
        type: String,
    },
    otp:{
        type:Number,
        select:false,
        required:true
    }


});

module.exports = mongoose.model("ride", rideSchema);