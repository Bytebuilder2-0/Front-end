import { useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useAuthContext } from "../hooks/useAuthContext"; // Importing the custom hook

export const useSignup = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext(); // Accessing the dispatch function from AuthContext

    const signup = async (email, fullName, userName, phone, password, confirmPassword, role) => {
       setIsLoading(true);
       setError(null);

       const response = await fetch('http://localhost:4880/api/auth/register', {
           method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({email, fullName, userName, phone, password, confirmPassword, role})
       })
       const json = await response.json();
       if (!response.ok) {
           setIsLoading(false);
           setError(json.error);
       }
       if (response.ok) {
           // save the user to local storage
           localStorage.setItem('user', JSON.stringify(json));
           // update the auth context
           dispatch({ type: 'LOGIN', payload: json });
           setIsLoading(false);
       }
} 
    
        return { signup, error, isLoading };  
}