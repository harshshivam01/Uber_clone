const socketIO = require('socket.io');
const Captain = require('./models/captain.model');
const User = require('./models/user.model');
const Ride = require('./models/ride.model');

let io;

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? "https://uber-clone-frontend-q5kd.onrender.com"
        : "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true // Enable CORS credentials
    },
    pingTimeout: 120000, // Increase ping timeout to 2 minutes
    pingInterval: 25000, // Add ping interval
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    parser: require('socket.io-parser') // Explicitly set parser
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Handle joining of user or captain
    socket.on('join', async (data) => {
      try {
        const { userId, userType } = data;
        console.log('Join request:', { userId, userType, socketId: socket.id });

        if (!userId || !userType) {
          console.error("Invalid join data:", data);
          return;
        }

        // Update socket ID in database
        if (userType === 'user') {
          await User.findByIdAndUpdate(userId, { socketId: socket.id });
        } else if (userType === 'captain') {
          await Captain.findByIdAndUpdate(userId, { 
            socketId: socket.id,
            isOnline: true
          });
          console.log(`Captain ${userId} socket updated: ${socket.id}`);
        } else {
          console.error("Unknown userType:", userType);
        }
      } catch (error) {
        console.error("Error in join handler:", error);
      }

    });

    socket.on('update-location-captain', async (data) => {
      try {
        console.log('Received location update:', data);
        
        const { userId, latitude, longitude, accuracy } = data;
        
        if (!userId || !latitude || !longitude) {
          return socket.emit('location-update-error', 'Missing required location data');
        }

        const updatedCaptain = await Captain.findByIdAndUpdate(
          userId,
          {
            socketId: socket.id,
            location: {
              type: 'Point',
              coordinates: [longitude, latitude], // MongoDB expects [longitude, latitude]
              accuracy: accuracy || null
            }
          },
          { new: true }
        );

        if (!updatedCaptain) {
          return socket.emit('location-update-error', 'Captain not found');
        }

        socket.emit('location-update-success', {
          coordinates: updatedCaptain.location.coordinates
        });

      } catch (error) {
        console.error('Location update error:', error);
        socket.emit('location-update-error', error.message);
      }
    });

    socket.on('accept-ride', async (data) => {
      try {
        const { rideId, captainId } = data;
        
        // Update ride status and add captain
        const updatedRide = await Ride.findByIdAndUpdate(
          rideId,
          {
            captainId: captainId,
            status: 'matched'
          },
          { new: true }
        )
        .populate('userId')
        .populate('captainId') 
        .select('+otp');

        if (!updatedRide) {
          return socket.emit('ride-accept-error', 'Ride not found');
        }

        const captain = await Captain.findById(captainId);
        
        // Emit to user with complete captain details
        if (updatedRide.userId.socketId) {
          io.to(updatedRide.userId.socketId).emit('ride-accepted', {
            ride: {
              id: updatedRide._id.toString(),
              pickup: updatedRide.pickup,
              destination: updatedRide.destination,
              fare: updatedRide.fare,
              status: 'matched',
              otp: updatedRide.otp
            },
            captain: {
              id: captain._id,
              fullname: `${captain.fullname.firstname} ${captain.fullname.lastname}`,
              phoneNumber: captain.phoneNumber,
              vehicle: captain.vehicle,
              rating: captain.rating
            }
          });
        }
      } catch (error) {
        socket.emit('ride-accept-error', error.message);
      }
    });

    // In the verifyOtp handler
    socket.on('verify-otp', async (data) => {
      try {
          const { rideId, otp } = data;
          const ride = await Ride.findById(rideId)
              .populate('userId')
              .populate('captainId')
              .select('+otp');

          // If verification successful, send ride details to captain
          socket.emit('ride-started', {
              ride: {
                  id: ride._id,
                  pickup: ride.pickup,
                  destination: ride.destination,
                  fare: ride.fare,
                  status: ride.status,
                  passenger: {
                      name: `${ride.userId.fullname.firstname} ${ride.userId.fullname.lastname}`,
                      phoneNumber: ride.userId.phoneNumber,
                      rating: ride.userId.rating || "N/A"
                  }
              }
          });
      } catch (error) {
          socket.emit('verify-otp-error', error.message);
      }
    });

    socket.on('complete-ride', async (data) => {
      try {
          const { rideId } = data;
          const updatedRide = await Ride.findByIdAndUpdate(
              rideId,
              { status: 'completed' },
              { new: true }
          ).populate('userId');

          // Notify user about ride completion
          if (updatedRide.userId?.socketId) {
              io.to(updatedRide.userId.socketId).emit('ride-completed', {
                  ride: updatedRide,
                  message: 'Ride completed successfully'
              });
          }

          socket.emit('ride-complete-confirmed');
      } catch (error) {
          socket.emit('ride-complete-error', error.message);
      }
    });

    socket.on('cancel-ride', async (data) => {
      try {
        const { rideId } = data;
        const ride = await Ride.findById(rideId).populate('captainId');
    
        if (!ride) {
          return socket.emit('cancel-ride-error', 'Ride not found');
        }
    
        // Update ride status
        await Ride.findByIdAndUpdate(rideId, { status: 'cancelled' });
    
        // Notify captain if assigned
        if (ride.captainId?.socketId) {
          io.to(ride.captainId.socketId).emit('ride-cancelled', {
            rideId,
            message: 'Ride was cancelled by user'
          });
        }
    
        socket.emit('ride-cancelled-confirmed');
      } catch (error) {
        socket.emit('cancel-ride-error', error.message);
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.id);
      try {
        // Update captain status when disconnected
        await Captain.findOneAndUpdate(
          { socketId: socket.id },
          { isOnline: false, socketId: null }
        );
      } catch (error) {
        console.error("Error handling disconnect:", error);
      }
    });
  });

  return io;
};

// Function to send messages to a specific socket ID
const sendMessageToSocketId = (socketId, data) => {
  if (!io) {
    console.error('Socket.io not initialized');
    return false;
  }

  try {
    const socket = io.sockets.sockets.get(socketId);
    if (!socket) {
      console.warn(`Socket ${socketId} not found`);
      return false;
    }

    socket.emit(data.event, data.data);
    return true;
  } catch (error) {
    console.error('Error sending message:', error);
    return false;
  }
};

module.exports = {
  initializeSocket,
  sendMessageToSocketId
};
