import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";
import { subscribeToOrders } from "../utils/orderSubscription";
import OrderCard from "../components/Order/OrderCard";
import { FaChevronLeft } from "react-icons/fa";

const UserOrder = () => {
	const navigate = useNavigate();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	const deviceId = localStorage.getItem("deviceId");

	const fetchOrders = async () => {
		let query = supabase
			.from("order")
			.select("*, table:table_id(*)")
			.order("created_at", { ascending: true });

		query = query.eq("device_id", deviceId);

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
	}, []);

	return (
		<div className="p-6">
			<div className="py-4 flex items-center">
				<FaChevronLeft
					cursor="pointer"
					size={22}
					onClick={() => navigate("/")}
					className="text-secondary"
				/>
				<h2 className="text-2xl text-center flex-grow">Your Orders</h2>
				<Link to="/user/order/create">
					<button>+</button>
				</Link>
			</div>

			{loading ? (
				<p>Loading orders...</p>
			) : orders.length > 0 ? (
				<div className="flex flex-wrap p-6 gap-6">
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

export default UserOrder;
