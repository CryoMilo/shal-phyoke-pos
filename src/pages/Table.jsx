import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../utils/supabase";

const Table = () => {
	const [menu, setMenu] = useState([]);

	const getTable = async () => {
		const { data, error } = await supabase.from("table").select("*"); // Use select() instead of fetch()
		if (error) {
			console.error("Error fetching tables:", error.message);
			return;
		}
		setMenu(data);
	};

	useEffect(() => {
		getTable();
	}, []);

	return (
		<ul>
			{menu.map((item) => (
				<li key={item.table_id}>{item.table_name}</li>
			))}
			<Link to="/table/create">Create Table</Link>
		</ul>
	);
};

export default Table;
