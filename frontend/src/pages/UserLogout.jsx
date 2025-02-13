import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const UserLogout = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
 
        try {
                axios.get(`${import.meta.env.VITE_BASE_URL}/api/user/logout`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                console.log(response.data);
                localStorage.removeItem('token');
                
                navigate('/login');
            });
           
        } catch (error) {
            console.log(error);
        }
    
  return (
    <div>
      userLogout
    </div>
  )
}

export default UserLogout
