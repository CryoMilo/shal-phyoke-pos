/* eslint-disable react/prop-types */
import { TbPaperBag } from "react-icons/tb";
import { getMenuPriceTotal } from "../../utils/getMenuPriceTotal";
import React from "react";
import { FaMinus } from "react-icons/fa";

const VoucherModal = ({
	onClose,
	isEdit,
	// selectedTable,
	setSelectedMenu,
	// setIsTableModalOpen,
	selectedMenu,
	handleRemoveItem,
	handleCreateOrder,
	handleUpdateOrder,
	handleDeleteOrder,
}) => {
	return (
		<div className="fixed inset-0 bg-opacity-50 z-50 m-10 border-2 border-secondary rounded-lg bg-primary">
			<div>
				<div className="flex justify-end">
					<div className="p-4 mb-4 border-2" onClick={() => onClose()}>
						<FaMinus />
					</div>
				</div>

				{/* <button
				type="button"
				className="bg-secondary flex items-center gap-2 w-full justify-center mb-4"
				onClick={() => setIsTableModalOpen(true)}>
				<p className="text-primary">
					{selectedTable?.table_name || "Select Table"}
				</p>
				{selectedTable?.image_url ? (
					<div className="w-6 h-6">
						<img
							src={selectedTable?.image_url}
							alt="table_image"
							className="w-full h-full rounded-md"
						/>
					</div>
				) : null}
			</button> */}

				<div className="h-[86%] pb-20">
					<table className="w-full border-collapse border border-transparent text-center text-lg">
						<thead>
							<tr>
								<th className="border-b border-transparent px-4 py-2">Menu</th>
								<th className="border-b border-transparent px-4 py-2">Qty</th>
								<th className="border-b border-transparent px-4 py-2">Price</th>

								<th
									className="border-b border-transparent px-4 py-2 cursor-pointer text-red-500"
									onClick={() => setSelectedMenu([])}>
									Clear
								</th>
							</tr>
						</thead>
						<tbody>
							{selectedMenu.map((item) => (
								<React.Fragment key={item.menu_id}>
									{/* Dine-in row (only if quantity > 0) */}
									{item.quantity > 0 && (
										<tr>
											<td className="border-t border-transparent px-4 py-2">
												{item.menu_name}
											</td>
											<td className="border-t border-transparent px-4 py-2">
												{item.quantity}
											</td>
											<td className="border-t border-transparent px-4 py-2">
												{(item.price ?? 0) * item.quantity}
											</td>

											<td
												onClick={() => handleRemoveItem(item, false)}
												className="border-t border-transparent px-4 py-2 text-red-500 cursor-pointer">
												X
											</td>
										</tr>
									)}

									{/* Takeaway row (only if takeawayQuantity > 0) */}
									{item.takeawayQuantity > 0 && (
										<tr>
											<td className="border-t border-transparent px-4 py-2">
												<div className="flex items-center justify-center gap-2 flex-wrap">
													<p>{item.menu_name}</p>
													<TbPaperBag
														className="inline"
														color="cyan"
														size={18}
													/>
												</div>
											</td>
											<td className="border-t border-transparent px-4 py-2">
												{item.takeawayQuantity}
											</td>
											<td className="border-t border-transparent px-4 py-2">
												{(item.price ?? 0) * item.takeawayQuantity}
											</td>

											<td
												onClick={() => handleRemoveItem(item, true)}
												className="border-t border-transparent px-4 py-2 text-red-500 cursor-pointer">
												X
											</td>
										</tr>
									)}
								</React.Fragment>
							))}
						</tbody>
					</table>
					{selectedMenu.length == [] ? (
						<></>
					) : (
						<>
							<div className="border-b-2 border-secondary my-8"></div>
							<div className="flex justify-between px-16">
								<p>Total</p>
								<p>{getMenuPriceTotal(selectedMenu)}</p>
							</div>
						</>
					)}
				</div>

				<div className="w-full h-20 border-t-2 border-secondary absolute bottom-0 px-4 left-0 flex justify-between items-center gap-4">
					{isEdit ? (
						<button
							type="submit"
							className="h-fit bg-red-500 text-black"
							onClick={() => handleDeleteOrder()}>
							Delete
						</button>
					) : (
						<div className="invisible"></div>
					)}
					<div className="flex items-center gap-4">
						{isEdit ? (
							<button
								type="submit"
								className="h-fit"
								onClick={handleUpdateOrder}>
								Confirm
							</button>
						) : (
							<button
								type="submit"
								className="h-fit"
								onClick={handleCreateOrder}>
								Order
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default VoucherModal;
