import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";
import { subscribeToOrders } from "../utils/orderSubscription";
import OrderCard from "../components/Order/OrderCard";
import { FaChevronLeft } from "react-icons/fa";

const Order = () => {
	const navigate = useNavigate();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedFilter, setSelectedFilter] = useState("unpaid"); // Default: Show pending orders

	const fetchOrders = async () => {
		let query = supabase
			.from("order")
			.select("*, table:table_id(*)")
			.order("created_at", { ascending: true });

		// Apply filter based on selected option
		if (selectedFilter !== "all") {
			query = query.eq("status", selectedFilter);
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
	}, [selectedFilter]); // Re-fetch when filter changes

	return (
		<div className="p-6">
			<div className="grid gap-3 grid-cols-3 place-items-center py-4">
				<FaChevronLeft
					cursor="pointer"
					size={22}
					onClick={() => navigate("/")}
					className="place-self-start mt-3 text-secondary"
				/>
				<h2 className="text-3xl">Order</h2>
				<Link className="place-self-end" to="/order/create">
					<button>Create Order</button>
				</Link>
			</div>

			{/* Selector Bar */}
			<div className="flex justify-center gap-4 py-6">
				{["all", "paid", "unpaid", "completed"].map((status) => (
					<button
						key={status}
						className={`px-4 py-2 rounded-md transition-colors ${
							selectedFilter === status
								? "bg-secondary text-primary font-bold"
								: "bg-primary text-secondary"
						}`}
						onClick={() => setSelectedFilter(status)}>
						{status.charAt(0).toUpperCase() + status.slice(1)}
					</button>
				))}
			</div>

			{/* Order List */}
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
