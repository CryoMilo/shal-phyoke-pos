import React, { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import SelectTableModal from "./SelectTableModal";
import PaymentModal from "./PaymentModal";
import { useNavigate, useParams } from "react-router-dom";
import { TbPaperBag } from "react-icons/tb";
import { IoIosAdd } from "react-icons/io";
import { FaChevronLeft } from "react-icons/fa";

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
		setPaymentMethod(data.payment_method);
		setIsPaid(data.paid);
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
				paid: isPaid,
				payment_method: paymentMethod,
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

	const getSelectedMenuPriceTotal = () => {
		return selectedMenu.reduce(
			(total, item) =>
				total +
				(item.price ?? 0) * (item.quantity + (item.takeawayQuantity ?? 0)),
			0
		);
	};

	const handleDeleteOrder = async () => {
		const confirmDelete = window.confirm(
			"Are you sure you want to delete this order?"
		);
		if (!confirmDelete) return;

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
		<div className="p-6">
			<div className="flex gap-3 items-center">
				<FaChevronLeft
					color="white"
					cursor="pointer"
					size={22}
					onClick={() => navigate("/order")}
				/>
				<h2 className="text-2xl">{isEdit ? "Edit" : "Create"} Your Order</h2>
			</div>
			<div className="grid grid-cols-5 w-full min-h-[80vh] gap-8 mt-6">
				<div className={`col-span-3 border-2 border-white p-8`}>
					<div className="flex flex-wrap gap-8">
						{menu.map((item) => (
							<div
								key={item.menu_id}
								className="cursor-pointer px-3 py-3 rounded-md border-2 border-white">
								<div className="border-2 border-white w-40 h-40 rounded-md">
									<img src={item.image} alt="image" className="w-full h-full" />
								</div>
								<h5 className="font-semibold text-lg pt-2">{item.menu_name}</h5>
								<p className="text-gray-300">Price: {item.price.toFixed(2)}</p>

								<div className="w-full flex flex-row gap-1 pt-3">
									<button
										onClick={() => handleMenuClick(item, true)}
										className="w-[40%] grid place-items-center px-0 py-2"
										type="button">
										<TbPaperBag />
									</button>
									<button
										className="w-[60%]  grid place-items-center px-0 py-2"
										type="button"
										onClick={() => handleMenuClick(item, false)}>
										<IoIosAdd />
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
				<div className="col-span-2 border-2 border-white p-6 relative">
					<button
						type="button"
						className="bg-white flex items-center gap-2 w-full justify-center mb-4"
						onClick={() => setIsTableModalOpen(true)}>
						<p className="text-black">
							{selectedTable?.table_name || "Choose Table"}
						</p>
						{selectedTable?.image_url ? (
							<div className="w-6 h-6">
								<img
									src={selectedTable?.image_url}
									alt="table_image"
									className="w-full h-full rounded-md"
								/>
							</div>
						) : null}
					</button>

					<div className="h-[86%] pb-20">
						<table className="w-full border-collapse border border-transparent text-left text-lg">
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
									<React.Fragment key={item.menu_id}>
										{/* Dine-in row (only if quantity > 0) */}
										{item.quantity > 0 && (
											<tr>
												<td className="border-t border-transparent px-4 py-2">
													{item.menu_name}
												</td>
												<td className="border-t border-transparent px-4 py-2">
													{item.quantity}
												</td>
												<td className="border-t border-transparent px-4 py-2">
													{(item.price ?? 0) * item.quantity}
												</td>

												<td className="border-t border-transparent px-4 py-2 text-red-500 cursor-pointer">
													<button onClick={() => handleRemoveItem(item, false)}>
														X
													</button>
												</td>
											</tr>
										)}

										{/* Takeaway row (only if takeawayQuantity > 0) */}
										{item.takeawayQuantity > 0 && (
											<tr>
												<td className="border-t border-transparent px-4 py-2 ">
													<div className="flex items-center gap-2 flex-wrap">
														<p>{item.menu_name}</p>
														<TbPaperBag
															className="inline"
															color="cyan"
															size={18}
														/>
													</div>
												</td>
												<td className="border-t border-transparent px-4 py-2">
													{item.takeawayQuantity}
												</td>
												<td className="border-t border-transparent px-4 py-2">
													{(item.price ?? 0) * item.takeawayQuantity}
												</td>

												<td className="border-t border-transparent px-4 py-2 text-red-500 cursor-pointer">
													<button onClick={() => handleRemoveItem(item, true)}>
														X
													</button>
												</td>
											</tr>
										)}
									</React.Fragment>
								))}
							</tbody>
						</table>
						<div className="border-b-2 border-white my-8"></div>
						<div className="flex justify-between px-16">
							<p>Total</p>
							<p>{getSelectedMenuPriceTotal()}</p>
						</div>
					</div>

					<div className="w-full h-20 border-t-2 border-white absolute bottom-0 px-4 left-0 flex justify-between items-center gap-4">
						{isEdit ? (
							<button
								type="submit"
								className="h-fit bg-red-500 text-black"
								onClick={() => handleDeleteOrder()}>
								Delete
							</button>
						) : (
							<div className="invisible"></div>
						)}
						<div className="flex items-center gap-4">
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
			</div>

			{isTableModalOpen && (
				<SelectTableModal
					setSelectedTable={setSelectedTable}
					onClose={() => setIsTableModalOpen(false)}
				/>
			)}

			{isPaymentModalOpen && (
				<PaymentModal
					paymentMethod={paymentMethod}
					setPaymentMethod={setPaymentMethod}
					setIsPaid={setIsPaid}
					onClose={() => setIsPaymentModalOpen(false)}
				/>
			)}
		</div>
	);
};

export default ManageOrder;
