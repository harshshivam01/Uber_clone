const user = require("../models/user.model");
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');

module.exports.registerUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        console.log(req.body);
        const { fullname, password, email } = req.body;
        const userExists=await user.findOne({email});
        if(userExists){
            return res.status(400).json({message:"User already exists"});
        }

        // Hash the password
        const hashedPassword = await user.hashedPassword(password);

        // Create the user instance
        const newUser = new user({
            fullname: {
                firstname: fullname.firstname,
                lastname: fullname.lastname,
            },
            email,
            password: hashedPassword,
        });

        // Save the new user
        await newUser.save();

        // Generate a token for the user
        const token = newUser.generateAuthToken();

        console.log(token);
        res.status(201).json({
            message: "User created successfully",
            token,
            
            newUser,
        });
    } catch (error) {
        next(error); 
    }
};

module.exports.loginUser = async (req, res, next) => {
    try {
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
        const {email,password}=req.body;
        console.log(req.body);
        const userExists=await user.findOne({email}).select('+password');
        console.log(userExists)
        if(!userExists){
            return res.status(404).json({message:"User not found"});

        }
        const isMatch=await userExists.comparePasword(password);
        if(!isMatch){
            return res.status(401).json({message:"Invalid email or password"});
        }
        const token=userExists.generateAuthToken();
        res.cookie(
            'token',
            token,
            {
                httpOnly:true,
                secure:'production',
                sameSite:'none',
            }
        )
        .status(200).json({message:"User logged in successfully",token});

    }catch(error){
        next(error);
    }

};
module.exports.getUserProfile=async(req,res,next)=>{
    try{
        res.status(200).json({message:"User profile fetched successfully",user:req.user});


    }catch{
        next(error);
    }
};
module.exports.logoutUser=async(req,res,next)=>{
    try{
        res.clearCookie('token').status(200).json({message:"User logged out successfully"});

    }catch(error){
        next(error);
    }

    
};
