import { useEffect, useState } from "react";
import supabase from "../utils/supabase";

function App() {
	const [menu, setMenu] = useState([]);

	useEffect(() => {
		getMenu();
	}, []);

	async function getMenu() {
		const { data } = await supabase.from("menu_item").select();
		setMenu(data);
	}

	return (
		<div>
			Waassup
			<ul>
				{menu.map((item) => (
					<li key={item.menu_id}>
						{item.menu_name} - {item.price}
					</li>
				))}
			</ul>
		</div>
	);
}

export default App;
