import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';




const CaptainLogout = () => {
     const token = localStorage.getItem('token');
        const navigate = useNavigate();
        useEffect(() => {
            const logoutCaptain = async () => {
              try {
                await axios.get(`${import.meta.env.VITE_BASE_URL}/api/captain/logout`, {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                });
                localStorage.removeItem('token');
                navigate('/captain-login');
              } catch (error) {
                console.error('Logout error:', error);
                navigate('/captain-login');
              }
            };
        
            logoutCaptain();
          }, [navigate, token]);
     
  return (
    <div>
      CaptainLogout
    </div>
  )
}

export default CaptainLogout
