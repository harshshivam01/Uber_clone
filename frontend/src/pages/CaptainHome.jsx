import React, { useState, useEffect,useContext } from 'react';
import uberLogo from '../assets/uber-logo.svg';
import { LogOut, Clock, DollarSign, Route, Car, MapPin, Square, Phone, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import RideRequestPopup from '../component/RideRequestPopup';
import OtpVerificationPanel from '../component/OtpVerificationPanel';
import { useNavigate } from 'react-router-dom';
import {CaptainDataContext} from  '../context/CaptainContext';
import {useSocket} from '../context/SocketContext';
import LiveTracking from '../component/LiveTracking';


const CaptainHome = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [showRideRequest, setShowRideRequest] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [rideAccepted, setRideAccepted] = useState(false);
  const [showDefaultView, setShowDefaultView] = useState(false);
  const [showOtpPanel, setShowOtpPanel] = useState(false);
  const {captainData}=useContext(CaptainDataContext);
  const {sendMessage,isConnected,socket,receiveMessage}=useSocket();
  const [rideLocations, setRideLocations] = useState({
    pickup: null,
    destination: null,
    currentLocation: null
  });
  const [locationWatchId, setLocationWatchId] = useState(null);

  console.log("current",currentRequest);
const navigate = useNavigate();
  // Mock data
  const driverStats = {
    earnings: "₹1,245.00",
    activeHours: "6.5",
    totalDistance: "120"
  };

  const driverDetails = {
    currentLocation: "HSR Layout, Bangalore",
    vehicleDetails: {
      type: "Swift Dzire",
      number: "KA 01 AB 1234"
    }
  };

  // Add new state for connection status
  const [isLocationTracking, setIsLocationTracking] = useState(false);

  // Combine socket and location tracking logic
  useEffect(() => {
    if (!isConnected || !captainData || !captainData._id) {
        return;
    }

    const connectCaptain = () => {
        console.log('Connecting captain:', captainData._id);
        sendMessage('join', {
            userId: captainData._id,
            userType: 'captain'
        });
        setShowDefaultView(true); // Show default view when connecting
    };

    connectCaptain();

    // Reconnect handler
    const reconnectInterval = setInterval(() => {
        if (!isConnected) {
            connectCaptain();
        }
    }, 5000);

    return () => {
        clearInterval(reconnectInterval);
    };
}, [isConnected, captainData, sendMessage]);

  // Handle online/offline status
  const handleGoOnline = () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    
    if (!newStatus && locationWatchId) {
      navigator.geolocation.clearWatch(locationWatchId);
      setLocationWatchId(null);
    }

    if (socket && isConnected) {
      sendMessage('captain-status', {
        userId: captainData._id,
        isOnline: newStatus
      });
    }
  };

 
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Listen for new ride requests
    const unsubscribeNewRide = receiveMessage('new-ride', (data) => {
        console.log('New ride request received:', data);
        if (data && data.ride) {
            setCurrentRequest({
                pickupLocation: data.ride.pickup,
                destination: data.ride.destination,
                estimatedFare: data.ride.fare,
                rideId: data.ride.id,
                status: data.ride.status
            });
            setShowRideRequest(true);
        }
    });

    

    // Listen for ride acceptance confirmation
    const handleRideAcceptConfirmed = async (data) => {
        console.log('Ride acceptance confirmed:', data);
        setShowRideRequest(false);
        
        // Get coordinates for pickup and destination
        const [pickupCoords, destinationCoords] = await Promise.all([
          getAddressCoordinates(data.ride.pickup),
          getAddressCoordinates(data.ride.destination)
        ]);
    
        setRideLocations({
          pickup: pickupCoords,
          destination: destinationCoords,
          currentLocation: null // This will be updated by location tracking
        });
    
        setCurrentRequest({
          ...currentRequest,
          rideId: data.ride.id,
          pickupLocation: data.ride.pickup,
          destination: data.ride.destination,
          estimatedFare: data.ride.fare,
          passengerName: `${data.user.fullname.firstname} ${data.user.fullname.lastname}`,
          passengerRating: data.user.rating || "N/A",
          passengerPhone: data.user.phoneNumber,
          rideStatus: 'accepted'
        });
        setRideAccepted(true);
        setShowDefaultView(false);
      };
    
    socket.on('ride-accept-confirmed', handleRideAcceptConfirmed);
    socket.on('ride-accept-error', (error) => {
        console.error('Error accepting ride:', error);
        setShowRideRequest(false);
    });

    return () => {
        unsubscribeNewRide();
        socket.off('ride-accept-confirmed');
        socket.off('ride-accept-error');
    };
}, [socket, isConnected, receiveMessage]);

  const handleAcceptRide = () => {
    if (currentRequest && socket && isConnected) {
        sendMessage('accept-ride', {
            rideId: currentRequest.rideId,
            captainId: captainData._id
        });
    }
  };

  const handleDeclineRide = () => {
    setShowRideRequest(false);
    setShowDefaultView(true);
  };

  const handleStartRide = () => {
    console.log('Starting ride with ID:', currentRequest?.rideId);
    if (!currentRequest?.rideId) {
        console.error('No ride ID available');
        return;
    }
    setShowOtpPanel(true);
};

  const handleOtpVerify = (success) => {
    if (success) {
        // Store current ride details in localStorage
        localStorage.setItem('currentCaptainRide', JSON.stringify(currentRequest));
        setShowOtpPanel(false);
        navigate('/captain-ridestarted');
    }
};

