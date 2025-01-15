import { useState } from "react";
import supabase from "~/utils/supabase";

// Component to create a new menu item
function CreateMenuItem() {
	const [menuName, setMenuName] = useState("");
	const [price, setPrice] = useState(0);
	const [description, setDescription] = useState("");
	const [isVegan, setIsVegan] = useState(false);
	const [taste, setTaste] = useState("");

	async function handleCreateMenuItem() {
		if (!menuName || price <= 0) {
			alert("Menu name and valid price are required.");
			return;
		}

		const { error } = await supabase.from("menu_item").insert([
			{
				menu_name: menuName,
				price,
				description,
				is_vegan: isVegan,
				taste,
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
			setIsVegan(false);
			setTaste("");
		}
	}

	return (
		<div>
			<h2>Create Menu Item</h2>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleCreateMenuItem();
				}}>
				<label>
					Menu Name:
					<input
						type="text"
						value={menuName}
						onChange={(e) => setMenuName(e.target.value)}
						required
					/>
				</label>
				<br />
				<label>
					Price:
					<input
						type="number"
						value={price}
						onChange={(e) => setPrice(parseFloat(e.target.value))}
						required
					/>
				</label>
				<br />
				<label>
					Description:
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}></textarea>
				</label>
				<br />
				<label>
					Is Vegan:
					<input
						type="checkbox"
						checked={isVegan}
						onChange={(e) => setIsVegan(e.target.checked)}
					/>
				</label>
				<br />
				<label>
					Taste:
					<input
						type="text"
						value={taste}
						onChange={(e) => setTaste(e.target.value)}
					/>
				</label>
				<br />
				<button type="submit">Create</button>
			</form>
		</div>
	);
}

// Main Component
export default function Home() {
	return (
		<div>
			<h1>Shal-Phyoke-POS</h1>
			<CreateMenuItem />
		</div>
	);
}
