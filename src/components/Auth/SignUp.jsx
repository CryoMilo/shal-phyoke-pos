import { FcGoogle } from "react-icons/fc";

const SignUp = () => {
	return (
		<section className="flex items-center justify-center min-h-screen bg-primary">
			<div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-2xl">
				<h2 className="text-2xl font-bold text-center text-gray-900">
					Sign Up
				</h2>
				<form className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Name
						</label>
						<input
							type="text"
							className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none"
							placeholder="Enter your name"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Email
						</label>
						<input
							type="email"
							className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none"
							placeholder="Enter your email"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Password
						</label>
						<input
							type="password"
							className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none"
							placeholder="Create a password"
						/>
					</div>
					<button
						type="submit"
						className="w-full px-4 py-2 font-bold text-white bg-black rounded-md hover:bg-gray-800">
						Sign Up
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
