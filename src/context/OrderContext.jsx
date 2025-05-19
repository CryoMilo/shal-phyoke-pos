import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import supabase from "../utils/supabase";
import { useNavigate, useParams } from "react-router-dom";

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

// eslint-disable-next-line react/prop-types
export const OrderProvider = ({ children }) => {
	const { orderId } = useParams();
	const navigate = useNavigate();
	const isEdit = !!orderId;

	const [menu, setMenu] = useState([]);
	const [selectedTable, setSelectedTable] = useState(null);
	const [selectedMenu, setSelectedMenu] = useState([]);
	// const [isTableModalOpen, setIsTableModalOpen] = useState(false);
	const [orderStatus, setOrderStatus] = useState("unpaid");

	const getOrderData = async () => {
		const { data, error } = await supabase
			.from("order")
			.select("*, table:table_id(*)")
			.eq("id", orderId)
			.single();
		if (error) {
			console.error("Error fetching order:", error.message);
			return;
		}

		// Set fields based on fetched data
		setSelectedMenu(data.menu_items || []);
		setSelectedTable(data.table.id ? { id: data.table.id } : null);
		setOrderStatus(data.status || orderStatus);
		setSelectedTable(data.table);
	};

	async function handleCreateOrder() {
		if (selectedMenu.length === 0) {
			alert("INVALID FIELDS");
			return;
		}

		const { error } = await supabase.from("order").insert([
			{
				status: "unpaid",
				table_id: selectedTable?.id,
				menu_items: selectedMenu,
				payment_method: null,
			},
		]);

		if (selectedTable?.id) {
			const { error: tableError } = await supabase
				.from("table")
				.update({ occupied: true })
				.eq("id", selectedTable.id);

			if (tableError) {
				console.error("Error updating table status:", tableError);
				alert("Failed to update table status.");
				return;
			}
		}

		if (error) {
			console.error("Error creating menu item:", error);
			alert("Failed to create menu item.");
		} else {
			alert("Menu item created successfully!");
		}

		navigate("/order");
	}

	const handleUpdateOrder = async () => {
		if (selectedMenu.length === 0) {
			alert("INVALID FIELDS");
			return;
		}

		// Fetch current order data to check previous table assignment
		const { data: currentOrder, error: orderFetchError } = await supabase
			.from("order")
			.select("table_id")
			.eq("id", orderId)
			.single();

		if (orderFetchError) {
			console.error("Error fetching current order:", orderFetchError);
			alert("Failed to fetch current order.");
			return;
		}

		const previousTableId = currentOrder?.table_id;
		const newTableId = selectedTable?.id || null;

		// Update order details
		const { error } = await supabase
			.from("order")
			.update({
				status: orderStatus,
				table_id: newTableId,
				menu_items: selectedMenu,
			})
			.eq("id", orderId);

		if (error) {
			console.error("Error updating order:", error);
			alert("Failed to update order.");
			return;
		}

		// Update table occupancy status
		if (previousTableId && previousTableId !== newTableId) {
			// Free up the previous table
			await supabase
				.from("table")
				.update({ occupied: false })
				.eq("id", previousTableId);
		}

		if (newTableId) {
			// Mark new table as occupied
			await supabase
				.from("table")
				.update({ occupied: true })
				.eq("id", newTableId);
		}

		alert("Order updated successfully!");
		navigate("/order");
	};

	const getMenu = async () => {
		const { data, error } = await supabase.from("menu").select("*");
		if (error) {
			console.error("Error fetching menu:", error.message);
			return;
		}
		setMenu(data);
	};

	useEffect(() => {
		getMenu();
		getOrderData();
	}, []);

	const handleMenuClick = (item, isTakeaway = false) => {
		setSelectedMenu((prevSelectedMenu) => {
			const existingItem = prevSelectedMenu.find(
				(selectedItem) => selectedItem.menu_name === item.menu_name
			);

			if (existingItem) {
				return prevSelectedMenu.map((selectedItem) =>
					selectedItem.menu_name === item.menu_name
						? {
								...selectedItem,
								quantity: isTakeaway
									? selectedItem.quantity
									: selectedItem.quantity + 1, // Increment dine-in quantity
								takeawayQuantity: isTakeaway
									? (selectedItem.takeawayQuantity || 0) + 1
									: selectedItem.takeawayQuantity || 0, // Increment takeaway quantity
						  }
						: selectedItem
				);
			} else {
				return [
					...prevSelectedMenu,
					{
						...item,
						quantity: isTakeaway ? 0 : 1, // If takeaway, set dine-in quantity to 0
						takeawayQuantity: isTakeaway ? 1 : 0, // If dine-in, set takeawayQuantity to 0
					},
				];
			}
		});
	};

	const handleRemoveItem = (item, isTakeaway = false) => {
		setSelectedMenu((prevSelectedMenu) =>
			prevSelectedMenu
				.map((selectedItem) => {
					if (selectedItem.menu_name === item.menu_name) {
						// If removing takeaway, decrease takeawayQuantity
						if (isTakeaway) {
							return {
								...selectedItem,
								takeawayQuantity: Math.max(
									0,
									selectedItem.takeawayQuantity - 1
								),
							};
						}
						// Otherwise, decrease dine-in quantity
						return {
							...selectedItem,
							quantity: Math.max(0, selectedItem.quantity - 1),
						};
					}
					return selectedItem;
				})
				.filter(
					(selectedItem) =>
						selectedItem.quantity > 0 || selectedItem.takeawayQuantity > 0
				)
		);
	};

	const handleDeleteOrder = async () => {
		// Fetch current order data to check assigned table
		const { data: currentOrder, error: orderFetchError } = await supabase
			.from("order")
			.select("table_id")
			.eq("id", orderId)
			.single();

		if (orderFetchError) {
			console.error("Error fetching current order:", orderFetchError);
			alert("Failed to fetch current order.");
			return;
		}

		const tableId = currentOrder?.table_id;

		// Delete the order
		const { error: deleteError } = await supabase
			.from("order")
			.delete()
			.eq("id", orderId);

		if (deleteError) {
			console.error("Error deleting order:", deleteError);
			alert("Failed to delete order.");
			return;
		}

		// Free up the table if it was assigned
		if (tableId) {
			await supabase
				.from("table")
				.update({ occupied: false })
				.eq("id", tableId);
		}

		alert("Order deleted successfully!");
		navigate("/order");
	};

	return (
		<OrderContext.Provider
			value={{
				isEdit,
				menu,
				handleCreateOrder,
				handleUpdateOrder,
				handleMenuClick,
				handleRemoveItem,
				handleDeleteOrder,
			}}>
			{children}
		</OrderContext.Provider>
	);
};
