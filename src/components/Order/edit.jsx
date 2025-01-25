import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import { useParams } from "react-router-dom";

const EditOrder = () => {
	const { orderId } = useParams();
	const [menu, setMenu] = useState([]);
	const [table, setTable] = useState([]);
	const [selectedMenu, setSelectedMenu] = useState([]);
	const [selectedTable, setSelectedTable] = useState("");
	const [paymentMethod, setPaymentMethod] = useState(null);
	const [isPaid, setIsPaid] = useState(false);

	useEffect(() => {
		getMenu();
		getTable();
		getOrderData();
	}, []);

	const getMenu = async () => {
		const { data, error } = await supabase.from("menu").select("*");
		if (error) {
			console.error("Error fetching menu:", error.message);
			return;
		}
		setMenu(data);
	};

	const getTable = async () => {
		const { data, error } = await supabase.from("table").select("*");
		if (error) {
			console.error("Error fetching tables:", error.message);
			return;
		}
		setTable(data);
	};

	const getOrderData = async () => {
		const { data, error } = await supabase
			.from("order")
			.select("*")
			.eq("id", orderId)
			.single();
		if (error) {
			console.error("Error fetching order:", error.message);
			return;
		}

		// Set fields based on fetched data
		setSelectedMenu(data.menu_items || []);
		setSelectedTable(data.table.id ? { id: data.table.id } : null);
		setPaymentMethod(data.payment_method || "");
		setIsPaid(data.paid || false);
	};

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

	const handleTableClick = (item) => {
		setSelectedTable(item);
	};

	const handlePaymentChange = (event) => {
		setPaymentMethod(event.target.value);
	};

	const handlePaidChange = (event) => {
		setIsPaid(event.target.checked);
	};

	const handleUpdateOrder = async () => {
		if (paymentMethod === "" || selectedMenu.length === 0) {
			alert("INVALID FIELDS");
			return;
		}

		const { error } = await supabase
			.from("order")
			.update({
				status: "making",
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
	};

	return (
		<div>
			<h2 className="p-8">Edit Your Order</h2>
			{/* Table Selection */}
			<div className="m-10">
				<div className="border border-white p-10">
					<h4 className="underline">Tables</h4>
					<ul>
						{table.map((item) => (
							<li
								key={item.id}
								className={`cursor-pointer ${
									selectedTable?.id === item.id ? "font-bold" : ""
								}`}
								onClick={() => handleTableClick(item)}>
								{item.table_name}
							</li>
						))}
					</ul>
				</div>
				<div className="border border-white p-10 my-5">
					<h4 className="underline">Selected Table</h4>
					{selectedTable ? (
						<p>{selectedTable.table_name}</p>
					) : (
						<p>No table selected</p>
					)}
				</div>
			</div>

			<div className="border-b-2 border-white my-10"></div>

			{/* Menu Selection */}
			<div className="m-10">
				<div className="border border-white p-10">
					<h4 className="underline">My Menu</h4>
					<ul>
						{menu.map((item) => (
							<li
								className="cursor-pointer"
								onClick={() => handleMenuClick(item)}
								key={item.menu_id}>
								{item.menu_name}
							</li>
						))}
					</ul>
				</div>
				<div className="border border-white p-10 my-5">
					<h4 className="underline">Selected Menu</h4>
					<ul>
						{selectedMenu.map((item) => (
							<li key={item.menu_id}>
								{item.menu_name} x {item.quantity}
							</li>
						))}
					</ul>
				</div>
			</div>

			{/* Payment Section */}
			<div className="m-10">
				<h4 className="underline">Payment</h4>
				<div>
					<label htmlFor="cash">
						<input
							id="cash"
							type="radio"
							name="payment"
							value="cash"
							checked={paymentMethod === "cash"}
							onChange={handlePaymentChange}
						/>
						Cash
					</label>
				</div>
				<div>
					<label htmlFor="qr">
						<input
							id="qr"
							type="radio"
							name="payment"
							value="qr"
							checked={paymentMethod === "qr"}
							onChange={handlePaymentChange}
						/>
						QR
					</label>
				</div>
				<div className="mt-4">
					<label htmlFor="paid">
						<input
							id="paid"
							type="checkbox"
							checked={isPaid}
							onChange={handlePaidChange}
						/>
						Paid
					</label>
				</div>
				<p className="mt-4">
					Selected Payment: {paymentMethod || "None"} <br />
					Payment Status: {isPaid ? "Paid" : "Unpaid"}
				</p>

				{/* Update Order Button */}
				<button className="mt-10" onClick={handleUpdateOrder}>
					Update Order
				</button>
			</div>
		</div>
	);
};

export default EditOrder;
