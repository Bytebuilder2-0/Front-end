import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard';
import SupInitial from './pages/supervisor/SupInitial';
import Inprogress from './pages/supervisor/Inprogress';
import TechnicianDashboard from './pages/Technician/TechnicianDashboard';

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
      path:"/TDashboard",
      element:<TechnicianDashboard/>
    }
  ]
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)
