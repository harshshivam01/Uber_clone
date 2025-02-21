
import React, { useContext, useEffect } from 'react'
import  {useNavigate}  from 'react-router-dom'
import axios from 'axios';
import { UserDataContext } from '../context/userContext';


const UserProtectedWrapper = ({children}) => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const {userData,setUserData}=useContext(UserDataContext);
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
        setUserData(response.data.user);
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
