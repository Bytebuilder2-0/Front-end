import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const PrivateRoute = ({ children, allowedRoles }) => {
	const { user, loading } = useContext(AuthContext);

	if (loading) return null; // or a loader

	if (!user) {
		return <Navigate to="/Loginpage" replace />;
	}

	if (allowedRoles && !allowedRoles.includes(user.role)) {
		return <Navigate to="/unauthorized" replace />;
	}

	return children;
};

export default PrivateRoute;
