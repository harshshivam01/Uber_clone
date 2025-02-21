import React, { useState } from 'react';
import { MapPin, Square, CreditCard, Clock } from "lucide-react";

const ConfirmedVehicle = ({ onConfirm, selectedVehicle, pickupLocation, destination, fare }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await onConfirm();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create ride');
      console.error("Error confirming ride:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 max-w-md mx-auto">
      <div className="flex items-center justify-between">
        <h4 className="text-2xl p-2 font-semibold">Confirm your trip</h4>
        <div className="flex items-center gap-2">
          <Clock className="text-gray-600" />
          <p className="text-gray-600">3 mins away</p>
        </div>
      </div>

      {/* Vehicle Image */}
      <div className="flex justify-center pt-4">
        <img
          className="w-32"
          src={selectedVehicle?.image}
          alt={selectedVehicle?.name}
        />
      </div>

      {/* Pickup Location */}
      <div className="mt-5 border-b pb-3">
        <div className="flex items-center gap-3">
          <MapPin className="text-black" size={20} />
          <div>
            <h4 className="font-bold text-lg">Pickup</h4>
            <p className="text-gray-600 text-sm">{pickupLocation}</p>
          </div>
        </div>
      </div>

      {/* Destination */}
      <div className="mt-3 border-b pb-3">
        <div className="flex items-center gap-3">
          <Square className="text-black" size={20} />
          <div>
            <h4 className="font-bold text-lg">Destination</h4>
            <p className="text-gray-600 text-sm">{destination}</p>
          </div>
        </div>
      </div>

      {/* Fare Section */}
      <div className="mt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="text-black" size={20} />
            <h4 className="font-bold text-lg">₹{fare}</h4>
          </div>
          <p className="text-gray-600 text-sm">Cash Payment</p>
        </div>
      </div>

      {error && (
        <div className="mt-3 text-red-500 text-center">
          {error}
        </div>
      )}

      <button 
        onClick={handleConfirm}
        disabled={isLoading}
        className={`w-full py-3 mt-5 rounded-md font-semibold transition-colors ${
          isLoading 
            ? "bg-gray-400 cursor-not-allowed" 
            : "bg-black text-white hover:bg-gray-800"
        }`}
      >
        {isLoading ? "Creating Ride..." : "Confirm Trip"}
      </button>
    </div>
  );
};

export default ConfirmedVehicle;
