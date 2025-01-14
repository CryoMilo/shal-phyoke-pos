import { useEffect, useState } from "react";
import supabase from "../utils/supabase";

function App() {
	const [menu, setMenu] = useState([]);

	useEffect(() => {
		getCountries();
	}, []);

	async function getCountries() {
		const { data } = await supabase.from("menu_item").select();
		setMenu(data);
	}

	return (
		<div>
			Waassup
			<ul>
				{menu.map((item) => (
					<li key={item.menu_id}>{item.menu_name}</li>
				))}
			</ul>
		</div>
	);
}

export default App;
