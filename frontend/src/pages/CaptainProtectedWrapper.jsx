import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const CaptainProtectedWrapper = ({children}) => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    useEffect(() => {
        if(!token){
            navigate('/captain-login')
        }
        axios.get(`${import.meta.env.VITE_BASE_URL}/api/captain/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
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
