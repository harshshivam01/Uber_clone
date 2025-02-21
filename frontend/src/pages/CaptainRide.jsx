import React, { useState, useEffect } from 'react';
import { MapPin, Square, Navigation2, Check, Phone, MessageCircle, Clock, DollarSign, Star, Route, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import LiveTracking from '../component/LiveTracking';

const CaptainRide = () => {
  const [rideCompleted, setRideCompleted] = useState(false);
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();
  const [currentRide, setCurrentRide] = useState(null);
  const [coordinates, setCoordinates] = useState({
    pickup: null,
    destination: null
  });

  const getAddressCoordinates = async (address) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        return data.features[0].center; // Returns [longitude, latitude]
      }
      throw new Error('No coordinates found for address');
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchRideData = async () => {
      const rideData = localStorage.getItem('currentCaptainRide');
      if (rideData) {
        const parsedData = JSON.parse(rideData);
        
        // Fetch coordinates for pickup and destination
        const [pickupCoords, destinationCoords] = await Promise.all([
          getAddressCoordinates(parsedData.pickupLocation || parsedData.pickup),
          getAddressCoordinates(parsedData.destination)
        ]);

        setCoordinates({
          pickup: pickupCoords,
          destination: destinationCoords
        });

        setCurrentRide({
          ...parsedData,
          pickupLocation: {
            coordinates: pickupCoords,
            address: parsedData.pickupLocation || parsedData.pickup
          },
          destination: {
            coordinates: destinationCoords,
            address: parsedData.destination
          }
        });
      }
    };

    fetchRideData();
  }, []);

  const handleCompleteRide = () => {
    if (socket && isConnected) {
      socket.emit('complete-ride', { rideId: currentRide.rideId });
    }
    setRideCompleted(true);
    localStorage.removeItem('currentCaptainRide');
    setTimeout(() => {
      navigate('/captain-home');
    }, 2000);
  };

  if (!currentRide || !coordinates.pickup || !coordinates.destination) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-gray-50">
      {/* Map Background */}
      <div className="absolute inset-0">
        <LiveTracking 
          pickupLocation={coordinates.pickup}
          dropLocation={coordinates.destination}      
        />
      </div>

      {/* Top Navigation Bar */}
      <div className="absolute top-4 left-4 right-4">
        <div className="bg-white rounded-xl shadow-lg p-4 backdrop-blur-lg bg-opacity-90">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <button 
              onClick={() => navigate('/captain-home')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Navigation2 size={24} className="text-gray-600" />
            </button>

            {/* Ride Status */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-gray-700">Ride in Progress</span>
            </div>

            {/* Emergency Button */}
            <button 
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
              onClick={() => {/* Add emergency handling */}}
            >
              <AlertCircle size={24} />
              <span className="text-sm font-medium">SOS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Fixed Panel */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-xl"
        style={{ maxHeight: '40vh', overflowY: 'auto' }}
        
      >
        {/* Panel Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Passenger Card */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xl font-semibold text-gray-600">
                    {currentRide.passengerName?.charAt(0) || 'P'}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{currentRide.passengerName}</h3>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-gray-600">{currentRide.passengerRating}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <a
                  href={`tel:${currentRide.passengerPhone}`}
                  className="p-3 bg-white rounded-full shadow-sm hover:bg-gray-50"
                >
                  <Phone size={20} className="text-blue-600" />
                </a>
                <button className="p-3 bg-white rounded-full shadow-sm hover:bg-gray-50">
                  <MessageCircle size={20} className="text-blue-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Trip Details */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center gap-1">
                <MapPin className="text-green-600" size={24} />
                <div className="w-0.5 h-10 bg-gray-300"></div>
                <Square className="text-red-600" size={24} />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Pickup Location</p>
                  <p className="font-medium text-gray-800">{currentRide.pickupLocation?.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Drop Location</p>
                  <p className="font-medium text-gray-800">{currentRide.destination?.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ride Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={18} className="text-gray-600" />
                <span className="text-sm text-gray-600">Est. Time</span>
              </div>
              <p className="font-semibold text-gray-800">25 mins</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Route size={18} className="text-gray-600" />
                <span className="text-sm text-gray-600">Distance</span>
              </div>
              <p className="font-semibold text-gray-800">5.2 km</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign size={18} className="text-gray-600" />
                <span className="text-sm text-gray-600">Fare</span>
              </div>
              <p className="font-semibold text-gray-800">₹{currentRide.estimatedFare}</p>
            </div>
          </div>

          {/* Action Button */}
          {!rideCompleted ? (
            <button
              onClick={handleCompleteRide}
              className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Check size={20} />
              Complete Ride
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 py-4 text-green-600 bg-green-50 rounded-xl">
              <Check size={20} />
              <span className="font-semibold">Ride Completed</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaptainRide;
