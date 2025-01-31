import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../utils/supabase";
import { formatTime } from "../utils/formatTime";

const Order = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	const handleUpdateOrder = async (orderId, tableId) => {
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

		if (tableId) {
			const { error: tableError } = await supabase
				.from("table")
				.update({ occupied: false })
				.eq("id", tableId);

			if (tableError) {
				console.error("Error updating table status:", tableError);
				alert("Order completed, but failed to update table status.");
				return;
			}
		}
	};

	useEffect(() => {
		const fetchOrders = async () => {
			const { data, error } = await supabase
				.from("order")
				.select("*, table:table_id(*)")
				.order("created_at", { ascending: true });

			if (error) {
				console.error("Error fetching orders:", error);
			} else {
				setOrders(data);
			}
			setLoading(false);
		};

		fetchOrders();
	}, []);

	useEffect(() => {
		const subscription = supabase
			.channel("orders")
			.on(
				"postgres_changes",
				{ event: "UPDATE", schema: "public", table: "order" },
				(payload) => {
					setOrders((prevOrders) =>
						prevOrders.map((order) =>
							order.id === payload.new.id ? { ...order, ...payload.new } : order
						)
					);
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(subscription);
		};
	}, []);

	return (
		<div className="p-6">
			<h2 className="text-3xl">Order</h2>

			<div className="flex justify-end py-6">
				<Link to="/order/create">
					<button className="bg-white text-black">Create Order</button>
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
							<th className="border border-gray-200 px-4 py-2">Payment</th>
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
									{order.table && (
										<div className="bg-white rounded-md flex items-center gap-2 justify-center mb-4">
											<p className="text-black">
												{order?.table.table_name || "Choose Table"}
											</p>
											{order?.table.image_url ? (
												<div className="w-6 h-6">
													<img
														src={order?.table.image_url}
														alt="table_image"
														className="w-full h-full rounded-md"
													/>
												</div>
											) : null}
										</div>
									)}
								</td>
								<td className="border border-gray-200 px-4 py-2">
									{formatTime(order.created_at)}
								</td>
								<td className="border border-gray-200 px-4 py-2">
									<ul>
										{order.menu_items.map((item) => (
											<li key={item.menu_id}>
												{item.menu_name} x {item.quantity}
												{item.takeawayQuantity > 0 && (
													<> | {item.takeawayQuantity} (take-away)</>
												)}
											</li>
										))}
									</ul>
								</td>
								<td className="border border-gray-200 px-4 py-2">
									<div className="flex flex-col gap-2">
										{order.status !== "completed" && (
											<Link to={`/order/edit/${order.id}`}>
												<button className="w-full">Edit</button>
											</Link>
										)}
										{order.paid ? (
											order.status !== "completed" && (
												<button
													type="button"
													onClick={() =>
														handleUpdateOrder(order.id, order.table_id)
													}
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
