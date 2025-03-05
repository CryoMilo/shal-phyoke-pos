/* eslint-disable react/prop-types */

import { useNavigate } from "react-router-dom";

const MenuCard = ({ item }) => {
	const navigate = useNavigate();
	return (
		<div
			key={item.id}
			onClick={() => navigate(`/menu/edit/${item.id}`)}
			className="w-fit px-3 py-3 rounded-md border-2 border-secondary shadow-md cursor-pointer">
			<div className="w-40 h-40 rounded-md overflow-hidden">
				<img src={item.image} alt="image" className="w-full h-full" />
			</div>
			<h5 className="font-semibold text-lg pt-2">{item.menu_name}</h5>
			<p className="text-gray-500">Price: {item.price.toFixed(2)}</p>
		</div>
	);
};

export default MenuCard;
