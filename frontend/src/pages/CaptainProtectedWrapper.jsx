import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { CaptainDataContext } from '../context/CaptainContext';


const CaptainProtectedWrapper = ({children}) => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const {captainData,setCaptainData}=useContext(CaptainDataContext);
    useEffect(() => {
        if(!token){
            navigate('/captain-login')
        }
        axios.get(`${import.meta.env.VITE_BASE_URL}/api/captain/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            setCaptainData(response.data.captain);
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
            navigate('/captain-login');
        })
    },[token,navigate]);
  return (
    <div>
      {children}
    </div>
  )
}

export default CaptainProtectedWrapper
