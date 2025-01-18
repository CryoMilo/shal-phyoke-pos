import { useEffect, useState } from "react";
import supabase from "../utils/supabase";

const Menu = () => {
	const [menu, setMenu] = useState([]);

	const getMenu = async () => {
		const { data, error } = await supabase.from("menu_item").select("*"); // Use select() instead of fetch()
		if (error) {
			console.error("Error fetching menu:", error.message);
			return;
		}
		setMenu(data);
	};

	useEffect(() => {
		getMenu();
	}, []);

	return (
		<ul>
			{menu.map((item) => (
				<li key={item.menu_id}>{item.menu_name}</li>
			))}
		</ul>
	);
};

export default Menu;
