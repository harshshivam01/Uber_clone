import { Link } from "react-router-dom";
import uberLogo from "../assets/uber-driver.svg";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CaptainContext";
const CaptainLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { captainData,setCaptainData } = useContext(CaptainDataContext);


  const submithandler = async(e) => {
    e.preventDefault();
 try{
   const newCaptain =({
      email: email,
      password: password,
    })
   
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/captain/login`,newCaptain)
    setCaptainData(response.data.newCaptain);
    console.log(newCaptain);
    console.log(response.data);
    localStorage.setItem('token',response.data.token);
    navigate('/captain-home');

  }catch{
    console.log('error');
  }finally{
    setEmail('')
    setPassword('')
  }
    
  }
  return (
    <div className="p-7 flex flex-col justify-between h-screen">
      <div>
        <img className="w-24 mb-2" src={uberLogo}></img>
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
       <p className='text-center text-sm'>Register as captain ? <Link to='/captain-signup' className='text-blue-400 font-semibold'>Sign up</Link></p>
      </div>

     
      <div>
        <Link to='/login' className="flex items-center justify-center bg-[#2e2f2c] text-white font-semibold px-4 py-2 rounded-md w-full  mb-5">
          Login as User
        </Link>
      </div>
    </div>
  );
};

export default CaptainLogin;
