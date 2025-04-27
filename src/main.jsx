import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './routes/router'; // Importing the router 
import App from './App'; // Importing the main App component
import { AuthContextProvider } from './context/AuthContext'; // Importing the AuthContextProvider
import ReactDOM from 'react-dom/client'; // Importing ReactDOM for rendering

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <App></App>
    </AuthContextProvider>
  </StrictMode>
);
