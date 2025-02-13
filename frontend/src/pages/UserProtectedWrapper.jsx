
import React, { useEffect } from 'react'
import  {useNavigate}  from 'react-router-dom'
import axios from 'axios';


const UserProtectedWrapper = ({children}) => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
  useEffect(() => { 
    if(!token){
        navigate('/login')
    }
    axios.get(`${import.meta.env.VITE_BASE_URL}/api/user/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        console.log(response.data);
    }).catch((error) => {
        console.log(error);
        navigate('/login'); 
})
  },[token,navigate]);
  
  return (
    <>
      {children}
    </>
  )
}

export default UserProtectedWrapper;
