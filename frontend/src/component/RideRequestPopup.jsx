import React from 'react';
import { MapPin, Square } from 'lucide-react';

const RideRequestPopup = ({ request, onAccept, onDecline, isVisible }) => {
  if (!isVisible || !request) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-20">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">New Ride Request</h2>
        
        {/* Pickup Location */}
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <MapPin className="text-green-600" size={24} />
            <div>
              <p className="text-sm text-gray-600">Pickup Location</p>
              <p className="font-semibold">{request?.pickupLocation || 'Loading...'}</p>
            </div>
          </div>
        </div>

        {/* Destination */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <Square className="text-red-600" size={24} />
            <div>
              <p className="text-sm text-gray-600">Destination</p>
              <p className="font-semibold">{request?.destination || 'Loading...'}</p>
            </div>
          </div>
        </div>

        {/* Estimated Fare */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">Estimated Fare</p>
          <p className="text-xl font-bold">₹{request?.estimatedFare || '0'}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onDecline}
            className="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            className="flex-1 py-3 px-4 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default RideRequestPopup;