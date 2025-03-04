import { useState } from "react";
import supabase from "../../utils/supabase";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ManageTable = () => {
	const navigate = useNavigate();
	const [tableName, setTableName] = useState("");
	const [image, setImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(
		"https://www.servli.com/cdn/shop/t/262/assets/fsr-placeholder.png?v=45093109498714503231652397781"
	);

	async function handleCreateTable() {
		if (!tableName) {
			alert("Table name is required.");
			return;
		}

		let imageUrl = null;
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

		const { error } = await supabase.from("table").insert([
			{
				table_name: tableName,
				image_url: imageUrl,
			},
		]);

		if (error) {
			console.error("Error creating table:", error);
			alert("Failed to create table.");
		} else {
			alert("Table created successfully!");
			setTableName("");
			setImage(null);
			setImagePreview(
				"https://www.servli.com/cdn/shop/t/262/assets/fsr-placeholder.png?v=45093109498714503231652397781"
			);
		}
	}

	return (
		<div className="flex justify-center items-center h-screen">
			<div className="absolute top-0 left-0 m-10">
				<FaChevronLeft
					color="white"
					cursor="pointer"
					size={22}
					onClick={() => navigate("/table")}
				/>
			</div>
			<div className="shadow-lg rounded-lg p-8 w-[50%] border border-gray-300">
				<h2 className="text-2xl font-bold mb-4 text-center">Create Table</h2>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleCreateTable();
					}}>
					<div className="grid grid-cols-2 place-items-center gap-8">
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
					<button
						type="submit"
						className="w-full bg-white text-black px-4 mt-4 rounded">
						Create
					</button>
				</form>
			</div>
		</div>
	);
};

export default ManageTable;
