import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";

const CreateOrder = () => {
	const [menu, setMenu] = useState([]);
	const [table, setTable] = useState([]);
	const [selectedMenu, setSelectedMenu] = useState([]);
	const [selectedTable, setSelectedTable] = useState(null);
	const [paymentMethod, setPaymentMethod] = useState(""); // For radio group
	const [isPaid, setIsPaid] = useState(false); // For the "Paid" checkbox
	const [isSubmitting, setIsSubmitting] = useState(false); // For form submission state

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

	useEffect(() => {
		getMenu();
		getTable();
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

	const handleTableClick = (item) => {
		setSelectedTable(item);
	};

	const handlePaymentChange = (event) => {
		setPaymentMethod(event.target.value);
	};

	const handlePaidChange = (event) => {
		setIsPaid(event.target.checked);
	};

	const handleSubmit = async () => {
		if (selectedMenu.length === 0 || !paymentMethod) {
			alert("Please complete all fields before submitting.");
			return;
		}

		setIsSubmitting(true);

		const orderData = {
			table_id: selectedTable.table_id,
			menu_items: selectedMenu.map(({ menu_id, quantity }) => ({
				menu_id,
				quantity,
			})),
			payment_method: paymentMethod,
			is_paid: isPaid,
			status: "making",
		};

		const { data, error } = await supabase.from("orders").insert([orderData]);
		console.log(data);

		if (error) {
			console.error("Error submitting order:", error.message);
			alert("Failed to submit the order. Please try again.");
		} else {
			alert("Order submitted successfully!");
			setSelectedMenu([]);
			setSelectedTable(null);
			setPaymentMethod("");
			setIsPaid(false);
		}

		setIsSubmitting(false);
	};

	return (
		<div>
			<h2 className="p-8">Create Your Order</h2>
			<div className="m-10">
				<div className="border border-white p-10">
					<h4 className="underline">Tables</h4>
					<ul>
						{table.map((item) => (
							<li
								className={`cursor-pointer ${
									selectedTable?.table_id === item.table_id ? "font-bold" : ""
								}`}
								onClick={() => handleTableClick(item)}
								key={item.table_id}>
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

			<div className="border-b-2 border-white my-10"></div>

			<div className="m-10">
				<h4 className="underline">Payment</h4>
				<div>
					<label htmlFor="cash">
						<input
							id="cash"
							type="radio"
							name="payment"
							value="Cash"
							checked={paymentMethod === "Cash"}
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
							value="QR"
							checked={paymentMethod === "QR"}
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
				<button
					className="mt-6 px-4 py-2 bg-blue-500 text-white"
					onClick={handleSubmit}
					disabled={isSubmitting}>
					{isSubmitting ? "Submitting..." : "Submit Order"}
				</button>
			</div>
		</div>
	);
};

export default CreateOrder;
