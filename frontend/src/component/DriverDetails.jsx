import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, ShieldCheck, Car, Key, RectangleHorizontal, Star } from 'lucide-react';

const DriverDetails = () => {
  const [rideData, setRideData] = useState(null);

  useEffect(() => {
    const currentRide = localStorage.getItem('currentRide');
    if (currentRide) {
      try {
        const parsedRide = JSON.parse(currentRide);
        setRideData(parsedRide);
      } catch (error) {
        console.error('Error parsing ride data:', error);
      }
    }
  }, []);

  if (!rideData || !rideData.captain) {
    return (
      <div className="bg-white p-6 rounded-t-3xl shadow-lg">
        <p className="text-center text-gray-600">Loading driver details...</p>
      </div>
    );
  }

  const { captain, otp } = rideData;

  return (
 
      <div className="bg-white p-6 rounded-3xl shadow-xl space-y-6 border border-gray-200">
        {/* OTP Section */}
        {otp && (
          <div className="bg-gradient-to-r from-green-100 to-green-300 p-5 rounded-2xl text-center text-white shadow-md">
            <span className='flex justify-center gap-2 text-gray-600'><p className="text-lg mb-2 text-gray-600">Your OTP </p><Key/> </span>
            <p className="font-extrabold text-5xl tracking-wider text-gray-600">{otp}</p>
          </div>
        )}
  
        {/* Driver Info */}
        <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center shadow-md">
            <span className="text-3xl font-bold text-indigo-500">
              {captain.name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-bold text-xl text-gray-800 mb-1">{captain.name}</h3>
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-gray-700 text-lg">{captain.rating || '4.5'}</span>
            </div>
          </div>
          <div className="flex gap-3 ml-auto">
            <button className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
  
        {/* Vehicle Details */}
        <div className="bg-gray-50 p-5 rounded-2xl shadow-sm border border-gray-200">
          <div className="grid grid-cols-2 gap-6 text-center">
            <div>
              <p className="text-gray-500 text-sm mb-1">Vehicle</p>
              <p className="font-semibold text-lg text-gray-800">
                {captain.vehicle.vehicleType}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Number</p>
              <p className="font-semibold text-lg text-gray-800">
                {captain.vehicle.plate}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
};

export default DriverDetails;