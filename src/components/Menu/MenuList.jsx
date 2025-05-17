import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../../utils/supabase";
import MenuCard from "./MenuCard";
import { FaChevronLeft } from "react-icons/fa";

const MenuList = () => {
	const [menu, setMenu] = useState([]);
	const navigate = useNavigate();

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
	}, []);

	return (
		<section className="mx-10">
			<div className="grid gap-3 grid-cols-3 place-items-center py-6 mb-10">
				<FaChevronLeft
					cursor="pointer"
					size={22}
					onClick={() => navigate("/")}
					className="place-self-start mt-3 text-secondary"
				/>
				<h2 className="text-3xl">Menu</h2>
				<Link className="place-self-end" to="/menu/create">
					<button>Create Menu</button>
				</Link>
			</div>
			<ul className="flex flex-wrap justify-start gap-8">
				{menu.map((item) => (
					<React.Fragment key={item.menu_id}>
						<MenuCard item={item} />
					</React.Fragment>
				))}
			</ul>
		</section>
	);
};

export default MenuList;
