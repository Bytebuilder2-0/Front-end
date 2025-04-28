import React, { createContext, useState, useEffect } from 'react';

// 1. Create the Context
export const AuthContext = createContext();

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 3. Load user from localStorage when app starts
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      setUser({ token, role });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};









// import { createContext, useReducer } from "react";

// export const AuthContext = createContext();
// export const authReducer = (state, action) => {
//     switch (action.type) {  //destructure action type
//         case "LOGIN":
//             return { user: action.payload };
//         case "LOGOUT":
//             return { user: null };
//         default:
//             return state;
//     }
// };
// export const AuthContextProvider = ({ children }) => {
//     const [state, dispatch] = useReducer(authReducer,{user:null}) 

//     console.log("AuthContext state:", state); // Log the state to see its structure
//     return(
//         <AuthContext.Provider value={{ ...state, dispatch }}>
//             {children}
//         </AuthContext.Provider>
//     )
// }