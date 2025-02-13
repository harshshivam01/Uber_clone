import React, { useState, useEffect } from 'react';
import uberLogo from '../assets/uber-logo.svg';
import { LogOut, Clock, DollarSign, Route, Car, MapPin, Square, Phone, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import RideRequestPopup from '../component/RideRequestPopup';
import OtpVerificationPanel from '../component/OtpVerificationPanel';
import { useNavigate } from 'react-router-dom';

const CaptainHome = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [showRideRequest, setShowRideRequest] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [rideAccepted, setRideAccepted] = useState(false);
  const [showDefaultView, setShowDefaultView] = useState(false);
  const [showOtpPanel, setShowOtpPanel] = useState(false);
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

  // Show ride request popup after component mounts
  useEffect(() => {
    const mockRequest = {
      pickupLocation: "HSR Layout, Bangalore",
      destination: "Koramangala, Bangalore",
      estimatedFare: "250.00",
      passengerName: "John Doe",
      passengerRating: "4.8",
      passengerPhone: "+91 9876543210"
    };
    setCurrentRequest(mockRequest);
    setShowRideRequest(true);
  }, []);

  const handleGoOnline = () => {
    setIsOnline(!isOnline);
  };

  const handleAcceptRide = () => {
    setShowRideRequest(false);
    setRideAccepted(true);
    setShowDefaultView(false);
  };

  const handleDeclineRide = () => {
    setShowRideRequest(false);
    setShowDefaultView(true);
  };

  const handleStartRide = () => {
    setShowOtpPanel(true);
  };

  const handleOtpVerify = (success) => {
    if (success) {
      setShowOtpPanel(false);
      navigate('/captain-ridestarted');
    }
  };

  return (
    <div className="relative h-screen">
      {/* Background Map */}
      <div className="absolute inset-0">
        <img
          src="https://s.wsj.net/public/resources/images/BN-XR452_201802_M_20180228165525.gif"
          alt="Live Map"
          className="w-full h-full object-cover"
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
              <button className="p-2 rounded-full bg-blue-100 text-blue-600">
                <MessageCircle size={24} />
              </button>
              <button className="p-2 rounded-full bg-green-100 text-green-600">
                <Phone size={24} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Passenger Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600">Passenger</p>
                  <p className="font-semibold text-lg">{currentRequest?.passengerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">Rating</p>
                  <p className="font-semibold">{currentRequest?.passengerRating}⭐</p>
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
        </div>
      )}

      {/* OTP Verification Panel */}
      {showOtpPanel && (
        <OtpVerificationPanel
          onVerify={handleOtpVerify}
          onClose={() => setShowOtpPanel(false)}
        />
      )}
    </div>
  );
};

export default CaptainHome;
