import { useStock } from "../../context/StockContext";
import { useState } from "react";

const ManageStock = () => {
	const { stock, updateQuantity, saveMultipleQuantities } = useStock();
	const [selectedItems, setSelectedItems] = useState(new Set());
	const [saving, setSaving] = useState(false);

	const toggleSelect = (id) => {
		setSelectedItems((prev) => {
			const newSet = new Set(prev);
			newSet.has(id) ? newSet.delete(id) : newSet.add(id);
			return newSet;
		});
	};

	const handleSave = async () => {
		setSaving(true);
		const itemsToSave = stock.filter((item) => selectedItems.has(item.id));
		await saveMultipleQuantities(itemsToSave);
		setSelectedItems(new Set()); // clear selections
		setSaving(false);
	};

	return (
		<div className="min-h-screen bg-primary text-secondary flex flex-col items-center p-6">
			<h1 className="text-3xl font-bold mb-8">Manage Stock</h1>

			<div className="w-full max-w-2xl space-y-4">
				{stock.map((item) => (
					<div
						key={item.id}
						className="flex items-center justify-between border border-secondary p-4 rounded-xl">
						<label className="flex items-center space-x-3">
							<input
								type="checkbox"
								checked={selectedItems.has(item.id)}
								onChange={() => toggleSelect(item.id)}
								className="form-checkbox h-5 w-5 text-secondary bg-primary border-secondary"
							/>
							<span className="text-lg font-medium">{item.name}</span>
						</label>

						<div className="flex items-center space-x-4">
							<button
								onClick={() => updateQuantity(item.id, -1)}
								className="bg-secondary text-primary px-3 py-1 rounded-full hover:bg-gray-200 transition">
								-
							</button>
							<span className="w-12 text-center">{item.quantity || 0}</span>
							<button
								onClick={() => updateQuantity(item.id, 1)}
								className="bg-white text-black px-3 py-1 rounded-full hover:bg-gray-200 transition">
								+
							</button>
						</div>
					</div>
				))}
			</div>

			{selectedItems.size > 0 && (
				<button
					onClick={handleSave}
					disabled={saving}
					className="mt-8 bg-white text-black px-6 py-2 rounded-xl font-semibold hover:bg-gray-300 transition">
					{saving ? "Saving..." : `Save ${selectedItems.size} Item(s)`}
				</button>
			)}
		</div>
	);
};

export default ManageStock;
