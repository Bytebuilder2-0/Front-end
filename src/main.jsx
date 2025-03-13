import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard';
import SupInitial from './pages/supervisor/SupInitial';
import Inprogress from './pages/supervisor/Inprogress';
import TechnicianDashboard from './pages/Technician/TechnicianDashboard';
import CompletedSuper from './pages/supervisor/CompletedSuper';
import AppointmentSubmit from './pages/User/AppoinmentSubmit';


const router=createBrowserRouter(
  [
    {
      path:"/Super",
      element:<SupervisorDashboard/>
    },{
      path:"/SInitial",
      element:<SupInitial/>
    },{
      path:"/SInpro",
      element:<Inprogress/>
    },{
      path:"/Scom",
      element:<CompletedSuper/>
    },{
      path:"/TDashboard",
      element:<TechnicianDashboard/>
    },
    {
      path: '/appointments/new', 
      element: <AppointmentSubmit />,
    }
   
  ]
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)
