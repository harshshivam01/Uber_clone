import React, { useEffect, useState } from 'react';
import { Phone, MapPin, Square, Shield, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import LiveTracking from '../component/LiveTracking';

const RiderPage = () => {
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();
  const [coordinates, setCoordinates] = useState({
    pickup: null,
    destination: null
  });
  const [rideData, setRideData] = useState(null);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleRideComplete = (data) => {
      console.log('Ride completed:', data);
      localStorage.removeItem('currentRide');
      navigate('/home');
    };

    socket.on('ride-completed', handleRideComplete);

    return () => {
      socket.off('ride-completed');
    };
  }, [socket, isConnected, navigate]);

  const getAddressCoordinates = async (address) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        return data.features[0].center;
      }
      throw new Error('No coordinates found for address');
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return null;
    }
  };

  const getCurrentRide = async () => {
    try {
      const rideData = localStorage.getItem('currentRide');
      if (!rideData) return null;

      const parsedData = JSON.parse(rideData);
      if (!parsedData || !parsedData.captain) return null;

      if (!coordinates.pickup || !coordinates.destination) {
        const [pickupCoords, destinationCoords] = await Promise.all([
          getAddressCoordinates(parsedData.pickup),
          getAddressCoordinates(parsedData.destination)
        ]);

        if (!pickupCoords || !destinationCoords) {
          console.error('Failed to fetch coordinates');
          return null;
        }

        setCoordinates({
          pickup: pickupCoords,
          destination: destinationCoords
        });
      }

      return {
        ...parsedData,
        pickup: {
          coordinates: coordinates.pickup,
          address: parsedData.pickup
        },
        destination: {
          coordinates: coordinates.destination,
          address: parsedData.destination
        },
        captain: {
          ...parsedData.captain,
          location: coordinates.pickup
        },
        rideStatus: parsedData.status || 'matched'
      };
    } catch (error) {
      console.error('Error parsing ride data:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchRideData = async () => {
      const data = await getCurrentRide();
      if (data) {
        setRideData(data);
      }
    };

    fetchRideData();
  }, [coordinates.pickup, coordinates.destination]);

  return (
    <div className="relative h-screen bg-gray-50">
      {/* Map Background */}
      <div className="absolute inset-0">
        <LiveTracking 
          pickupLocation={coordinates.pickup}
          dropLocation={coordinates.destination}
        />
      </div>

      {/* Fixed Bottom Panel */}
      {rideData && rideData.captain && (
        <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg max-h-[300px] overflow-y-auto">
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
                  <h4 className="font-bold text-lg">{rideData.captain.name}</h4>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-sm">{rideData.captain.rating || "4.8"}</span>
                  </div>
                </div>
              </div>
              <a 
                href={`tel:${rideData.captain.phoneNumber}`} 
                className="bg-green-500 p-3 rounded-full hover:bg-green-600 transition-colors"
              >
                <Phone className="w-5 h-5 text-white" />
              </a>
            </div>

            {/* Vehicle Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Vehicle</p>
                  <p className="font-semibold">{rideData.captain.vehicle.vehicleType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Number</p>
                  <p className="font-semibold">{rideData.captain.vehicle.plate}</p>
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
                <p className="font-semibold">{rideData.pickup.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Square className="text-red-600" size={20} />
              <div>
                <p className="text-sm text-gray-600">Destination</p>
                <p className="font-semibold">{rideData.destination.address}</p>
              </div>
            </div>

            {/* Fare Details */}
            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Estimated Fare</p>
                <p className="font-bold text-lg">₹{rideData.fare}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiderPage;