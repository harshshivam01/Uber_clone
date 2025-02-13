import React from 'react'
import uberLogo from '../assets/uber-logo.svg'
import { Link } from 'react-router-dom'


const Home = () => {
  return (
    <div>
       <div className=' h-[80vh] w-full bg-cover bg-center bg-[url(https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_1380,w_1104/v1684852612/assets/ba/4947c1-b862-400e-9f00-668f4926a4a2/original/Ride-with-Uber.png)] flex flex-col  justify-start '>
       <img className='w-28'
       src={uberLogo} />
       </div>
       
       <div className='h-[20vh] justify-center  p-4'>  
       <h1 className='text-3xl font-bold justify-center '>Get Started with Uber </h1>
       <Link to='/login'className='bg-black text-white flex items-center justify-center mt-4 text-xl p-2 rounded-md'>Continue</Link>
       </div>
       


       
    </div>
  )
}

export default Home
