import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Order from "./pages/Order";
import Table from "./pages/Table";
import ManageOrder from "./components/Order/ManageOrder";
import { ManageMenu } from "./components/Menu/ManageMenu";
import ManageTable from "./components/Table/ManageTable";

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
		path: "/menu/edit/:menuId",
		element: <ManageMenu isEdit />,
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
		element: <ManageTable />,
	},
	{
		path: "/table/edit/:tableId",
		element: <ManageTable isEdit />,
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
