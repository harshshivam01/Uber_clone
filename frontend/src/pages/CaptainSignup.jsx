import { Link } from "react-router-dom";
import uberLogo from "../assets/uber-driver.svg";
import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { CaptainDataContext } from "../context/CaptainContext";
const CaptainSignup = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vehicle, setVehicle] = useState({
    color: "",
    plate: "",
    capacity:4,
    vehicleType: "car"
  });
  const navigate = useNavigate();
  const { setCaptainData } = useContext(CaptainDataContext);

  const submithandler = async(e) => {
    e.preventDefault();
    try {
      const captainData = {
        fullname: {
          firstname: firstname,
          lastname: lastname
        },
        email: email,
        password: password,
        vehicle: vehicle
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/captain/register`, 
        captainData
      );
      console.log(response.data);
      
      setCaptainData(response.data.newCaptain);
      navigate("/captain-login");
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      // Add error handling UI here
    }
  };

  return (
    <div className="p-7 flex flex-col justify-between h-screen">
      <div>
        <img className="w-24 mb-1" src={uberLogo}></img>
        <form
          onSubmit={(e) => {
            submithandler(e);
          }}
        >
          <h3 className="text-xl font-medium mb-2">What's your name</h3>
          <div className="flex items-center justify-between gap-3">
            <input
              className="border bg-[#eeeeee] px-4 py-2 rounded-md w-1/2 text-lg placeholder:text-base mb-2  "
              required
              autoComplete="off"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              type="text"
              placeholder="First Name"
            />
            <input
              className="border bg-[#eeeeee] px-4 py-2 rounded-md w-1/2 text-lg placeholder:text-base mb-2  "
              required
              autoComplete="off"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              type="text"
              placeholder="Last Name"
            />
          </div>
          <h3 className="text-xl font-medium mb-2">What's your email</h3>
          <input
            className="border bg-[#eeeeee] px-4 py-2 rounded-md w-full text-lg placeholder:text-base mb-2  "
            required
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="email@example.com"
          />
          <h3 className="text-xl font-medium mb-2">Enter password</h3>
          <input
            className="border bg-[#eeeeee] px-4 py-2 rounded-md w-full text-lg placeholder:text-base mb-2"
            required
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="password"
          />
          <div className="mb-3">
  <h3 className="text-xl font-semibold mb-2 w-full">Vehicle Details</h3>
  <div className="flex flex-wrap gap-3">
    {/* Vehicle Color */}
    <input
      className="border bg-gray-100 px-4 py-2 rounded-md w-[48%] focus:ring-2 focus:ring-blue-300 outline-none"
      required
      value={vehicle.color}
      onChange={(e) => setVehicle({ ...vehicle, color: e.target.value })}
      placeholder="Vehicle Color"
    />
    
    {/* License Plate */}
    <input
      className="border bg-gray-100 px-4 py-2 rounded-md w-[48%] focus:ring-2 focus:ring-blue-300 outline-none"
      required
      value={vehicle.plate}
      onChange={(e) => setVehicle({ ...vehicle, plate: e.target.value })}
      placeholder="License Plate"
    />
    
    {/* Vehicle Type */}
    <select
      className="border bg-gray-100 px-4 py-2 rounded-md w-full focus:ring-2 focus:ring-blue-300 outline-none"
      value={vehicle.vehicleType}
      onChange={(e) => setVehicle({ ...vehicle, vehicleType: e.target.value })}
    >
      <option value="car">Car</option>
      <option value="bike">Bike</option>
      <option value="auto">Auto</option>
    </select>
    
    {/* Vehicle Capacity */}
    <input
      className="border bg-gray-100 px-4 py-2 rounded-md w-full focus:ring-2 focus:ring-blue-300 outline-none"
      required
      type="number"
      min="1"
      value={vehicle.capacity}
      onChange={(e) => setVehicle({ ...vehicle, capacity: e.target.value })}
      placeholder="Vehicle Capacity"
    />
  </div>
</div>

          <button
            className="bg-[#111] text-white font-semibold px-4 py-2 rounded-md w-full  mb-2"
            type="submit"
          >
            Signup
          </button>
        </form>
        <p className="text-center text-sm">
          Already a user ?{" "}
          <Link to="/captain-login" className="text-blue-400 font-semibold">
            Sign in
          </Link>
        </p>
      </div>

      <div>
        <p className="text-center text-[8px]">
          We collect and use your personal data to provide ride services,
          improve user experience, and ensure safety. Your information is
          securely stored and not shared without consent, except as required by
          law or to complete ride transactions.
        </p>
      </div>
    </div>
  );
};

export default CaptainSignup;
