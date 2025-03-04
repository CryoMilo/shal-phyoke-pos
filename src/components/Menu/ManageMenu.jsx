/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

export const ManageMenu = ({ isEdit }) => {
	const { menuId } = useParams();
	const navigate = useNavigate();
	const [menuName, setMenuName] = useState("");
	const [price, setPrice] = useState(0);
	const [description, setDescription] = useState("");
	const [image, setImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(
		"https://www.servli.com/cdn/shop/t/262/assets/fsr-placeholder.png?v=45093109498714503231652397781"
	);

	const getMenuData = async () => {
		console.log("MENU ID", menuId);
		const { data, error } = await supabase
			.from("menu")
			.select("*")
			.eq("id", menuId)
			.single();
		if (error) {
			console.error("Error fetching menu:", error.message);
			return;
		}

		setMenuName(data.menu_name);
		setPrice(data.price);
		setDescription(data.description);
		setImagePreview(data.image || imagePreview);
	};

	useEffect(() => {
		getMenuData();
	}, []);

	async function handleSaveMenuItem() {
		if (!menuName || price <= 0) {
			alert("Menu name and valid price are required.");
			return;
		}

		let imageUrl = imagePreview || null; // Use existing image if available
		if (image) {
			const fileExtension = image.name.split(".").pop();
			const fileName = `${menuName}-${Date.now()}.${fileExtension}`;
			const { data, error: uploadError } = await supabase.storage
				.from("menu")
				.upload(fileName, image, { upsert: true, public: true });

			if (uploadError) {
				console.error("Error uploading image:", uploadError);
				alert("Failed to upload image.");
				return;
			}

			const {
				data: { publicUrl },
				error: urlError,
			} = supabase.storage.from("menu").getPublicUrl(data.path);

			if (urlError) {
				console.error("Error getting image URL:", urlError);
				alert("Failed to get image URL.");
				return;
			}
			imageUrl = publicUrl;
		}

		if (isEdit) {
			// Update menu item
			const { error } = await supabase
				.from("menu")
				.update({
					menu_name: menuName,
					price,
					description,
					image: imageUrl,
				})
				.eq("id", menuId); // Use ID to update

			if (error) {
				console.error("Error updating menu item:", error);
				alert("Failed to update menu item.");
			} else {
				alert("Menu item updated successfully!");
				navigate("/menu");
			}
		} else {
			// Create new menu item
			const { error } = await supabase.from("menu").insert([
				{
					menu_name: menuName,
					price,
					description,
					image: imageUrl,
				},
			]);

			if (error) {
				console.error("Error creating menu item:", error);
				alert("Failed to create menu item.");
			} else {
				alert("Menu item created successfully!");
				setMenuName("");
				setPrice(0);
				setDescription("");
				setImage(null);
				setImagePreview(
					"https://www.servli.com/cdn/shop/t/262/assets/fsr-placeholder.png?v=45093109498714503231652397781"
				);
			}
		}
	}

	async function handleDeleteMenu() {
		const isConfirmed = window.confirm(
			"Are you sure you want to delete this menu item?"
		);
		if (!isConfirmed) return;

		const { error: deleteError } = await supabase
			.from("menu")
			.delete()
			.eq("id", menuId);

		if (deleteError) {
			console.error("Error deleting Menu:", deleteError);
			alert("Failed to delete menu.");
			return;
		}

		navigate("/menu");
	}

	return (
		<div className="flex justify-center items-center h-screen">
			<div className="absolute top-0 left-0 m-10">
				<FaChevronLeft
					color="white"
					cursor="pointer"
					size={22}
					onClick={() => navigate("/menu")}
				/>
			</div>
			<div className="shadow-lg rounded-lg p-8 w-[50%] border border-gray-300">
				<h2 className="text-2xl font-bold mb-4 text-center">
					{isEdit ? "Update Menu Item" : "Create Menu Item"}
				</h2>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleSaveMenuItem();
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
								<label className="block text-sm font-medium ">Menu Name</label>
								<input
									type="text"
									value={menuName}
									onChange={(e) => setMenuName(e.target.value)}
									required
									className="block p-2 mt-1 w-full border border-gray-400 rounded"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium ">Price</label>
								<input
									type="number"
									value={price}
									onChange={(e) => setPrice(parseFloat(e.target.value))}
									required
									className="block p-2 mt-1 w-full border border-gray-400 rounded"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium ">
									Description
								</label>
								<textarea
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									className="block p-2 mt-1 w-full border border-gray-400 rounded"></textarea>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div>
						<button
							type="submit"
							className="w-full bg-white text-black px-4 mt-4 rounded">
							{isEdit ? "Update" : "Create"}
						</button>
						{isEdit && (
							<button
								onClick={() => handleDeleteMenu()}
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
