import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../utils/supabase";
import { formatTime } from "../utils/formatTime";

const Order = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	const handleUpdateOrder = async (orderId) => {
		const { error } = await supabase
			.from("order")
			.update({
				status: "completed",
			})
			.eq("id", orderId);

		if (error) {
			console.error("Error updating order:", error);
			alert("Failed to update order.");
		} else {
			alert("Order Completed Successfully!");
		}
	};

	useEffect(() => {
		const fetchOrders = async () => {
			const { data, error } = await supabase
				.from("order")
				.select("*, table:table_id(*)")
				.order("created_at", { ascending: false });

			if (error) {
				console.error("Error fetching orders:", error);
			} else {
				setOrders(data);
			}
			setLoading(false);
		};

		fetchOrders();
	}, []);

	return (
		<div>
			<h2>Order</h2>

			<div className="flex flex-col gap-3 my-9">
				<Link to="/order/create" className="text-blue-600">
					Create Order
				</Link>
			</div>

			{loading ? (
				<p>Loading orders...</p>
			) : orders.length > 0 ? (
				<table className="table-auto border-collapse border border-gray-200 w-full">
					<thead>
						<tr>
							<th className="border border-gray-200 px-4 py-2">Status</th>
							<th className="border border-gray-200 px-4 py-2">Paid</th>
							<th className="border border-gray-200 px-4 py-2">
								Payment Method
							</th>
							<th className="border border-gray-200 px-4 py-2">Table</th>
							<th className="border border-gray-200 px-4 py-2">Created At</th>
							<th className="border border-gray-200 px-4 py-2">Items</th>
							<th className="border border-gray-200 px-4 py-2">
								Action Buttons
							</th>
						</tr>
					</thead>
					<tbody className="text-center">
						{orders.map((order) => (
							<tr key={order.id}>
								<td className="border border-gray-200 px-4 py-2">
									{order.status}
								</td>
								<td className="border border-gray-200 px-4 py-2">
									{order.paid ? "Yes" : "No"}
								</td>
								<td className="border border-gray-200 px-4 py-2">
									{order.payment_method}
								</td>
								<td className="border border-gray-200 px-4 py-2">
									{order.table && order.table.table_name}
								</td>
								<td className="border border-gray-200 px-4 py-2">
									{formatTime(order.created_at)}
								</td>
								<td className="border border-gray-200 px-4 py-2">
									<ul>
										{order.menu_items.map((item) => {
											return (
												<li key={item.menu_id}>
													{item.menu_name} x {item.quantity}
												</li>
											);
										})}
									</ul>
								</td>
								<td className="border border-gray-200 px-4 py-2">
									<div className="flex flex-col gap-2">
										{order.status !== "completed" && (
											<button>
												<Link to={`/order/edit/${order.id}`}>Edit</Link>
											</button>
										)}
										{order.paid ? (
											order.status !== "completed" && (
												<button
													type="button"
													onClick={() => handleUpdateOrder(order.id)}
													className="bg-blue-400">
													Complete
												</button>
											)
										) : (
											<p>Unpaid</p>
										)}
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>No orders found.</p>
			)}
		</div>
	);
};

export default Order;
