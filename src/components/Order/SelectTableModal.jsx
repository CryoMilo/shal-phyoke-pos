import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import { MdOutlineDoNotDisturbAlt } from "react-icons/md";

// eslint-disable-next-line react/prop-types
const SelectTableModal = ({ setSelectedTable, onClose }) => {
	const [table, setTable] = useState([]);
	const [loading, setLoading] = useState(true);

	const getTable = async () => {
		setLoading(true);
		const { data, error } = await supabase.from("table").select("*");
		if (error) {
			console.error("Error fetching tables:", error.message);
			setLoading(false);
			return;
		}
		setTable(data);
		setLoading(false);
	};

	useEffect(() => {
		getTable();
	}, []);

	const handleTableClick = (item) => {
		if (item?.occupied) return; // Prevent selecting occupied tables
		setSelectedTable(item);
		onClose();
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
			<div className="bg-primary rounded-lg p-6 w-[50%] shadow-lg">
				<h3 className="text-xl font-semibold mb-4">Select a Table</h3>
				<div className="w-full min-h-64">
					{loading ? (
						<p>Loading tables...</p>
					) : table.length > 0 ? (
						<div className="flex flex-wrap justify-center gap-8">
							<div
								onClick={() => handleTableClick(null)}
								className="flex flex-col cursor-pointer">
								<div className="w-16 h-16 grid place-items-center rounded-md border-2 border-secondary bg-white">
									<MdOutlineDoNotDisturbAlt color="black" size={40} />
								</div>
								<div className="w-16 text-center">None</div>
							</div>
							{table.map((item) => (
								<div
									key={item.table_id}
									onClick={() => handleTableClick(item)}
									className={`flex flex-col ${
										item.occupied ? "opacity-50 cursor-not-allowed" : ""
									}`}>
									<div
										className={`w-16 h-16 border-2 rounded-md ${
											item.occupied
												? "border-gray-500 bg-gray-700"
												: "border-secondary bg-white cursor-pointer"
										}`}>
										<img
											src={item.image_url}
											alt="table_image"
											className="w-full h-full"
										/>
									</div>

									<div
										className={`w-16 text-center ${
											item.occupied ? "text-gray-500" : "cursor-pointer"
										}`}>
										{item.table_name}
									</div>
								</div>
							))}
						</div>
					) : (
						<p>No tables available.</p>
					)}
				</div>
				<div className="mt-4 flex justify-end">
					<button className="px-4 py-2 rounded" onClick={onClose}>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default SelectTableModal;
