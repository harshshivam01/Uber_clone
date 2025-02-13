import React, { createContext, useState } from "react";

// Create the context
export const UserDataContext = createContext();

// Corrected component name (PascalCase)
export const UserContext = ({ children }) => {
  const [userData, setUserData] = useState({
    email: "",
    fullname: {
      firstname: "",
      lastname: "",
    },
  });

  return (
    <UserDataContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserDataContext.Provider>
  );
};
