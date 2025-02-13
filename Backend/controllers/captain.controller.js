const captain = require("../models/captain.model");
const { validationResult } = require("express-validator");

module.exports.registerCaptain=async(req,res,next)=>{
    try{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
        console.log(req.body);
        const {fullname,password,email,vehicle}=req.body;
        const userexist=await captain.findOne({
            email
        });
        if(userexist){
            return res.status(400).json({message:"Captain already exists"});
        }
        const hashedPassword=await captain.hashedPassword(password);
        const newCaptain=new captain({
            fullname:{
                firstname:fullname.firstname,
                lastname:fullname.lastname,
            },
            email,
            password:hashedPassword,
            vehicle:{
                color:vehicle.color,
                plate:vehicle.plate,
                capacity:vehicle.capacity,
                vehicleType:vehicle.vehicleType,
            },
        });
        await newCaptain.save();
        const token=newCaptain.generateAuthToken();
        console.log(token);
        res.status(201).json({
            message:"Captain created successfully",
            token,
            newCaptain,
        });
    }catch(error){
        next(error);
    }
};

module.exports.loginCaptain=async(req,res,next)=>{
    try{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
        const {email,password}=req.body;
        const foundCaptain=await captain.findOne({email});
        if(!foundCaptain){
            return res.status(404).json({message:"Captain not found"});
        }
        const isMatch=await foundCaptain.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid password"});
        }
        const token=foundCaptain.generateAuthToken();
        res.status(200).cookie(
            'token',
            token,
            {
                httpOnly:true,
                secure:'production',
                sameSite:'none',
            }
        )
        .json({message:"Captain logged in successfully",token});
    }catch(error){
        next(error);
    }
};
module.exports.getCaptains=(req,res)=>{
    try{
        res.status(200).json({captain:req.captain});
    }
    catch(error){
        next(error);
    }
};

module.exports.logoutCaptain=(req,res)=>{
    try{
    res.clearCookie("token").json({message:"Captain logged out successfully"});
    }catch(error){
        next(error);
    }
};