// Add socket listener for ride start
useEffect(() => {
    if (!socket || !isConnected) return;

    const handleRideStarted = (data) => {
        console.log('Ride started:', data);
        // Store the updated ride data
        localStorage.setItem('currentCaptainRide', JSON.stringify({
            rideId: data.ride.id,
            pickup: data.ride.pickup,
            destination: data.ride.destination,
            estimatedFare: data.ride.fare,
            passengerName: data.ride.passenger.name,
            passengerRating: data.ride.passenger.rating,
            passengerPhone: data.ride.passenger.phoneNumber,
            status: data.ride.status
        }));
    };

    socket.on('ride-started', handleRideStarted);

    return () => {
        socket.off('ride-started');
    };
}, [socket, isConnected]);

useEffect(() => {
  if (!socket || !isConnected) return;

  socket.on('ride-cancelled', (data) => {
    console.log('Ride cancelled:', data);
    setShowRideRequest(false);
    setRideAccepted(false);
    setCurrentRequest(null);
    setShowDefaultView(true);
  });

  return () => {
    socket.off('ride-cancelled');
  };
}, [socket, isConnected]);

const getAddressCoordinates = async (address) => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
    );
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      return data.features[0].center;
    }
    return null;
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
};

// Handle location tracking when captain goes online
useEffect(() => {
  if (!isOnline || !socket || !isConnected || !captainData?._id) return;

  let watchId = null;

  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation not supported');
      return;
    }

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        // Send location update to server
        sendMessage('update-location-captain', {
          userId: captainData._id,
          latitude,
          longitude,
          accuracy
        });

        // Update local state for map
        setRideLocations(prev => ({
          ...prev,
          currentLocation: [longitude, latitude]
        }));
      },
      (error) => {
        console.error('Geolocation error:', error);
        handleLocationError(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
      }
    );

    setLocationWatchId(watchId);
  };

  startLocationTracking();

  // Cleanup function
  return () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
    }
  };
}, [isOnline, socket, isConnected, captainData]);

