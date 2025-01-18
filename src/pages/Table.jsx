import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import supabase from "../utils/supabase";

const CreateTable = () => {
	const [tableName, setTableName] = useState("");
	const [occupied, setOccupied] = useState(false);

	async function handleCreateTable() {
		if (!tableName) {
			alert("Table name is required.");
			return;
		}

		const tableId = uuidv4();

		const { error } = await supabase.from("tables").insert([
			{
				table_id: tableId,
				table_name: tableName,
				occupied,
			},
		]);

		if (error) {
			console.error("Error creating table:", error);
			alert("Failed to create table.");
		} else {
			alert("Table created successfully!");
			setTableName("");
			setOccupied(false);
		}
	}

	return (
		<div>
			<h2>Create Table</h2>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleCreateTable();
				}}>
				<label>
					Table Name:
					<input
						type="text"
						value={tableName}
						onChange={(e) => setTableName(e.target.value)}
						required
					/>
				</label>
				<br />
				<label>
					Occupied:
					<input
						type="checkbox"
						checked={occupied}
						onChange={(e) => setOccupied(e.target.checked)}
					/>
				</label>
				<br />
				<button type="submit">Create</button>
			</form>
		</div>
	);
};

export default CreateTable;
