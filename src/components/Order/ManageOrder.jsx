import React, { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
// import SelectTableModal from "./SelectTableModal";
import { useNavigate, useParams } from "react-router-dom";
import { TbPaperBag } from "react-icons/tb";
import { IoIosAdd } from "react-icons/io";
import { FaChevronLeft, FaShoppingBasket } from "react-icons/fa";
import { getMenuPriceTotal } from "../../utils/getMenuPriceTotal";
import VoucherModal from "./VoucherModal";

const ManageOrder = () => {
	const { orderId } = useParams();
	const isEdit = !!orderId;

	const navigate = useNavigate();
	const [menu, setMenu] = useState([]);
	const [selectedTable, setSelectedTable] = useState(null);
	const [selectedMenu, setSelectedMenu] = useState([]);
	// const [isTableModalOpen, setIsTableModalOpen] = useState(false);
	const [isVoucherModalOpen, setVoucherModalOpen] = useState(false);
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

	return (
		<div className="p-6">
			<div className="flex gap-3 items-center justify-between">
				<div className="flex gap-3 items-center">
					<FaChevronLeft
						className="text-secondary"
						cursor="pointer"
						size={22}
						onClick={() => navigate("/order")}
					/>
					<h2 className="text-2xl">{isEdit ? "Edit" : "Create"} Your Order</h2>
				</div>
				<FaShoppingBasket
					className="md:invisible"
					cursor="pointer"
					size={22}
					onClick={() => setVoucherModalOpen(true)}
				/>
			</div>
			<div className="flex w-full gap-8 mt-6">
				<div className="p-4">
					<div className="flex flex-wrap justify-evenly gap-4">
						{menu.map((item) => (
							<div
								key={item.menu_id}
								className="w-fit px-3 py-3 rounded-md border border-gray-500">
								<div className="border-2 border-secondary w-28 h-28 md:w-40 md:h-40 rounded-md overflow-hidden">
									<img src={item.image} alt="image" className="w-full h-full" />
								</div>
								<h5 className="font-semibold text-lg pt-2">{item.menu_name}</h5>
								<p className="text-gray-400">Price: {item.price.toFixed(2)}</p>

								<div className="w-full flex flex-row gap-1 pt-3">
									<button
										onClick={() => handleMenuClick(item, false)}
										className="w-[60%] bg-yellow-300 text-black grid place-items-center px-0 py-2"
										type="button">
										<IoIosAdd size={23} />
									</button>
									<button
										className="w-[40%] border-secondary grid place-items-center px-0 py-2"
										type="button"
										onClick={() => handleMenuClick(item, true)}>
										<TbPaperBag />
									</button>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Voucher */}
				<div className="hidden md:block col-span-2 border-2 border-secondary rounded-lg p-6 relative">
					{/* <button
						type="button"
						className="bg-secondary flex items-center gap-2 w-full justify-center mb-4"
						onClick={() => setIsTableModalOpen(true)}>
						<p className="text-primary">
							{selectedTable?.table_name || "Select Table"}
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
					</button> */}

					<div className="h-[86%] pb-20">
						<table className="w-full border-collapse border border-transparent text-center text-lg">
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

												<td
													onClick={() => handleRemoveItem(item, false)}
													className="border-t border-transparent px-4 py-2 text-red-500 cursor-pointer">
													X
												</td>
											</tr>
										)}

										{/* Takeaway row (only if takeawayQuantity > 0) */}
										{item.takeawayQuantity > 0 && (
											<tr>
												<td className="border-t border-transparent px-4 py-2">
													<div className="flex items-center justify-center gap-2 flex-wrap">
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

												<td
													onClick={() => handleRemoveItem(item, true)}
													className="border-t border-transparent px-4 py-2 text-red-500 cursor-pointer">
													X
												</td>
											</tr>
										)}
									</React.Fragment>
								))}
							</tbody>
						</table>
						{selectedMenu.length == [] ? (
							<></>
						) : (
							<>
								<div className="border-b-2 border-secondary my-8"></div>
								<div className="flex justify-between px-16">
									<p>Total</p>
									<p>{getMenuPriceTotal(selectedMenu)}</p>
								</div>
							</>
						)}
					</div>

					<div className="w-full h-20 border-t-2 border-secondary absolute bottom-0 px-4 left-0 flex justify-between items-center gap-4">
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

			{isVoucherModalOpen && (
				<VoucherModal
					isEdit={isEdit}
					// setIsTableModalOpen={setIsTableModalOpen}
					setSelectedTable={setSelectedTable}
					selectedTable={selectedTable}
					setSelectedMenu={setSelectedMenu}
					selectedMenu={selectedMenu}
					handleRemoveItem={handleRemoveItem}
					handleCreateOrder={handleCreateOrder}
					handleUpdateOrder={handleUpdateOrder}
					handleDeleteOrder={handleDeleteOrder}
					onClose={() => setVoucherModalOpen(false)}
				/>
			)}

			{/* {isTableModalOpen && (
				<SelectTableModal
					setSelectedTable={setSelectedTable}
					onClose={() => setIsTableModalOpen(false)}
				/>
			)} */}
		</div>
	);
};

export default ManageOrder;
