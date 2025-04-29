import { useState } from "react";
import Navbar from "../components/Navbar";
import { UserAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {
	const { session, signOutUser } = UserAuth();
	const [loading, setLoading] = useState();

	const handleLogOut = async () => {
		setLoading(true);
		try {
			await signOutUser();

			alert("Logged Out");
		} catch (error) {
			alert("Error!", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className="absolute right-0 top-0 p-4">
				{session ? (
					<button onClick={() => handleLogOut()}>
						{loading
							? "Logging Out"
							: session.user.identities[0].identity_data.name || "Log Out"}
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
