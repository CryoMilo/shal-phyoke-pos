import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../utils/supabase";
import { formatTime } from "../utils/formatTime";
import { TbPaperBag } from "react-icons/tb";
import { subscribeToOrders } from "../utils/orderSubscription";

const Order = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showAll, setShowAll] = useState(false); // Track whether to show all orders

	const handleUpdateOrder = async (orderId, tableId) => {
		const { error } = await supabase
			.from("order")
			.update({ status: "completed" })
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
			}
		}
	};

	const fetchOrders = async () => {
		let query = supabase
			.from("order")
			.select("*, table:table_id(*)")
			.order("created_at", { ascending: true });

		if (!showAll) {
			query = query.neq("status", "completed"); // Exclude completed orders when showAll is false
		}

		const { data, error } = await query;
		if (error) {
			console.error("Error fetching orders:", error);
		} else {
			setOrders(data);
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchOrders();
		const unsubscribe = subscribeToOrders(setOrders);
		return () => unsubscribe();
	}, [showAll]); // Re-fetch orders when showAll changes

	return (
		<div className="p-6">
			<h2 className="text-3xl">Order</h2>

			<div className="flex justify-between py-6">
				<button onClick={() => setShowAll((prev) => !prev)}>
					{showAll ? "Show Pending" : "Show All"}
				</button>
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
							<th className="border border-gray-200 px-4 py-2">Paid</th>
							<th className="border border-gray-200 px-4 py-2">Payment</th>
							<th className="border border-gray-200 px-4 py-2">Table</th>
							<th className="border border-gray-200 px-4 py-2">Created At</th>
							<th className="border border-gray-200 px-4 py-2">Items</th>
							<th className="border border-gray-200 px-4 py-2">Action</th>
						</tr>
					</thead>
					<tbody className="text-center">
						{orders.map((order) => (
							<tr key={order.id}>
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
											{order?.table.image_url && (
												<div className="w-6 h-6">
													<img
														src={order?.table.image_url}
														alt="table_image"
														className="w-full h-full rounded-md"
													/>
												</div>
											)}
										</div>
									)}
								</td>
								<td className="border border-gray-200 px-4 py-2">
									{formatTime(order.created_at)}
								</td>
								<td className="border border-gray-200 px-4 py-2">
									<ul>
										{order.menu_items.map((item) => (
											<React.Fragment key={item.menu_id}>
												{item.quantity > 0 && (
													<li>
														{item.menu_name} x {item.quantity}
													</li>
												)}
												{item.takeawayQuantity > 0 && (
													<li>
														<div className="flex justify-center items-center gap-2">
															<p>
																{item.menu_name} x {item.takeawayQuantity}{" "}
															</p>
															<TbPaperBag
																className="inline"
																color="cyan"
																size={18}
															/>
														</div>
													</li>
												)}
											</React.Fragment>
										))}
									</ul>
								</td>
								<td className="border border-gray-200 px-4 py-2">
									<div className="flex flex-col gap-2">
										{!order.paid && (
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
