import React from 'react';
import { Home, Phone, AlertCircle, MapPin, Square, Shield, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const RiderPage = () => {
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
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 bg-white/90 backdrop-blur-sm">
        <Link to="/home">
          <Home className="w-8 h-8 text-black hover:text-gray-600" />
        </Link>
        <button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700">
          <AlertCircle size={20} />
          <span>Emergency</span>
        </button>
      </div>

      {/* Ride Details Panel */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg">
        {/* Driver Info Section */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400"
                alt="Driver"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h4 className="font-bold text-lg">Rahul Kumar</h4>
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-sm">4.8</span>
                </div>
              </div>
            </div>
            <button className="bg-green-500 p-3 rounded-full">
              <Phone className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Vehicle Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Vehicle</p>
                <p className="font-semibold">Swift Dzire</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Number</p>
                <p className="font-semibold">KA 01 AB 1234</p>
              </div>
              <Shield className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        {/* Route Details */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <MapPin className="text-green-600" size={20} />
            <div>
              <p className="text-sm text-gray-600">Pickup</p>
              <p className="font-semibold">562/11-A, Kaikondrahalli</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Square className="text-red-600" size={20} />
            <div>
              <p className="text-sm text-gray-600">Destination</p>
              <p className="font-semibold">Third Wave Coffee, HSR Layout</p>
            </div>
          </div>
        </div>

        {/* Safety Tips */}
        <div className="p-4 bg-gray-50 text-center text-sm text-gray-600">
          <p>Share trip details with trusted contacts for added safety</p>
        </div>
      </div>
    </div>
  );
};

export default RiderPage;
