import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, ShieldCheck, Car, Key,RectangleHorizontal } from 'lucide-react';

const DriverDetails = () => {
  // Add error handling for localStorage
  const getRideDetails = () => {
    try {
      const rideData = localStorage.getItem('currentRide');
      console.log('Current ride data:', rideData);
      if (!rideData) return null;
      return JSON.parse(rideData);
    } catch (error) {
      console.error('Error parsing ride details:', error);
      return null;
    }
  };

  const currentRide = getRideDetails();
  
  useEffect(() => {
    if (currentRide?.status !== 'matched') {
      const rideData = localStorage.getItem('currentRide');
      if (rideData) {
        const parsedData = JSON.parse(rideData);
        if (parsedData.status === 'matched') {
          window.location.reload(); // Force refresh if status mismatch
        }
      }
    }
  }, [currentRide]);

  // Add early return with loading state if no ride details
  if (!currentRide || !currentRide.captain) {
    return (
      <div className="bg-white p-6 rounded-t-3xl shadow-lg">
        <p className="text-center text-gray-600">Loading driver details...</p>
      </div>
    );
  }

  const { captain, otp } = currentRide;
  console.log(currentRide);

  return (
    <div className="bg-white p-6 rounded-t-3xl shadow-lg">
      {/* OTP Section */}
      {otp ? (
        <div className="bg-gray-50 p-4 rounded-lg mb-2 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Key className="text-green-600" size={24} />
            <p className="text-gray-600 text-lg">Your OTP</p>
          </div>
          <p className="font-bold text-4xl text-green-600 tracking-wider">{otp}</p>
          <p className="text-sm text-gray-500 mt-2">Share this code with your driver</p>
        </div>
      ) : null}

      {/* Driver Info */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl font-semibold">Your Driver</h2>
          <p className="text-xl font-bold text-gray-800 mt-1">{captain.name}</p>
          <p className="text-lg font-semibold text-gray-600">{captain.phoneNumber}</p>
        </div>
        <ShieldCheck className="text-green-600" size={32} />
      </div>

      {/* Vehicle Details */}
      <div className="bg-gray-50 p-4 rounded-lg mb-2">
        <div className="flex items-cente justify-between gap-3 w-full">
        <div className='flex flex-col items-center '>
          <Car className="text-gray-600" size={24} />
          
            <p className="text-gray-600">Vehicle</p>
            <p className="font-bold text-lg">
              {captain.vehicle?.color} {captain.vehicle?.vehicleType}
            </p>
           
          </div>
          <div className='flex flex-col items-center '>
            <RectangleHorizontal className="text-gray-600" size={24} />
            <p className="text-gray-600">Plate Number</p>
            <p className="font-bold text-lg">{captain.vehicle?.plate}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold">
          <MessageCircle size={24} />
          Message
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-4 rounded-lg text-lg font-semibold">
          <Phone size={24} />
          Call
        </button>
      </div>

      {/* <Link to={'/ridestarted'}>
        <button className="w-full bg-black text-white py-4 rounded-lg text-lg font-semibold">
          Start Trip
        </button>
      </Link> */}
    </div>
  );
};

export default DriverDetails;