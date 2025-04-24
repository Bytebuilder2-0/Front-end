import { createBrowserRouter } from 'react-router-dom';
import SupervisorDashboard from '../pages/supervisor/SupervisorDashboard';
import SupInitial from '../pages/supervisor/SupInitial';
import Inprogress from '../pages/supervisor/Inprogress';
import TechnicianDashboard from '../pages/Technician/TechnicianDashboard';
import TechnicianDeclined from '../pages/Technician/TechnicianDeclined'
import CompletedSuper from '../pages/supervisor/CompletedSuper';
import AppointmentSubmit from '../pages/User/AppoinmentSubmit';
import AppointmentView from '../pages/User/AppointmentView';
import UserDashboard from '../pages/User/UserDashboard';

import FeedbackPage from "../pages/Manager/FeedbackPage";
import ManageServices from '../pages/Manager/ManageServices';


import TechnicianCompleted from '../pages/Technician/TechnicianCompleted';




const router = createBrowserRouter([
  {
    path: "/Super",
    element: <SupervisorDashboard />,
  },
  {
    path: "/SInitial",
    element: <SupInitial />,
  },
  {
    path: "/SInpro",
    element: <Inprogress />,
  },
  {
    path: "/SCompleted",
    element: <CompletedSuper/>,
  },
  {
    path: "/TDashboard",
    element: <TechnicianDashboard />,
  },
  {
    path: "/TDeclined",
    element: <TechnicianDeclined />,
  },
  {
    path: "/TCompleted",
    element: <TechnicianCompleted />,
  },
  {
    path: '/appointments/new',
    element: <AppointmentSubmit />,
  },
 {
  path: "/appointments/:id", 
  element: <AppointmentView />
},
{
  path: "/User",
  element: <UserDashboard />
},{
  path: "/feedback",
  element: <FeedbackPage />,
  

},
{
      path: "/ManageServices",
      element: <ManageServices/>,
    } 

]);

export default router;
