const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const captainSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "First name must be at least 3 characters long"],
    },
    lastname: {
      type: String,
    
      minlength: [3, "Last name must be at least 3 characters long"],
    },
  },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, "Please enter a valid email"],

    },
    password: {
        type: String,
        required: true,
        minlength: [8, "Password must be at least 8 characters long"],
    },
    // phone: {
    //     type: String,
    //     required: true,
    //     match: [/^\d{10}$/, "Please enter a valid phone number"],
    // },
   socketId:{
    type:String,
   },
   status:{
    type:String,
    enum:["active","inactive"],
    default:"active",
   },
   vehicle:{
    color:{
        type:String,
        required:true,
        minlength:[3,"Color must be at least 3 characters long"],

    },
    plate:{
        type:String,
        required:true,
        minlength:[3,"Plate must be at least 3 characters long"],

    },
    capacity:{
        type:Number,
        required:true,
        min:[1,"Capacity must be at least 1 passenger"],
    },
    vehicleType:{
        type:String,
        required:true,
        enum:["car","bike","auto"],
    },

   },
   location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],  // [longitude, latitude]
      required: true,
      default: [0, 0]
    },
    accuracy: {
      type: Number,
      default: null
    }
  },
  isOnline: {
    type: Boolean,
    default: false
  }
});

captainSchema.methods.generateAuthToken = function () {
   const token=jwt.sign({_id:this._id},process.env.SECRET_KEY, { expiresIn: '1h' })
       return token;
};

captainSchema.statics.hashedPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

captainSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

captainSchema.index({ location: '2dsphere' });

const captain = mongoose.model("captain", captainSchema);

module.exports = captain;
