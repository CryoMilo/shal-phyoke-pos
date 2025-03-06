import { useState } from "react";
import Navbar from "../components/Navbar";
import { UserAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
	const { session, signOutUser } = UserAuth();
	const [loading, setLoading] = useState();
	const navigate = useNavigate();

	const handleLogOut = async () => {
		setLoading(true);
		try {
			const result = await signOutUser();

			if (result.success) {
				navigate("/auth/login");
			}
		} catch (error) {
			alert("Error!", error);
		} finally {
			setLoading(false);
		}
	};
	return (
		<>
			<div className="flex justify-end p-4">
				{session ? (
					<button onClick={() => handleLogOut()}>
						{loading ? "Logging Out" : "Log Out"}
					</button>
				) : (
					<Link to="/auth/login">
						<button>Log In</button>
					</Link>
				)}
			</div>
			<Navbar />
		</>
	);
};

export default Home;
