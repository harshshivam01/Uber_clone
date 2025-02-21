import { Link, useNavigate } from "react-router-dom";
import uberLogo from "../assets/uber-logo.svg";
import { useState } from "react";
import axios from "axios";
const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 
  const navigate=useNavigate() ;

  const submithandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/user/login`,
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true, // Enable credentials
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log(response.data);
      localStorage.setItem('token', response.data.token);
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error);
      alert(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };
  
  return (
    <div className="p-7 flex flex-col justify-between h-screen">
      <div>
        <img className="w-24 mb-5 " src={uberLogo}></img>
        <form onSubmit={(e)=>{submithandler(e)}}>
          <h3 className="text-xl font-medium mb-2">What's your email</h3>
          <input
            className="border bg-[#eeeeee] px-4 py-2 rounded-md w-full text-lg placeholder:text-base mb-5  "
            required
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="email@example.com"
          />
          <h3 className="text-xl font-medium mb-2">Enter password</h3>
          <input
            className="border bg-[#eeeeee] px-4 py-2 rounded-md w-full text-lg placeholder:text-base mb-5"
            required
            autoComplete="off"
            value={password}
          
            onChange={(e) => setPassword(e.target.value)} 
            type="password"
            placeholder="password"
          />
          <button
            className="bg-[#111] text-white font-semibold px-4 py-2 rounded-md w-full  mb-2"
            type="submit"
          >
            Login
          </button>
        </form>
       <p className='text-center text-sm'>Don't have an account? <Link to='/signup' className='text-blue-400 font-semibold'>Sign up</Link></p>
      </div>

     
      <div>
        <Link to='/captain-login' className="flex items-center justify-center bg-[#2e2f2c] text-white font-semibold px-4 py-2 rounded-md w-full  mb-5">
          Login as Captain
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;
