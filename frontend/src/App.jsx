import { Routes,Route } from "react-router-dom"
import UserLogin from "./pages/UserLogin"
import Home from "./pages/home"
import UserSignup from "./pages/UserSignup"
import CaptainSignup from "./pages/CaptainSignup"
import CaptainLogin from "./pages/CaptainLogin"
import Homee from "./pages/Homee"
import UserProtectedWrapper from "./pages/UserProtectedWrapper"
import UserLogout from "./pages/userLogout"
import CaptainProtectedWrapper from "./pages/CaptainProtectedWrapper"
import CaptainHome from "./pages/CaptainHome"
import CaptainLogout from "./pages/CaptainLogout"
import RiderPage from "./pages/RiderPage"
import CaptainRide from "./pages/CaptainRide"


function App() {
  return (
    <div >
       <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<UserLogin/>}/>
        <Route path='/signup' element={<UserSignup/>}/>
        <Route path='/captain-signup' element={<CaptainSignup/>}/>
        <Route path='/captain-login' element={<CaptainLogin/>}/>
        <Route path='/home' element={
        <UserProtectedWrapper>
        <Homee/>
        </UserProtectedWrapper>
        }/>
        <Route path='/user/logout' element={
        <UserProtectedWrapper>
         <UserLogout/>
        </UserProtectedWrapper>
        }/>
        <Route path='/captain-home' element={
        <CaptainProtectedWrapper>
        <CaptainHome/>
        </CaptainProtectedWrapper>
        }/>
     <Route path="/captain/logout" element={
          <CaptainProtectedWrapper>
            <CaptainLogout />
          </CaptainProtectedWrapper>
        }/>
        <Route path="/ridestarted" element={
          <UserProtectedWrapper>
            <RiderPage />
          </UserProtectedWrapper>
        }/>
        <Route path="/captain-ridestarted" element={
          <CaptainProtectedWrapper>
            <CaptainRide />
          </CaptainProtectedWrapper>
        }/>

       </Routes>
    </div>
  )
}

export default App
