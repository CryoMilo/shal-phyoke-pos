import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Menu from "./pages/Menu";
import Order from "./pages/Order";
import Table from "./pages/Table";
import ManageOrder from "./components/Order/ManageOrder";
import { ManageMenu } from "./components/Menu/ManageMenu";
import ManageTable from "./components/Table/ManageTable";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import ManageStock from "./components/Stock/ManageStock";
import { Providers } from "./context/Providers";
import Home from "./pages/Home";
import UserOrder from "./pages/UserOrder";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
	},
	{
		path: "/auth/login",
		element: <Login />,
	},
	{
		path: "/auth/sign-up",
		element: <SignUp />,
	},
	{
		path: "/auth/forgot-password",
		element: <ForgotPassword />,
	},
	{
		path: "/user/order",
		element: <UserOrder />,
	},
	{
		path: "/user/order/create",
		element: <ManageOrder />,
	},

	{
		element: <ProtectedRoute />,
		children: [
			{
				path: "/order",
				element: <Order />,
			},
			{
				path: "/order/create",
				element: <ManageOrder />,
			},
			{
				path: "/order/edit/:orderId",
				element: <ManageOrder />,
			},
			{
				path: "/menu",
				element: <Menu />,
			},
			{
				path: "/menu/create",
				element: <ManageMenu />,
			},
			{
				path: "/menu/edit/:menuId",
				element: <ManageMenu />,
			},
			{
				path: "/table",
				element: <Table />,
			},
			{
				path: "/table/create",
				element: <ManageTable />,
			},
			{
				path: "/table/edit/:tableId",
				element: <ManageTable />,
			},
			{
				path: "/stock",
				element: <ManageStock />,
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<Providers>
			<RouterProvider router={router} />
		</Providers>
	</React.StrictMode>
);
