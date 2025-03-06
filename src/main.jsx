import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
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
import ProtectedRoute from "./components/Auth/ProtectedRoute"; // Import the ProtectedRoute component
import { AuthContextProvider } from "./context/AuthContext";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
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
		element: <ProtectedRoute />, // Wrap all protected routes
		children: [
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
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<AuthContextProvider>
			<RouterProvider router={router} />
		</AuthContextProvider>
	</React.StrictMode>
);
