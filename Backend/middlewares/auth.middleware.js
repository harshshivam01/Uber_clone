const user=require('../models/user.model');
const captain=require('../models/captain.model');

const jwt=require('jsonwebtoken');


module.exports.authUser=async(req,res,next)=>{
    console.log(req.cookies)
    const token = req?.cookies.token||req.headers.authorization?.split(' ')[1];
    console.log('tooken',token);

    if(!token){
        return res.status(401).json({message:"unauthorized"});
    }

    try{
        console.log(token);
       

        // const token=req.header('Authorization').replace('Bearer ','');
        const decoded=jwt.verify(token,process.env.SECRET_KEY);
        console.log(decoded);
        const userExists=await user.findOne({_id:decoded._id});
        console.log(userExists);
        if(!userExists){
            throw new Error();
        }
        req.token=token;
        req.user=userExists;
        next();
    }catch(error){
        res.status(401).json({message:'Please authenticate'});
    }
}

module.exports.authCaptain=async(req,res,next)=>{
    console.log(req?.cookies)
    const token = req?.cookies.token||req.headers.authorization?.split(' ')[1];
    console.log(token);

    if(!token){
        return res.status(401).json({message:"unauthorized"});
    }
    try{
       

        // const token=req.header('Authorization').replace('Bearer ','');
        const decoded=jwt.verify(token,process.env.SECRET_KEY);
        console.log("d",decoded);
        const captainExists=await captain.findOne({_id:decoded._id});
        console.log("cp:",captainExists);
        if(!captainExists){
            throw new Error();
        }
        req.token=token;
        req.captain=captainExists;
        next();
    }catch(error){
        res.status(401).json({message:'Please authenticate'});
    }
}