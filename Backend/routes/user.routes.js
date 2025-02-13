const express = require('express');
const userRouter = express.Router();
const {body}=require ("express-validator");
const userController=require('../controllers/user.controller');
const authMiddleware=require('../middlewares/auth.middleware');



userRouter.post('/register',[
   
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
    body('fullname.firstname').isLength({min:3}).withMessage('Firstname must be 3 characters long'),

    
    
],userController.registerUser);

userRouter.post('/login',[
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
],userController.loginUser);

userRouter.get('/profile',authMiddleware.authUser, userController.getUserProfile);
userRouter.get("/logout",authMiddleware.authUser,userController.logoutUser);

module.exports=userRouter;