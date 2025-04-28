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

import FeedbackPage from '../pages/Manager/FeedbackPage';
import ManageServices from '../pages/Manager/ManageServices';
import ManagerHistoryPage from '../pages/Manager/HistoryPage';

import TechnicianCompleted from '../pages/Technician/TechnicianCompleted';
import { Login } from '@mui/icons-material'; 
import Loginpage from '../pages/Loginpage';
import SignupPage from '../pages/SignupPage';
import ManagerDashboardPage from '../pages/Manager/ManagerDashboardPage';

import VehicleForm from '../pages/VehicleForm';
import SignInVehicleContainer from '../container/container1';
import TechnicianInprogress from '../pages/Technician/TechnicianInprogress';
import Decline from '../pages/supervisor/Decline';
import History from '../pages/supervisor/History';


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
  },{
    path:"/SDeclined",
    element:<Decline/>

  },{
   path:"/SHistory",
   element:<History/>
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
    path:"/TInprogress",
    element:<TechnicianInprogress/>
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
},
{
  path: "/feedback",
  element: <FeedbackPage />,
},
{
  path: "/Loginpage",
  element: <Loginpage />,
},
{
  path: "/SignupPage",
  element: <SignupPage />,
},
{
  path: "/VehicleForm",
  element: <VehicleForm />,
},
{
  path: "/SignupVReg",
  element: <SignInVehicleContainer />,
},
{
      path: "/ManageServices",
      element: <ManageServices/>,
    },
{
      path: "/ManagerDashboard",
      element: <ManagerDashboardPage/>,
    }  ,
    {
      path: "/ManagerHistory",
      element: <ManagerHistoryPage/>,
    }  




]);

export default router;
