import React from 'react';
import { MapPin, Square, Clock, CreditCard } from "lucide-react";

const WaitForDriver = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-5 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xl font-semibold">Finding your driver</h4>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
      </div>

      <div className="flex justify-center my-8">
        <div className="flex items-center gap-2">
          <Clock className="text-gray-600" />
          <p className="text-gray-600">Estimated arrival: 3 mins</p>
        </div>
      </div>

      {/* Pickup Location */}
      <div className="mt-5 border-b pb-3">
        <div className="flex items-center gap-3">
          <MapPin className="text-black" size={20} />
          <div>
            <h4 className="font-bold text-lg">562/11-A</h4>
            <p className="text-gray-600 text-sm">Kaikondrahalli, Bengaluru, Karnataka</p>
          </div>
        </div>
      </div>

      {/* Destination */}
      <div className="mt-3 border-b pb-3">
        <div className="flex items-center gap-3">
          <Square className="text-black" size={20} />
          <div>
            <h4 className="font-bold text-lg">Third Wave Coffee</h4>
            <p className="text-gray-600 text-sm">
              17th Cross Rd, PWD Quarters, 1st Sector, HSR Layout, Bengaluru, Karnataka
            </p>
          </div>
        </div>
      </div>

      {/* Fare Section */}
      <div className="mt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="text-black" size={20} />
            <h4 className="font-bold text-lg">₹193.20</h4>
          </div>
          <p className="text-gray-600 text-sm">Cash Payment</p>
        </div>
      </div>
      <div>
        <button className="bg-green-600 text-white w-full py-2 mt-5 rounded-md">
          Confirm Trip
        </button>
      </div>
    </div>
  );
};

export default WaitForDriver;
