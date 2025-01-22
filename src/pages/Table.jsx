import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../utils/supabase";

const Table = () => {
	const [table, setTable] = useState([]);

	const getTable = async () => {
		const { data, error } = await supabase.from("table").select("*"); // Use select() instead of fetch()
		if (error) {
			console.error("Error fetching tables:", error.message);
			return;
		}
		setTable(data);
	};

	useEffect(() => {
		getTable();
		console.log(table);
	}, []);

	return (
		<ul>
			{table.map((item) => (
				<li key={item.table_id}>{item.table_name}</li>
			))}
			<Link to="/table/create">Create Table</Link>
		</ul>
	);
};

export default Table;
