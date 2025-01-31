import { useState } from "react";
import supabase from "../../utils/supabase";

const CreateTable = () => {
	const [tableName, setTableName] = useState("");
	// const [occupied, setOccupied] = useState(false);

	async function handleCreateTable() {
		if (!tableName) {
			alert("Table name is required.");
			return;
		}

		const { error } = await supabase.from("table").insert([
			{
				table_name: tableName,
			},
		]);

		if (error) {
			console.error("Error creating table:", error);
			alert("Failed to create table.");
		} else {
			alert("Table created successfully!");
			setTableName("");
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
					Image:
					<input
						type="file"
						id="table_image"
						name="table_image"
						accept="image/png, image/jpeg"
					/>
				</label>
				<br />
				<button type="submit">Create</button>
			</form>
		</div>
	);
};

export default CreateTable;
