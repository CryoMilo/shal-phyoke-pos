/* eslint-disable react/prop-types */
import { IoIosAdd } from "react-icons/io";

const MenuCard = ({ item }) => {
	return (
		<div
			key={item.menu_id}
			className="w-fit px-3 py-3 rounded-md border border-gray-400">
			<div className="border-2 border-white w-40 h-40 rounded-md overflow-hidden">
				<img src={item.image} alt="image" className="w-full h-full" />
			</div>
			<h5 className="font-semibold text-lg pt-2">{item.menu_name}</h5>
			<p className="text-gray-300">Price: {item.price.toFixed(2)}</p>

			<div className="w-full flex flex-row gap-1 pt-3">
				<button
					className="w-full bg-yellow-300 hover:bg-yellow-600 border-white text-black grid place-items-center px-0 py-2"
					type="button">
					<IoIosAdd size={23} />
				</button>
			</div>
		</div>
	);
};

export default MenuCard;
