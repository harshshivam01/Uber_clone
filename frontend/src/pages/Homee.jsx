import React, { useState } from "react";
import { MapPin, Map } from "lucide-react";
import uberlogo from "../assets/uber-logo.svg";
import SuggestionBox from "../component/SuggestionBox";
import ConfirmVehicle from "../component/ConfirmVehicle";
import ConfirmedVehicle from "../component/ConfirmedVehicle";
import WaitForDriver from "../component/WaitForDriver";
import DriverDetails from "../component/DriverDetails";

const Homee = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [pickuplocation, setPickupLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [suggestVehicle, setSuggestVehicle] = useState(false);
  const [confirmedVehicle, setConfirmedVehicle] = useState(false);
  const [rideStatus, setRideStatus] = useState('search'); // search, selecting, confirmed, waiting, matched
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const handleFocus = () => {
    setIsFocused(true);
    setSuggestVehicle(false);
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setRideStatus('selecting');
    setSuggestVehicle(true);
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setRideStatus('confirmed');
  };

  const handleRideConfirm = () => {
    setRideStatus('waiting');
    // Simulate driver finding - Replace with actual API call
    setTimeout(() => {
      setRideStatus('matched');
    }, 5000);
  };

  return (
    <div className="overflow-hidden relative">
      {/* Background Image - Always visible */}
      <div className="h-screen w-screen">
        <img
          className="h-full w-full object-cover"
          src="https://s.wsj.net/public/resources/images/BN-XR452_201802_M_20180228165525.gif"
        />
      </div>

      {/* Uber Logo - Always visible */}
      <img className="w-24 absolute left-5 top-5 " src={uberlogo} />

      {/* Different panels based on ride status */}
      {rideStatus === 'search' && (
        <div
          className={`bg-white absolute w-full p-5 transition-all duration-300 ${
            isFocused ? "top-0 shadow-lg h-screen" : "top-[70%]"
          }`}
          onBlur={handleBlur}
        >
          <div
            className={`absolute h-16 w-1 bg-gray-700  rounded-full ${
              isFocused ? "top-[17%] left-10" : "top-[35%] left-10"
            }`}
          ></div>
          <div className="h-[40%]">
            <h4 className="font-semibold text-3xl bg-white p-2">Find a trip</h4>

            {/* Form with focus handling */}
            <form
              onFocus={handleFocus}
              className="p-2 flex flex-col gap-4"
              onSubmit={handleSearchSubmit}
            >
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 ">
                  <MapPin size={20} />
                </span>
                <input
                  className="w-full p-3 pl-10 bg-gray-100 text-lg rounded-md border border-gray-300 focus:outline-none focus:border-black"
                  type="text"
                  required
                  value={pickuplocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="Add pick-up location"
                />
              </div>
     
              {/* Destination Field */}
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
                  placeholder="Enter destination"
                />
              </div>
              <button
                className={`${
                  suggestVehicle ? "hidden" : "block"
                } bg-black text-white p-3 w-full rounded-md font-semibold`}
                type="submit"
              >
                Book Ride
              </button>
            </form>
          </div>

          {/* Bottom Container */}
          <SuggestionBox />
        </div>
      )}

      {rideStatus === 'selecting' && (
        <div className="absolute bottom-0 left-0 w-full">
          <ConfirmVehicle onSelect={handleVehicleSelect} />
        </div>
      )}

      {rideStatus === 'confirmed' && (
        <div className="absolute bottom-0 left-0 w-full">
          <ConfirmedVehicle 
            onConfirm={handleRideConfirm}
            selectedVehicle={selectedVehicle}
            pickupLocation={pickuplocation}
            destination={destination}
          />
        </div>
      )}

      {rideStatus === 'waiting' && (
        <div className="absolute bottom-0 left-0 w-full">
          <WaitForDriver />
        </div>
      )}

      {rideStatus === 'matched' && (
        <div className="absolute bottom-0 left-0 w-full">
          <DriverDetails />
        </div>
      )}
    </div>
  );
};

export default Homee;
