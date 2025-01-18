import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import CreateMenu from "./components/Menu/create";
import EditMenu from "./components/Menu/edit";
import Order from "./pages/Order";
import CreateOrder from "./components/Order/create";
import EditOrder from "./components/Order/edit";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
	},
	{
		path: "/home",
		element: <Home />,
	},
	{
		path: "/menu",
		element: <Menu />,
	},
	{
		path: "/menu/create",
		element: <CreateMenu />,
	},
	{
		path: "/menu/edit",
		element: <EditMenu />,
	},
	{
		path: "/order",
		element: <Order />,
	},
	{
		path: "/order/create",
		element: <CreateOrder />,
	},
	{
		path: "/order/edit",
		element: <EditOrder />,
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
