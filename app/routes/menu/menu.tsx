import { useEffect, useState } from "react";
import type { MenuItem } from "~/types/supabase";
import supabase from "~/utils/supabase";

export function Menu() {
	const [menu, setMenu] = useState<MenuItem[]>([]);

	useEffect(() => {
		getMenu();
	}, []);

	async function getMenu() {
		const { data } = await supabase.from("menu_item").select("*");
		setMenu(data || []);
	}

	return (
		<div>
			Waassup How's Life My Bois
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
