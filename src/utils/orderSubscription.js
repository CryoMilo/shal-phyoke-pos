import supabase from "./supabase";

export const subscribeToOrders = (setOrders) => {
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
		.on(
			"postgres_changes",
			{ event: "INSERT", schema: "public", table: "order" },
			(payload) => {
				setOrders((prevOrders) => [...prevOrders, payload.new]);
			}
		)
		.on(
			"postgres_changes",
			{ event: "DELETE", schema: "public", table: "order" },
			(payload) => {
				setOrders((prevOrders) =>
					prevOrders.filter((order) => order.id !== payload.old.id)
				);
			}
		)
		.subscribe();

	return () => {
		supabase.removeChannel(subscription);
	};
};
