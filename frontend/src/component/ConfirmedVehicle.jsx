import React from 'react';
import { MapPin, Square, CreditCard, Clock } from "lucide-react";

const ConfirmedVehicle = ({ onConfirm, selectedVehicle, pickupLocation, destination }) => {
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
          src={selectedVehicle?.image || "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png"}
          alt={selectedVehicle?.name || "Vehicle"}
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
            <h4 className="font-bold text-lg">{selectedVehicle?.price || "₹193.20"}</h4>
          </div>
          <p className="text-gray-600 text-sm">Cash Payment</p>
        </div>
      </div>

      <button 
        onClick={onConfirm}
        className="bg-black text-white w-full py-3 mt-5 rounded-md font-semibold hover:bg-gray-800 transition-colors"
      >
        Confirm Trip
      </button>
    </div>
  );
};

export default ConfirmedVehicle;
