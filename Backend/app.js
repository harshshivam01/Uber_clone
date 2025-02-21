require('dotenv').config();
const express = require("express");
const app = express();
const cors =require('cors');
const connectDb = require('./db/db');
const userRouter=require('./routes/user.routes');
const captainRouter=require('./routes/captain.routes');
const cookieParser=require('cookie-parser');
const mapRouter = require('./routes/maps.route');
const rideRoutes = require('./routes/ride.routes');

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? "https://uber-clone-frontend-q5kd.onrender.com"
    : "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDb("uber");

app.use('/api/user', userRouter);
app.use('/api/captain', captainRouter);
app.use('/api/maps', mapRouter);
app.use('/api/ride', rideRoutes);

module.exports =app;