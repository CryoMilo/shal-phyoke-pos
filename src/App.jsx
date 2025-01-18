import { Link, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Menu from "./components/Menu";

function App() {
	return (
		<div>
			<nav className="flex justify-center space-x-4 p-4 bg-gray-200">
				<Link to="/" className="text-blue-600">
					Home
				</Link>
				<Link to="/menu" className="text-blue-600">
					About
				</Link>
			</nav>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/menu" element={<Menu />} />
			</Routes>
		</div>
	);
}

export default App;
