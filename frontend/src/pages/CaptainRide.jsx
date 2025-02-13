import React, { useState } from 'react';
import { MapPin, Square, Navigation2, Check, Phone, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CaptainRide = () => {
  const [rideCompleted, setRideCompleted] = useState(false);
  const navigate = useNavigate();

  const mockRideDetails = {
    passenger: {
      name: "John Doe",
      rating: "4.8"
    },
    distance: {
      remaining: "2.5",
      total: "5.8"
    },
    destination: "Third Wave Coffee, HSR Layout",
    pickupLocation: "HSR Layout, Bangalore",
    estimatedTime: "10 mins",
    fare: "250.00"
  };

  const handleCompleteRide = () => {
    setRideCompleted(true);
    setTimeout(() => {
      navigate('/captain-home');
    }, 2000);
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

      {/* Navigation Panel */}
      <div className="absolute top-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Navigation2 className="text-blue-600" size={24} />
            <div>
              <p className="text-sm text-gray-600">Distance Remaining</p>
              <p className="font-bold text-lg">{mockRideDetails.distance.remaining} km</p>
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
      </div>

      {/* Bottom Panel */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg p-6">
        <div className="space-y-4">
          {/* Passenger Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600">Passenger</p>
                <p className="font-semibold text-lg">{mockRideDetails.passenger.name}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Rating</p>
                <p className="font-semibold">{mockRideDetails.passenger.rating}⭐</p>
              </div>
            </div>
          </div>

          {/* Route Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="text-green-600" size={24} />
              <div>
                <p className="text-gray-600">Pickup</p>
                <p className="font-semibold">{mockRideDetails.pickupLocation}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Square className="text-red-600" size={24} />
              <div>
                <p className="text-gray-600">Destination</p>
                <p className="font-semibold">{mockRideDetails.destination}</p>
              </div>
            </div>
          </div>

          {/* Complete Ride Button */}
          {!rideCompleted ? (
            <button
              onClick={handleCompleteRide}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Complete Ride
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 py-3 text-green-600">
              <Check size={24} />
              <span className="font-semibold">Ride Completed</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaptainRide;
