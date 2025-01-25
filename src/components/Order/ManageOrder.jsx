import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import SelectTableModal from "./SelectTableModal";
import PaymentModal from "./PaymentModal";
import { useNavigate, useParams } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const ManageOrder = ({ isEdit }) => {
	const { orderId } = useParams();
	const navigate = useNavigate();
	const [menu, setMenu] = useState([]);
	const [selectedTable, setSelectedTable] = useState(null);
	const [selectedMenu, setSelectedMenu] = useState([]);
	const [paymentMethod, setPaymentMethod] = useState(null);
	const [isPaid, setIsPaid] = useState(false);
	const [isTableModalOpen, setIsTableModalOpen] = useState(false);
	const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
	const [orderStatus, setOrderStatus] = useState("making");

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
		setPaymentMethod(data.payment_method || null);
		setIsPaid(data.paid || false);
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
				status: "making",
				paid: isPaid,
				payment_method: paymentMethod !== null ? paymentMethod : null,
				table_id: selectedTable?.id,
				menu_items: selectedMenu,
			},
		]);

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

		const { error } = await supabase
			.from("order")
			.update({
				status: orderStatus,
				paid: isPaid,
				payment_method: paymentMethod,
				table_id: selectedTable?.id || null,
				menu_items: selectedMenu,
			})
			.eq("id", orderId);

		if (error) {
			console.error("Error updating order:", error);
			alert("Failed to update order.");
		} else {
			alert("Order updated successfully!");
		}

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

	const handleMenuClick = (item) => {
		setSelectedMenu((prevSelectedMenu) => {
			const existingItem = prevSelectedMenu.find(
				(selectedItem) => selectedItem.menu_name === item.menu_name
			);

			if (existingItem) {
				return prevSelectedMenu.map((selectedItem) =>
					selectedItem.menu_name === item.menu_name
						? { ...selectedItem, quantity: selectedItem.quantity + 1 }
						: selectedItem
				);
			} else {
				return [...prevSelectedMenu, { ...item, quantity: 1 }];
			}
		});
	};

	const handleRemoveItem = (item) => {
		setSelectedMenu((prevSelectedMenu) =>
			prevSelectedMenu
				.map((selectedItem) =>
					selectedItem.menu_name === item.menu_name
						? { ...selectedItem, quantity: selectedItem.quantity - 1 }
						: selectedItem
				)
				.filter((selectedItem) => selectedItem.quantity > 0)
		);
	};

	const getSelectedMenuPriceTotal = () => {
		return selectedMenu.reduce(
			(total, item) => total + item.price * item.quantity,
			0
		);
	};

	return (
		<div className="p-10">
			<h2>{isEdit ? "Edit" : "Order"} Your Order</h2>
			<div className="grid grid-cols-5 w-full min-h-[80vh] gap-8 mt-6">
				<div className="col-span-3 border-2 border-white p-8">
					<div className="flex flex-wrap gap-8">
						{menu.map((item) => (
							<div
								key={item.menu_id}
								className="cursor-pointer px-3 py-2 rounded-md border-2 border-white"
								onClick={() => handleMenuClick(item)}>
								<div className="border-2 border-white w-32 h-32 rounded-md"></div>
								<h5 className="font-semibold text-lg pt-2">{item.menu_name}</h5>
								<p className="text-gray-300">Price: ${item.price.toFixed(2)}</p>
							</div>
						))}
					</div>
				</div>
				<div className="col-span-2 border-2 border-white p-8 relative">
					<div className="flex justify-between items-center my-5">
						<button
							type="button"
							className=""
							onClick={() => setIsTableModalOpen(true)}>
							{selectedTable?.table_name || "Choose Table"}
						</button>
						{/* <button
							type="button"
							className=""
							onClick={() => setIsPaymentModalOpen(true)}>
							{paymentMethod || "Choose Payment"}
						</button> */}
					</div>
					<div className="h-[86%] overflow-y-auto">
						<table className="w-full border-collapse border border-transparent text-left">
							<thead>
								<tr>
									<th className="border-b border-transparent px-4 py-2">
										Menu
									</th>
									<th className="border-b border-transparent px-4 py-2">Qty</th>
									<th className="border-b border-transparent px-4 py-2">
										Price
									</th>
									<th
										className="border-b border-transparent px-4 py-2 cursor-pointer text-red-500"
										onClick={() => setSelectedMenu([])}>
										Clear
									</th>
								</tr>
							</thead>
							<tbody>
								{selectedMenu.map((item) => (
									<tr key={item.menu_id}>
										<td className="border-t border-transparent px-4 py-2">
											{item.menu_name}
										</td>
										<td className="border-t border-transparent px-4 py-2">
											{item.quantity}
										</td>
										<td className="border-t border-transparent px-4 py-2">
											{item.price * item.quantity}
										</td>
										<td className="border-t border-transparent px-4 py-2 text-red-500 cursor-pointer">
											<button onClick={() => handleRemoveItem(item)}>X</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						<div className="border-b-2 border-white my-8"></div>
						<div className="flex justify-between px-10">
							<p>Total</p>
							<p>{getSelectedMenuPriceTotal()}</p>
						</div>
					</div>

					<div className="w-full h-20 border-t-2 border-white absolute bottom-0 px-4 left-0 flex justify-end items-center gap-4">
						<button
							type="submit"
							className="h-fit"
							onClick={() => setIsPaymentModalOpen(true)}>
							{paymentMethod || "Payment"}
						</button>

						{isEdit ? (
							<button
								type="submit"
								className="h-fit"
								onClick={handleUpdateOrder}>
								Confirm
							</button>
						) : (
							<button
								type="submit"
								className="h-fit"
								onClick={handleCreateOrder}>
								Order
							</button>
						)}
					</div>
				</div>
			</div>

			{isTableModalOpen && (
				<SelectTableModal
					setSelectedTable={setSelectedTable}
					onClose={() => setIsTableModalOpen(false)}
				/>
			)}

			{isPaymentModalOpen && (
				<PaymentModal
					setPaymentMethod={setPaymentMethod}
					setIsPaid={setIsPaid}
					onClose={() => setIsPaymentModalOpen(false)}
				/>
			)}
		</div>
	);
};

export default ManageOrder;
