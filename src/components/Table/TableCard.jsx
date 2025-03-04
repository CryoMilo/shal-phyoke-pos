/* eslint-disable react/prop-types */
const TableCard = ({ item }) => {
	return (
		<div
			key={item.table_id}
			className="w-fit px-3 py-3 rounded-md border border-gray-400">
			<div className="border-2 bg-white border-white w-40 h-40 rounded-md overflow-hidden">
				<img src={item.image_url} alt="image" className="w-full h-full" />
			</div>
			<h5 className="font-semibold text-lg pt-2">{item.table_name}</h5>

			<div className="w-full flex flex-row gap-1 pt-3">
				{/* <button
			className="w-full bg-yellow-300 hover:bg-yellow-600 border-white text-black grid place-items-center px-0 py-2"
			type="button">
			<IoIosAdd size={23} />
		</button> */}
			</div>
		</div>
	);
};

export default TableCard;
