import React from "react";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast"; // ✅ Import this

import router from "./routes/router";

function App() {
	return (
		<AuthProvider>
			<Toaster position="top-center" reverseOrder={false} /> {/* ✅ Add this */}
			<RouterProvider router={router} />
		</AuthProvider>
	);
}

export default App;
