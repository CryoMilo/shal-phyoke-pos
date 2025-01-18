import { useEffect, useState } from "react";
import type { MenuItem } from "~/types/supabase";
import supabase from "~/utils/supabase";
import type { Route } from "./+types/menu._index";

export function Menu({ loaderData }: Route.ComponentProps) {
	console.log(loaderData);

	return (
		<div>
			Menu List
			{/* <ul>
				{menu.map((item) => (
					<li key={item.menu_id}>
						{item.menu_name} - {item.price}
					</li>
				))}
			</ul> */}
		</div>
	);
}
