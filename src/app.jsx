import React from 'react'
import { RouterProvider } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';

import router from './routes/router'
function App() {
  return (

      <RouterProvider router={router}/>
   

  );
}
export default App;