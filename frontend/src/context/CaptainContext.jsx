import React, { createContext, useState } from 'react'

export const CaptainDataContext = createContext();
export const CaptainContext = ({children}) => {
     const [captainData, setCaptainData] = useState({
        fullname:{
            firstname: '',
            lastname: ''
        },
        email: '',
        vehicle: {
            color: '',
            plate: '',
         
            vehicleType: ''
        }
     });
    
  return (

    <div>
    <CaptainDataContext.Provider value={{captainData, setCaptainData}}>
      {children}
    </CaptainDataContext.Provider>
    </div>
  )
}


