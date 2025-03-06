import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { UserAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
	const { signUpNewUser } = UserAuth();
	const navigate = useNavigate();
	const [displayName, setDisplayName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSignUp = async (event) => {
		event.preventDefault();
		setLoading(true);
		try {
			const result = await signUpNewUser(email, password);

			if (result.success) {
				navigate("/");
			}
		} catch (error) {
			alert("Error!", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="flex items-center justify-center min-h-screen bg-primary">
			<div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-2xl">
				<h2 className="text-2xl font-bold text-center text-gray-900">
					Sign Up
				</h2>
				<form className="space-y-4" onSubmit={handleSignUp}>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Name
						</label>
						<input
							value={displayName}
							onChange={(e) => setDisplayName(e.target.value)}
							type="text"
							className="w-full text-primary px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none"
							placeholder="Enter your name"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Email
						</label>
						<input
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							type="email"
							className="w-full px-4 text-primary py-2 mt-1 border rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none"
							placeholder="Enter your email"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Password
						</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full text-primary px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none"
							placeholder="Create a password"
						/>
					</div>
					<button
						disabled={loading}
						type="submit"
						className="w-full px-4 py-2 font-bold text-white bg-black rounded-md hover:bg-gray-800">
						{loading ? "Signing Up..." : "Sign Up"}
					</button>
					<button
						type="button"
						className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-200">
						<FcGoogle className="text-xl" /> Sign up with Google
					</button>
				</form>
				<p className="text-center text-sm text-gray-600">
					Already have an account?{" "}
					<a
						href="/auth/login"
						className="text-gray-900 font-medium hover:underline">
						Log in
					</a>
				</p>
			</div>
		</section>
	);
};

export default SignUp;
