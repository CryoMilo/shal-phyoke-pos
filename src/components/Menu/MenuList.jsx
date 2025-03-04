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
		<div className="mx-10">
			<div className="flex gap-3 justify-between items-center py-6">
				<FaChevronLeft
					color="white"
					cursor="pointer"
					size={22}
					onClick={() => navigate("/")}
				/>
				<button>
					<Link to="/menu/create">Create Menu</Link>
				</button>
			</div>
			<ul className="flex flex-wrap flex-row gap-8 justify-evenly items-center">
				{menu.map((item) => (
					<React.Fragment key={item.menu_id}>
						<MenuCard item={item} />
					</React.Fragment>
				))}
			</ul>
		</div>
	);
};

export default MenuList;
