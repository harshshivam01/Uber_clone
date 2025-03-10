import React from 'react';
import { UserRound } from 'lucide-react';
import ubergo from '../assets/ubergo.svg';

const ConfirmVehicle = ({ onSelect, fareDetails }) => {
  const vehicles = [
    {
      id: 1,
      name: 'Uber Moto',
      type: 'moto',
      image: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png',
      capacity: 1
    },
    {
      id: 2,
      name: 'Uber Go',
      type: 'car',
      image: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_585,w_550/v1597151125/assets/cb/c5b75b-5b9e-4ba9-9708-d10f27e7242a/original/Comfort.jpg',
      capacity: 4
    },
    {
      id: 3,
      name: 'Uber Auto',
      type: 'auto',
      image: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png',
      capacity: 3
    }
  ];

  return (
    <div className="bg-white w-screen rounded-t-3xl shadow-lg p-6">
      <h4 className="text-2xl font-semibold mb-6">Choose a Vehicle</h4>
      
      <div className="flex flex-col gap-4">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            onClick={() => onSelect({...vehicle, price: fareDetails?.[vehicle.type]})}
            className="flex justify-between bg-gray-100 p-4 rounded-lg items-center border-2 border-gray-300 hover:border-black transition-all cursor-pointer"
          >
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="w-20 object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xl font-semibold">{vehicle.name}</h4>
                <span className="flex items-center text-lg">
                  <UserRound size={18} />
                  {vehicle.capacity}
                </span>
              </div>
              <p className="text-sm text-gray-600">Get a ride</p>
            </div>
            <h4 className="text-xl font-semibold">
              {fareDetails ? `₹${fareDetails[vehicle.type]}` : 'Loading...'}
            </h4>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-500 text-center">
          Prices may vary depending on traffic and weather conditions
        </p>
      </div>
    </div>
  );
};

export default ConfirmVehicle;
