import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../utils/supabase";
import { subscribeToOrders } from "../utils/orderSubscription";
import OrderCard from "../components/Order/OrderCard";

const Order = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showAll, setShowAll] = useState(false); // Track whether to show all orders

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
				<div className="grid grid-cols-3 p-6 gap-6">
					{orders.map((order) => (
						<OrderCard key={order.id} order={order} />
					))}
				</div>
			) : (
				<p>No orders found.</p>
			)}
		</div>
	);
};

export default Order;
