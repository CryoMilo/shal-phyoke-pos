import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";

const CreateOrder = () => {
	const [menu, setMenu] = useState([]);
	const [selectedMenu, setSelectedMenu] = useState([]);

	const getMenu = async () => {
		const { data, error } = await supabase.from("menu").select("*");
		if (error) {
			console.error("Error fetching menu:", error.message);
			return;
		}
		setMenu(data);
	};

	const getTable = async () => {
		const { data, error } = await supabase.from("table").select("*"); // Use select() instead of fetch()
		if (error) {
			console.error("Error fetching tables:", error.message);
			return;
		}
		setMenu(data);
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
				// Otherwise, add the item with a quantity of 1
				return [...prevSelectedMenu, { ...item, quantity: 1 }];
			}
		});
	};

	return (
		<div>
			<h2>Create Your Order</h2>
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
	);
};

export default CreateOrder;
