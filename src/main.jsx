import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Order from "./pages/Order";
import Table from "./pages/Table";
import CreateTable from "./components/Table/create";
import EditTable from "./components/Table/edit";
import ManageOrder from "./components/Order/ManageOrder";
import { ManageMenu } from "./components/Menu/ManageMenu";

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
		element: <ManageMenu />,
	},
	{
		path: "/menu/edit",
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
		element: <ManageOrder isEdit />,
	},
	{
		path: "/table",
		element: <Table />,
	},
	{
		path: "/table/create",
		element: <CreateTable />,
	},
	{
		path: "/table/edit",
		element: <EditTable />,
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
