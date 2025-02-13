import React from 'react';
import {Link} from 'react-router-dom'
import { Phone, MessageCircle, Star, ShieldCheck } from 'lucide-react';

const DriverDetails = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-5 max-w-md mx-auto">
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
        <ShieldCheck className="text-green-600" size={24} />
      </div>

      <div className="bg-gray-100 p-3 rounded-lg mb-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Vehicle</p>
            <p className="font-semibold">Swift Dzire</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Number</p>
            <p className="font-semibold">KA 01 AB 1234</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg">
          <MessageCircle size={20} />
          Message
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg">
          <Phone size={20} />
          Call
        </button>
      </div>
      <Link to={'/ridestarted'}>
        <button className="bg-green-600 text-white w-full py-2 mt-5 rounded-md">
          Confirm Trip
        </button>
        </Link>
      
    </div>
  );
};

 export default DriverDetails;