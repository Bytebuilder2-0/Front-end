import { createBrowserRouter } from "react-router-dom";

import HomePage from "../pages/Home";

import Loginpage from "../pages/Loginpage";
import SignupPage from "../pages/SignupPage";

import VehicleForm from "../pages/VehicleForm";
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
				element: <SupervisorDashboard />,
			},
			{
				path: "/SInpro",
				element: <Inprogress />,
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
		path: "/TInprogress",
		element: <TechnicianInprogress />,
	},
	{
		path: "/TAccepted",
		element: <TechnicianAccepted />,
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
		path: "/VehicleForm",
		element: <VehicleForm />,
	},
	{
		path: "/SignupVReg",
		element: <SignInVehicleContainer />,
	},
	{
		path: "/ManageServices",
		element: <ManageServices />,
	},
	{
		path: "/ManagerDashboard",
		element: <ManagerDashboardPage />,
	},
	{
		path: "/ManagerHistory",
		element: <ManagerHistoryPage />,
	},
	{
		path: "/CheckStatus",
		element: <CheckStatus />,
	},
]);

export default router;
