import { Outlet, useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";

const ProtectedRoute = () => {
	const { session } = UserAuth();
	const navigate = useNavigate();

	if (!session) {
		navigate("/auth/login");
	}

	// Otherwise, render the requested route
	return <Outlet />;
};

export default ProtectedRoute;
