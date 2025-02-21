import React, { useContext, useEffect, useState } from "react";
import { MapPin, Map } from "lucide-react";
import uberlogo from "../assets/uber-logo.svg";
import SuggestionBox from "../component/SuggestionBox";
import ConfirmVehicle from "../component/ConfirmVehicle";
import ConfirmedVehicle from "../component/ConfirmedVehicle";
import WaitForDriver from "../component/WaitForDriver";
import DriverDetails from "../component/DriverDetails";
import axios from "axios";
import { useSocket } from "../context/SocketContext";
import { UserDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import Header from '../component/Header';
import LiveTracking from "../component/LiveTracking";

const Homee = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [pickuplocation, setPickupLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [activeField, setActiveField] = useState(null); // 'pickup' or 'destination'
  const [suggestVehicle, setSuggestVehicle] = useState(false);
  const [confirmedVehicle, setConfirmedVehicle] = useState(false);
  const [rideStatus, setRideStatus] = useState('search'); // search, selecting, confirmed, waiting, matched
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [fareDetails, setFareDetails] = useState(null);
  const { sendMessage, isConnected, socket } = useSocket();
  const { userData, setUserData } = useContext(UserDataContext)
  const [coordinates, setCoordinates] = useState({
    pickup: null,
    destination: null
  });
  const [isMapFocused, setIsMapFocused] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (!isConnected || !userData || !userData._id) {
      return;
    }
    console.log('Connecting user:', userData._id);
    sendMessage('join', {
      userId: userData._id,
      userType: 'user'
    });
  }, [isConnected, userData]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Listen for ride acceptance from captain
    const handleRideAccepted = (data) => {
      console.log('Ride accepted by captain:', data);
      if (!data || !data.ride || !data.captain) {
        console.error('Invalid ride acceptance data received');
        return;
      }

      // Immediately update ride status to 'matched'
      setRideStatus('matched');
      
      // Update the ride details with captain information
      const rideDetails = {
        id: data.ride.id,
        pickup: data.ride.pickup,
        destination: data.ride.destination,
        fare: data.ride.fare,
        status: 'matched', // Explicitly set status
        otp: data.ride.otp,
        captain: {
          id: data.captain.id,
          name: data.captain.fullname,
          phoneNumber: data.captain.phoneNumber,
          vehicle: data.captain.vehicle
        }
      };

      // Store ride details for the driver panel
      localStorage.setItem('currentRide', JSON.stringify(rideDetails));
      
      // Log to verify data
      console.log('Updated ride details:', rideDetails);
    };

    socket.on('ride-accepted', handleRideAccepted);

    return () => {
      socket.off('ride-accepted');
    };
  }, [socket, isConnected]);
useEffect(()=>{
  if(!socket || !isConnected) return

  socket.on('ride-started',ride=>{
    console.log('Ride started:',ride)
    setRideStatus('ongoing')
    navigate('/ridestarted')
    
    
  })
  return ()=>{
    socket.off('ride-started')
  }
},[socket,isConnected])

