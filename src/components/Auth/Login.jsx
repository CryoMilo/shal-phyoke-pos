import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import supabase from "../../utils/supabase";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import { headers } from "next/headers";

const Login = () => {
	const navigate = useNavigate();
	const headersList = headers();
	const hostname = headersList.get("x-forwarded-host");
	const { logInUser } = UserAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const handleLogin = async (event) => {
		event.preventDefault();
		setLoading(true);
		setErrorMessage("");

		try {
			const result = await logInUser({ email, password });

			if (result.success) {
				navigate("/");
			}
		} catch (error) {
			alert("Error!", error);
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleSignIn = async () => {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			redirect: `${hostname}/auth/callback`,
		});

		if (error) {
			setErrorMessage(error.message);
		}
	};

	return (
		<section className="flex items-center justify-center min-h-screen bg-primary">
			<div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-2xl">
				<h2 className="text-2xl font-bold text-center text-gray-900">
					Welcome to Shal Phyoke
				</h2>
				{errorMessage && (
					<p className="text-sm text-red-500 text-center">{errorMessage}</p>
				)}
				<form className="space-y-4" onSubmit={handleLogin}>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Email
						</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full text-primary px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none"
							placeholder="Enter your email"
							required
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
							placeholder="Enter your password"
							required
						/>
					</div>
					<button
						type="submit"
						className="w-full px-4 py-2 font-bold text-white bg-black rounded-md hover:bg-gray-800 disabled:opacity-50"
						disabled={loading}>
						{loading ? "Signing in..." : "Sign In"}
					</button>
					<button
						type="button"
						onClick={handleGoogleSignIn}
						className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-200">
						<FcGoogle className="text-xl" /> Sign in with Google
					</button>
				</form>
				<p className="text-center text-sm text-gray-600">
					Don&apos;t have an account?{" "}
					<a
						href="/auth/sign-up"
						className="text-gray-900 font-medium hover:underline">
						Sign up
					</a>
				</p>
			</div>
		</section>
	);
};

export default Login;
