import { createBrowserRouter } from "react-router-dom";

import HomePage from "../pages/Home";

import Loginpage from "../pages/Loginpage";
import SignupPage from "../pages/SignupPage";

import SignInVehicleContainer from "../container/container1";

import AppointmentSubmit from "../pages/User/AppoinmentSubmit";
import AppointmentView from "../pages/User/AppointmentView";
import UserDashboard from "../pages/User/UserDashboard";

import TechnicianAccepted from "../pages/Technician/TechnicianAccepted";
import TechnicianDashboard from "../pages/Technician/TechnicianDashboard";
import TechnicianDeclined from "../pages/Technician/TechnicianDeclined";
import TechnicianInprogress from "../pages/Technician/TechnicianInprogress";
import TechnicianCompleted from "../pages/Technician/TechnicianCompleted";

import SupervisorDashboard from "../pages/supervisor/SupervisorDashboard";
import SupInitial from "../pages/supervisor/SupInitial";
import Inprogress from "../pages/supervisor/Inprogress";
import Decline from "../pages/supervisor/Decline";
import History from "../pages/supervisor/History";
import CompletedSuper from "../pages/supervisor/CompletedSuper";

import FeedbackPage from "../pages/Manager/FeedbackPage";
import ManageServices from "../pages/Manager/ManageServices";
import ManagerHistoryPage from "../pages/Manager/HistoryPage";
import ManagerDashboardPage from "../pages/Manager/ManagerDashboardPage";
import CheckStatus from "../pages/Manager/CheckStatus";

import Layout from "../pages/supervisor/Layout";
import PrivateRoute from "../components/Atoms/PrivateRoute";
import Reports from "../pages/Manager/Report";

import VehicleRegister from "../pages/User/VehicleRegister";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />, // <-- Replace HomePage with your real Home component
  },
  {
    element: <Layout />, //  All below routes will share the MiniDrawer layout
    children: [
      {
        path: "/SInitial",
        element: (
          <PrivateRoute allowedRoles={["supervisor"]}>
            <SupInitial />
          </PrivateRoute>
        ),
      },
      {
        path: "/Super",
        element: (
          <PrivateRoute allowedRoles={["supervisor"]}>
            <SupervisorDashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/SInpro",
        element: (
          <PrivateRoute allowedRoles={["supervisor"]}>
            <Inprogress />
          </PrivateRoute>
        ),
      },
      {
        path: "/SCompleted",
        element: <CompletedSuper />,
      },
      {
        path: "/SDeclined",
        element: <Decline />,
      },
      {
        path: "/SHistory",
        element: <History />,
      },
    ],
  },
  {
    path: "/TDashboard",
    element: (
      <PrivateRoute allowedRoles={["technician"]}>
        <TechnicianDashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/TDeclined",
    element: (
      <PrivateRoute allowedRoles={["technician"]}>
        <TechnicianDeclined />
      </PrivateRoute>
    ),
  },
  {
    path: "/TCompleted",
    element: (
      <PrivateRoute allowedRoles={["technician"]}>
        <TechnicianCompleted />
      </PrivateRoute>
    ),
  },
  {
    path: "/TInprogress",
    element: (
      <PrivateRoute allowedRoles={["technician"]}>
        <TechnicianInprogress />
      </PrivateRoute>
    ),
  },
  {
    path: "/TAccepted",
    element: (
      <PrivateRoute allowedRoles={["technician"]}>
        <TechnicianAccepted />
      </PrivateRoute>
    ),
  },
  {
    path: "/appointments/new",
    element: <AppointmentSubmit />,
  },
  {
    path: "/appointments/:id",
    element: <AppointmentView />,
  },
  {
    path: "/User",
    element: <UserDashboard />,
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
    path: "/VehicleRegister",
    element: <VehicleRegister />,
  },
  {
    path: "/SignupVReg",
    element: <SignInVehicleContainer />,
  },
  {
    path: "/ManageServices",
    element: (
      <PrivateRoute allowedRoles={["manager"]}>
        <ManageServices />
      </PrivateRoute>
    ),
  },
  {
    path: "/ManagerDashboard",
    element: (
      <PrivateRoute allowedRoles={["manager"]}>
        <ManagerDashboardPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/ManagerHistory",
    element: (
      <PrivateRoute allowedRoles={["manager"]}>
        <ManagerHistoryPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/CheckStatus",
    element: (
      <PrivateRoute allowedRoles={["manager"]}>
        <CheckStatus />
      </PrivateRoute>
    ),
  },
  {
    path: "/Reports",
    element: (
      <PrivateRoute allowedRoles={["manager"]}>
        <Reports />
      </PrivateRoute>
    ),
  },
  ,
  {
    path: "/feedback",
    element: (
      <PrivateRoute allowedRoles={["manager"]}>
        <FeedbackPage />
      </PrivateRoute>
    ),
  },
]);

export default router;
