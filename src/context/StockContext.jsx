import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../utils/supabase";

const StockContext = createContext();

export const useStock = () => useContext(StockContext);

// eslint-disable-next-line react/prop-types
export const StockProvider = ({ children }) => {
	const [stock, setStock] = useState([]);

	const getStockList = async () => {
		const { data, error } = await supabase.from("stock").select("*");
		if (error) {
			console.error("Error fetching Stock List:", error.message);
			return;
		}
		setStock(data);
	};

	useEffect(() => {
		getStockList();
	}, []);

	const updateQuantity = (id, delta) => {
		setStock((prevStock) =>
			prevStock.map((item) =>
				item.id === id
					? { ...item, quantity: Math.max(0, (item.quantity || 0) + delta) }
					: item
			)
		);
	};

	const saveQuantity = async (id, quantity) => {
		const { error } = await supabase
			.from("stock")
			.update({ quantity })
			.eq("id", id);
		if (error) {
			console.error("Error updating quantity:", error.message);
			return false;
		}
		return true;
	};

	const saveMultipleQuantities = async (items) => {
		if (!items.length) return;
		const updates = items.map(({ id, quantity }) => ({ id, quantity }));
		const { error } = await supabase
			.from("stock")
			.upsert(updates, { onConflict: "id" }); // uses upsert to batch update
		if (error) {
			console.error("Batch update error:", error.message);
		}
	};

	return (
		<StockContext.Provider
			value={{ stock, updateQuantity, saveQuantity, saveMultipleQuantities }}>
			{children}
		</StockContext.Provider>
	);
};
