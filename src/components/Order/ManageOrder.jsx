import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";

const ManageOrder = () => {
	const [menu, setMenu] = useState([]);
	const [table, setTable] = useState([]);
	const [selectedMenu, setSelectedMenu] = useState([]);
	const [selectedTable, setSelectedTable] = useState(null);
	const [paymentMethod, setPaymentMethod] = useState("");
	const [isPaid, setIsPaid] = useState(false);

	async function handleCreateOrder() {
		if (paymentMethod === "" || selectedMenu == []) {
			alert("INVALID FIELDS");
			return;
		}

		const { error } = await supabase.from("order").insert([
			{
				status: "making",
				paid: isPaid,
				payment_method: paymentMethod,
				table_id: selectedTable?.id || null,
				menu_items: selectedMenu,
			},
		]);

		if (error) {
			console.error("Error creating menu item:", error);
			alert("Failed to create menu item.");
		} else {
			alert("Menu item created successfully!");
		}
	}

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

	return (
		<div className="p-10">
			<h2>Create Your Order</h2>
			<div className="grid grid-cols-3 w-full min-h-[80vh] gap-8 mt-6">
				<div className="col-span-2 border-2 border-white p-8">
					<div className="grid grid-cols-4 gap-4">
						{menu.map((item) => (
							<div
								key={item.menu_id}
								className="cursor-pointer"
								onClick={() => handleMenuClick(item)}>
								{/* Image */}
								<div className="border-2 border-white w-32 h-32"></div>
								<h5 className="font-semibold text-lg pt-2">{item.menu_name}</h5>
								<p className="text-gray-300">Price: ${item.price.toFixed(2)}</p>
							</div>
						))}
					</div>
				</div>
				<ul className="border-2 border-white p-8 relative">
					{selectedMenu.map((item) => (
						<li key={item.menu_id}>
							{item.menu_name} x {item.quantity}
						</li>
					))}
					<div className="w-full h-20 border-t-2 border-white absolute bottom-0 left-0 grid grid-cols-2 place-items-center gap-4">
						<button className="" onClick={handleCreateOrder}>
							Choose Table
						</button>
						<button className="" onClick={handleCreateOrder}>
							Confirm
						</button>
					</div>
				</ul>
			</div>
		</div>
	);
};

export default ManageOrder;
