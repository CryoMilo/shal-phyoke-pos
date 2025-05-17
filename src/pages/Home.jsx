import { useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { GiKnifeFork } from "react-icons/gi";
import { IoMdCart } from "react-icons/io";
import { MdInventory, MdTableBar } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const navItems = [
	{
		name: "Order",
		path: "/order",
		size: "col-span-3",
		logo: () => (
			<IoMdCart color="black" className="w-fit absolute right-10 size-[70%]" />
		),
	},
	{
		name: "Menu",
		path: "/menu",
		size: "col-span-3 md:col-span-1",
		logo: () => (
			<GiKnifeFork
				color="black"
				className="absolute w-fit right-10 bottom-6 size-[47%]"
			/>
		),
	},
	{
		name: "Table",
		path: "/table",
		size: "col-span-3 md:col-span-2",
		logo: () => (
			<MdTableBar
				color="black"
				className="absolute w-fit right-10 bottom-0 size-[67%]"
			/>
		),
	},
	{
		name: "Stock",
		path: "/stock",
		size: "col-span-3",
		logo: () => (
			<MdInventory
				color="black"
				className="absolute w-fit right-10 bottom-5 size-[50%]"
			/>
		),
	},
];

const Home = () => {
	const { session, signOutUser } = UserAuth();
	const [loading, setLoading] = useState();
	const navigate = useNavigate();

	const handleLogOut = async () => {
		setLoading(true);
		try {
			await signOutUser();

			alert("Logged Out");
		} catch (error) {
			alert("Error!", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className="absolute right-0 top-0 p-4">
				{session ? (
					<button onClick={() => handleLogOut()}>
						{loading
							? "Logging Out"
							: session.user.identities[0].identity_data.name || "Log Out"}
					</button>
				) : (
					<Link to="/auth/login">
						<button>Log In</button>
					</Link>
				)}
			</div>
			<section className="grid place-items-center h-screen">
				<nav className="w-[80%] lg:w-[60%] h-[60%] grid grid-cols-3 gap-4">
					{navItems.map(({ name, path, size, logo }) => (
						<div
							onClick={() => navigate(path)}
							key={name}
							className={`cursor-pointer bg-[#eeeeee] shadow-xl rounded-lg p-4 relative ${size}`}>
							<h2 className="text-2xl text-black">{name}</h2>
							{logo && logo()}
						</div>
					))}
				</nav>
			</section>
		</>
	);
};

export default Home;
