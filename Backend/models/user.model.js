const mongoose=require('mongoose');
require("dotenv").config();
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema=new mongoose.Schema({
    fullname:{
       firstname:{
         type:String,
         required:true,
         minlength:[3,"first name must be 3 characters long"],

       },
       lastname:{
         type:String,
      
         minlength:[3,"last name must be 3 characters long"],
       }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        // match:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        // lowercase:true
        minlength:[5,"email must be 5 characters long"],
    },
    password:{
        type:String,
        required:true,
        select:false,
        minlength:[6,"password must be 6 characters long"],
        // match:/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    },
    socketId:{
        type:String,
       
       
    }
});

userSchema.methods.generateAuthToken=function(){
    const token=jwt.sign({_id:this._id},process.env.SECRET_KEY, { expiresIn: '1h' })
    return token;
}

userSchema.methods.comparePasword=async function (password){
    return await bcrypt.compare(password,this.password);

}

userSchema.statics.hashedPassword=async function(password){
    const hashedPassword=await bcrypt.hash(password,12);
    return hashedPassword;
}

const user=mongoose.model('user',userSchema);

module.exports=user;