import { useState } from "react";
import supabase from "../../utils/supabase";

const ManageTable = () => {
	const [tableName, setTableName] = useState("");
	const [image, setImage] = useState(null); // Added image state

	async function handleCreateTable() {
		if (!tableName) {
			alert("Table name is required.");
			return;
		}

		// If there is an image, upload it
		let imageUrl = null;
		if (image) {
			// Upload image to Supabase Storage
			const fileExtension = image.name.split(".").pop();
			const fileName = `${tableName}-${Date.now()}.${fileExtension}`;
			const { data, error: uploadError } = await supabase.storage
				.from("table") // Changed bucket name to "table"
				.upload(fileName, image, { upsert: true });

			if (uploadError) {
				console.error("Error uploading image:", uploadError);
				alert("Failed to upload image.");
				return;
			}

			// Get the public URL of the uploaded image
			const {
				data: { publicUrl },
				error: urlError,
			} = supabase.storage.from("table").getPublicUrl(data.path);

			if (urlError) {
				console.error("Error getting image URL:", urlError);
				alert("Failed to get image URL.");
				return;
			}
			imageUrl = publicUrl;
		}

		// Insert table into the "table" table
		const { error } = await supabase.from("table").insert([
			{
				table_name: tableName,
				image_url: imageUrl, // Store the image URL in the "image" field
			},
		]);

		if (error) {
			console.error("Error creating table:", error);
			alert("Failed to create table.");
		} else {
			alert("Table created successfully!");
			setTableName("");
			setImage(null); // Reset the image state
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
						onChange={(e) => setImage(e.target.files[0])} // Set the selected image
					/>
				</label>
				<br />
				<button type="submit">Create</button>
			</form>
		</div>
	);
};

export default ManageTable;
