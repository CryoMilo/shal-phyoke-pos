import { GiKnifeFork } from "react-icons/gi";
import { IoMdCart } from "react-icons/io";
import { MdTableBar } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const navItems = [
	// {
	// 	name: "Home",
	// 	path: "/home",
	// 	size: "col-span-1",
	// 	logo: () => (
	// 		<MdHome className="absolute right-0 bottom-0" color="black" size={170} />
	// 	),
	// },
	{
		name: "Order",
		path: "/order",
		size: "col-span-3",
		logo: () => (
			<IoMdCart className="absolute right-10" color="black" size={170} />
		),
	},
	{
		name: "Menu",
		path: "/menu",
		size: "col-span-1",
		logo: () => (
			<GiKnifeFork
				className="absolute right-10 bottom-6"
				color="black"
				size={130}
			/>
		),
	},
	{
		name: "Table",
		path: "/table",
		size: "col-span-2",
		logo: () => (
			<MdTableBar
				className="absolute right-0 bottom-0"
				color="black"
				size={170}
			/>
		),
	},
];

const Navbar = () => {
	const navigate = useNavigate();

	return (
		<section className="grid place-items-center h-screen">
			<nav className="w-[60%] h-[60%] grid grid-cols-3 gap-4">
				{navItems.map(({ name, path, size, logo }) => (
					<div
						onClick={() => navigate(path)}
						key={name}
						className={`cursor-pointer bg-white rounded-lg p-4 relative ${size}`}>
						<h2 className="text-2xl text-black">{name}</h2>
						{logo && logo()}
					</div>
				))}
			</nav>
		</section>
	);
};

export default Navbar;