useEffect(() => {
    if (!socket || !isConnected) return;

    // Listen for ride completion
    socket.on('ride-completed', (data) => {
        console.log('Ride completed:', data);
        // Clear ride data from localStorage
        localStorage.removeItem('currentRide');
        // Reset ride status
        setRideStatus('search');
        // Navigate back to home
        navigate('/home');
    });

    return () => {
        socket.off('ride-completed');
    };
}, [socket, isConnected, navigate]);

  const handleFocus = (field) => {
    setIsFocused(true);
    setSuggestVehicle(false);
    setActiveField(field);
    setIsMapFocused(false); // Ensure panel is expanded when focusing
  };

  const handleSuggestionSelect = (value) => {
    if (activeField === 'pickup') {
      setPickupLocation(value);
    } else if (activeField === 'destination') {
      setDestination(value);
    }
    setActiveField(null);
  };

  const handleVehicleConfirm = () => {
    setConfirmedVehicle(true);
    setSuggestVehicle(false);
    setIsFocused(false);
  };

  const handleBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget) && !suggestVehicle) {
      setIsFocused(false);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      // First get coordinates for both locations
      const [pickupCoords, destinationCoords] = await Promise.all([
        axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/maps/get-coordinates?address=${encodeURIComponent(pickuplocation)}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        ),
        axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/maps/get-coordinates?address=${encodeURIComponent(destination)}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
      ]);

      // Update coordinates state
      setCoordinates({
        pickup: [pickupCoords.data.lng, pickupCoords.data.lat],
        destination: [destinationCoords.data.lng, destinationCoords.data.lat]
      });

      // Calculate fare
      const fareResponse = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/ride/calculate-fare`,
        {
          pickup: pickuplocation,
          destination: destination
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setFareDetails(fareResponse.data);
      setRideStatus('selecting');
      setSuggestVehicle(true);
    } catch (error) {
      console.error("Error calculating fare:", error);
      alert('Error calculating route. Please try again.');
    }
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setRideStatus('confirmed');
  };

  const handleRideConfirm = async () => {
    try {
      if (!selectedVehicle || !selectedVehicle.type) {
        throw new Error('Please select a vehicle first');
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/ride/create`,
        {
          pickup: pickuplocation,
          destination: destination,
          vehicleType: selectedVehicle.type.toLowerCase()
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.ride) {
        setRideStatus('waiting');
        localStorage.setItem('currentRide', JSON.stringify(response.data.ride));
        console.log('Ride created:', response.data.ride);
      }
    } catch (error) {
      console.error("Error creating ride:", error);
      alert(error.response?.data?.message || 'Failed to create ride. Please try again.');
    }
  };
  const getRideData = () => ({
    pickupCoords: coordinates.pickup || [77.2090, 28.6139], // Default coordinates if none available
    destinationCoords: coordinates.destination || [77.2300, 28.6448],
    pickup: pickuplocation,
    destination: destination
  });

  const handleCancelRide = () => {
    if (socket && isConnected) {
      const currentRideData = localStorage.getItem('currentRide');
      if (currentRideData) {
        const { id: rideId } = JSON.parse(currentRideData);
        socket.emit('cancel-ride', { rideId });
        localStorage.removeItem('currentRide');
        setRideStatus('search');
      }
    }
  };

  const handleLogout = () => {
    navigate('/user/logout');
  };

  // Handler for map click
  const handleMapClick = () => {
    setIsMapFocused(true);
  };

  // Handler for panel click
  const handlePanelClick = (e) => {
    e.stopPropagation(); // Prevent click from bubbling to map
    setIsMapFocused(false);
  };

  return (
    <div className="overflow-hidden relative">
      <Header 
        userProfile={userData}
        onLogout={handleLogout}
      />

      {/* Background Image - Always visible */}
      <div className="h-screen w-screen" onClick={handleMapClick}>
        <LiveTracking 
          pickupLocation={coordinates.pickup}
          dropLocation={coordinates.destination}
        />
      </div>

      {/* Different panels based on ride status */}
      {rideStatus === 'search' && (
        <div 
          className={`bg-white absolute w-full transition-all duration-300 ${
            isMapFocused 
              ? "top-[70%]" 
              : activeField 
                ? "top-0 h-screen" 
                : "top-[70%]"
          }`}
          onClick={handlePanelClick}
        >
          <div className="panel-drag-handle" />
          <div className={`${activeField ? 'h-screen p-2' : 'h-[40%]'}`}>
            <h4 className="font-semibold text-3xl mt-10 bg-white p-2">Find a trip</h4>

            <form className="p-2 flex flex-col gap-4 max-w-md mx-auto " onSubmit={handleSearchSubmit}>
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <MapPin size={20} />
                </span>
                <input
                  className="w-full p-3 pl-10 bg-gray-100 text-lg rounded-md border border-gray-300 focus:outline-none focus:border-black"
                  type="text"
                  required
                  value={pickuplocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  onFocus={() => handleFocus('pickup')}
                  placeholder="Add pick-up location"
                />
              </div>

              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Map size={20} />
                </span>
                <input
                  className="w-full p-3 pl-10 bg-gray-100 text-lg rounded-md border border-gray-300 focus:outline-none focus:border-black"
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  onFocus={() => handleFocus('destination')}
                  placeholder="Enter destination"
                />
              </div>

              <button
                className={`${suggestVehicle ? "hidden" : "block"} bg-black text-white p-3 w-full rounded-md font-semibold mb-4`}
                type="submit"
              >
                Book Ride
              </button>
            </form>

            {/* Suggestion Box - Now centered in the screen */}
            {activeField && (
              <div className="fixed left-0 right-0 top-[75%] -translate-y-1/2 bg-white w-full max-w-md mx-auto">
                <SuggestionBox
                  activeField={activeField}
                  value={activeField === 'pickup' ? pickuplocation : destination}
                  onSelect={handleSuggestionSelect}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {rideStatus === 'selecting' && (
        <div 
          className={`absolute w-full transition-all duration-300 ${
            isMapFocused ? "bottom-0" : "bottom-0"
          }`}
          onClick={handlePanelClick}
        >
          <ConfirmVehicle
            onSelect={handleVehicleSelect}
            fareDetails={fareDetails}
          />
        </div>
      )}

      {rideStatus === 'confirmed' && (
        <div 
          className={`absolute w-full transition-all duration-300 ${
            isMapFocused ? "bottom-0" : "bottom-0"
          }`}
          onClick={handlePanelClick}
        >
          <ConfirmedVehicle
            onConfirm={handleRideConfirm}
            selectedVehicle={selectedVehicle}
            pickupLocation={pickuplocation}
            destination={destination}
            fare={fareDetails ? fareDetails[selectedVehicle.type] : null}
          />
        </div>
      )}

      {rideStatus === 'waiting' && (
        <div 
          className={`absolute w-full transition-all duration-300 ${
            isMapFocused ? "bottom-0" : "bottom-0"
          }`}
          onClick={handlePanelClick}
        >
          <WaitForDriver
            rideDetails={{
              pickup: pickuplocation,
              destination: destination,
              fare: fareDetails[selectedVehicle.type],
              vehicleType: selectedVehicle.type,
              estimatedTime: 5
            }}
            onCancel={handleCancelRide}
          />
        </div>
      )}

      {rideStatus === 'matched' && (
        <div 
          className={`absolute w-full transition-all duration-300 ${
            isMapFocused ? "bottom-0" : "bottom-0"
          }`}
          onClick={handlePanelClick}
        >
          <DriverDetails />
        </div>
      )}
    </div>
  );
};

export default Homee;
