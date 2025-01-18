import { Link } from "react-router-dom";

const Navbar = () => {
	return (
		<nav className="flex justify-center space-x-4 gap-20 p-4 bg-gray-200">
			<Link to="/home" className="text-blue-600">
				Home
			</Link>
			<Link to="/menu" className="text-blue-600">
				Menu
			</Link>
			<Link to="/order" className="text-blue-600">
				Order
			</Link>
		</nav>
	);
};

export default Navbar;
