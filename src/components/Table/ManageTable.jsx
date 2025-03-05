/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const ManageTable = ({ isEdit }) => {
	const { tableId } = useParams();
	const navigate = useNavigate();
	const [tableName, setTableName] = useState("");
	const [image, setImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(
		"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSso3UnUk-s9hmwHsAq4c5NlH_GosN1x2Jrvw&s"
	);

	// Fetch table data if editing
	const getTableData = async () => {
		if (!isEdit) return;

		const { data, error } = await supabase
			.from("table")
			.select("*")
			.eq("id", tableId)
			.single();
		if (error) {
			console.error("Error fetching table:", error.message);
			return;
		}

		setTableName(data.table_name);
		setImagePreview(data.image_url || imagePreview);
	};

	useEffect(() => {
		getTableData();
	}, []);

	async function handleSaveTable() {
		if (!tableName) {
			alert("Table name is required.");
			return;
		}

		let imageUrl = imagePreview || null;
		if (image) {
			const fileExtension = image.name.split(".").pop();
			const fileName = `${tableName}-${Date.now()}.${fileExtension}`;
			const { data, error: uploadError } = await supabase.storage
				.from("table")
				.upload(fileName, image, { upsert: true, public: true });

			if (uploadError) {
				console.error("Error uploading image:", uploadError);
				alert("Failed to upload image.");
				return;
			}

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

		if (isEdit) {
			// Update existing table
			const { error } = await supabase
				.from("table")
				.update({ table_name: tableName, image_url: imageUrl })
				.eq("id", tableId);

			if (error) {
				console.error("Error updating table:", error);
				alert("Failed to update table.");
			} else {
				alert("Table updated successfully!");
				navigate("/table");
			}
		} else {
			// Create new table
			const { error } = await supabase
				.from("table")
				.insert([{ table_name: tableName, image_url: imageUrl }]);

			if (error) {
				console.error("Error creating table:", error);
				alert("Failed to create table.");
			} else {
				alert("Table created successfully!");
				setTableName("");
				setImage(null);
				setImagePreview(
					"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSso3UnUk-s9hmwHsAq4c5NlH_GosN1x2Jrvw&s"
				);
			}
		}
	}

	async function handleDeleteTable() {
		const isConfirmed = window.confirm(
			"Are you sure you want to delete this table?"
		);
		if (!isConfirmed) return;

		const { error: deleteError } = await supabase
			.from("table")
			.delete()
			.eq("id", tableId);
		if (deleteError) {
			console.error("Error deleting table:", deleteError);
			alert("Failed to delete table.");
			return;
		}

		alert("Table deleted successfully!");
		navigate("/table");
	}

	return (
		<div className="flex justify-center items-center h-screen">
			<div className="absolute top-0 left-0 m-10">
				<FaChevronLeft
					cursor="pointer"
					size={22}
					onClick={() => navigate("/table")}
				/>
			</div>
			<div className="shadow-lg rounded-lg p-8 w-[50%] border border-gray-300">
				<h2 className="text-2xl font-bold mb-4 text-center">
					{isEdit ? "Update Table" : "Create Table"}
				</h2>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleSaveTable();
					}}>
					<div className="grid grid-cols-2 place-items-center gap-8">
						{/* Image Upload */}
						<div className="w-full">
							<div className="flex justify-center">
								<label htmlFor="imageUpload">
									<img
										src={imagePreview}
										alt="Preview"
										className="aspect-square object-cover border border-gray-400 rounded cursor-pointer"
									/>
								</label>
								<input
									id="imageUpload"
									type="file"
									accept="image/png, image/jpeg"
									onChange={(e) => {
										setImage(e.target.files[0]);
										setImagePreview(URL.createObjectURL(e.target.files[0]));
									}}
									className="hidden"
								/>
							</div>
						</div>

						{/* Text input */}
						<div className="w-full flex flex-col gap-2">
							<div>
								<label className="block text-sm font-medium">Table Name</label>
								<input
									type="text"
									value={tableName}
									onChange={(e) => setTableName(e.target.value)}
									required
									className="block p-2 mt-1 w-full border border-gray-400 rounded"
								/>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div>
						<button type="submit" className="w-full px-4 mt-4 rounded">
							{isEdit ? "Update" : "Create"}
						</button>
						{isEdit && (
							<button
								onClick={() => handleDeleteTable()}
								type="button"
								className="w-full bg-red-400 text-black px-4 mt-4 rounded">
								Delete
							</button>
						)}
					</div>
				</form>
			</div>
		</div>
	);
};

export default ManageTable;
