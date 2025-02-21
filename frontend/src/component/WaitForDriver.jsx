import React, { useEffect } from 'react';
import { MapPin, Square, CreditCard } from "lucide-react";

const WaitForDriver = ({ rideDetails, onCancel }) => {
  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      const currentRide = localStorage.getItem('currentRide');
      if (currentRide) {
        const rideData = JSON.parse(currentRide);
        if (rideData.status === 'waiting') {
          localStorage.removeItem('currentRide');
        }
      }
    };
  }, []);

  // Add estimated time state or get it from props if needed
  const estimatedTime = rideDetails?.estimatedTime || 5; // Default to 5 minutes if not provided

  return (
    <div className="bg-white rounded-lg shadow-md p-5 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-2xl font-semibold">Finding your captain...</h4>
      </div>

      {/* Estimated Time */}
      <div className="text-center mb-4">
        <p className="text-gray-600">Estimated arrival time</p>
        <p className="text-xl font-semibold">{estimatedTime} mins</p>
      </div>

      {/* Ride Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <MapPin className="text-green-600" size={20} />
          <div>
            <p className="text-gray-600">Pickup</p>
            <p className="font-semibold">{rideDetails?.pickup}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Square className="text-red-600" size={20} />
          <div>
            <p className="text-gray-600">Destination</p>
            <p className="font-semibold">{rideDetails?.destination}</p>
          </div>
        </div>

        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div>
            <p className="text-gray-600">Estimated Fare</p>
            <p className="font-semibold text-lg">₹{rideDetails?.fare}</p>
          </div>
          <p className="text-gray-600">Cash Payment</p>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={onCancel}
          className="w-full bg-red-100 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-200 transition-colors"
        >
          Cancel Ride
        </button>
      </div>
    </div>
  );
};

export default WaitForDriver;
