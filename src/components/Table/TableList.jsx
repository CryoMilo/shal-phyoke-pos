import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../../utils/supabase";
import TableCard from "./TableCard";
import { FaChevronLeft } from "react-icons/fa";

const TableList = () => {
	const [table, setTable] = useState([]);
	const navigate = useNavigate();

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
	}, []);

	return (
		<div className="mx-10">
			<div className="grid gap-3 grid-cols-3 place-items-center py-6 mb-10">
				<FaChevronLeft
					color="white"
					cursor="pointer"
					size={22}
					onClick={() => navigate("/")}
					className="place-self-start mt-3"
				/>
				<h2 className="text-3xl">Tables</h2>
				<button className="place-self-end">
					<Link to="/table/create">Create Table</Link>
				</button>
			</div>
			<ul className="grid grid-cols-5 place-items-center gap-8">
				{table.map((item) => (
					<React.Fragment key={item.table_id}>
						<TableCard item={item} />
					</React.Fragment>
				))}
			</ul>
		</div>
	);
};

export default TableList;