// Handle location errors
const handleLocationError = (error) => {
  let message = 'Location error occurred';
  switch (error.code) {
    case error.PERMISSION_DENIED:
      message = 'Location permission denied';
      break;
    case error.POSITION_UNAVAILABLE:
      message = 'Location unavailable';
      break;
    case error.TIMEOUT:
      message = 'Location request timed out';
      break;
  }
  console.error(message);
  // Optionally show error to user
};

  return (
    <div className="relative h-screen">
      {/* Background Map */}
      <div className="absolute inset-0">
        <LiveTracking
          pickupLocation={rideLocations.pickup}
          dropLocation={rideLocations.destination}
          showDirections={rideAccepted}
          isDriver={true}
        />
      </div>

      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4">
        <img src={uberLogo} alt="Uber Logo" className="w-24" />
        <Link 
          to="/captain/logout"
          className="flex items-center gap-1 bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </Link>
      </div>

      {/* Ride Request Popup */}
      {showRideRequest && (
        <RideRequestPopup
          request={currentRequest}
          isVisible={showRideRequest}
          onAccept={handleAcceptRide}
          onDecline={handleDeclineRide}
        />
      )}

      {/* Default View Panel */}
      {showDefaultView && (
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Driver Dashboard</h2>
            <button 
              onClick={handleGoOnline}
              className={`px-6 py-2 rounded-full font-semibold ${
                isOnline ? "bg-red-500 text-white" : "bg-green-500 text-white"
              }`}
            >
              {isOnline ? "Go Offline" : "Go Online"}
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <DollarSign className="text-green-600 mb-2" size={24} />
              <p className="text-gray-600 text-sm">Today's Earnings</p>
              <p className="font-semibold text-lg">{driverStats.earnings}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <Clock className="text-blue-600 mb-2" size={24} />
              <p className="text-gray-600 text-sm">Active Hours</p>
              <p className="font-semibold text-lg">{driverStats.activeHours}h</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <Route className="text-purple-600 mb-2" size={24} />
              <p className="text-gray-600 text-sm">Total Distance</p>
              <p className="font-semibold text-lg">{driverStats.totalDistance}km</p>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex items-center gap-3 mb-3">
              <Car className="text-gray-600" size={24} />
              <div>
                <p className="text-gray-600">Vehicle</p>
                <p className="font-semibold">{driverDetails.vehicleDetails.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-gray-600" size={24} />
              <div>
                <p className="text-gray-600">Current Location</p>
                <p className="font-semibold">{driverDetails.currentLocation}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accepted Ride Panel */}
      {rideAccepted && (
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-semibold">Current Ride</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-500">Active</span>
              </div>
            </div>
            <div className="flex gap-2">
              <a href={`tel:${currentRequest.passengerPhone}`} className="p-2 rounded-full bg-green-100 text-green-600">
                <Phone size={24} />
              </a>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600">Passenger</p>
                <p className="font-semibold text-lg">{currentRequest.passengerName}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Rating</p>
                <p className="font-semibold">{currentRequest.passengerRating}⭐</p>
              </div>
            </div>
          </div>
          
          {/* Route Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="text-green-600" size={24} />
              <div>
                <p className="text-gray-600">Pickup</p>
                <p className="font-semibold">{currentRequest?.pickupLocation}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Square className="text-red-600" size={24} />
              <div>
                <p className="text-gray-600">Destination</p>
                <p className="font-semibold">{currentRequest?.destination}</p>
              </div>
            </div>
          </div>

          {/* Fare Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600">Estimated Fare</p>
                <p className="font-semibold text-lg">₹{currentRequest?.estimatedFare}</p>
              </div>
              <p className="text-gray-600">Cash Payment</p>
            </div>
          </div>

          {/* Start Ride Button */}
          <button
            onClick={handleStartRide}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Start Ride
          </button>
        </div>
      )}

      {/* OTP Verification Panel */}
      {showOtpPanel && currentRequest?.rideId && (
        <OtpVerificationPanel
            onVerify={handleOtpVerify}
            rideId={currentRequest.rideId}
            onClose={() => setShowOtpPanel(false)}
        />
      )}
    </div>
  );
};

export default CaptainHome;
