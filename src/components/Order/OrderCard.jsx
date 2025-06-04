import React, { useState } from "react";
import { formatTime } from "../../utils/formatTime";
import { TbPaperBag } from "react-icons/tb";
import { getMenuPriceTotal } from "../../utils/getMenuPriceTotal";
import { Link } from "react-router-dom";
import supabase from "../../utils/supabase";
import PaymentModal from "./PaymentModal";
import { UserAuth } from "../../context/AuthContext";
import UserPaymentQR from "./UserPaymentQR";

/* eslint-disable react/prop-types */
const OrderCard = ({ order }) => {
	const { session } = UserAuth();
	const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

	const handleUpdateOrder = async (orderId, tableId) => {
		const { error } = await supabase
			.from("order")
			.update({ status: "completed" })
			.eq("id", orderId);

		if (error) {
			console.error("Error updating order:", error);
			alert("Failed to update order.");
		} else {
			alert("Order Completed Successfully!");
		}

		if (tableId) {
			const { error: tableError } = await supabase
				.from("table")
				.update({ occupied: false })
				.eq("id", tableId);

			if (tableError) {
				console.error("Error updating table status:", tableError);
				alert("Order completed, but failed to update table status.");
			}
		}
	};

	return (
		<div className="w-80 p-4 relative shadow-lg rounded-2xl bg-transparent border-2 border-secondary flex justify-between flex-col">
			<div>
				<div className="flex justify-between items-start">
					<div>
						<div className="bg-primary w-14 h-14 p-3 border-2 border-secondary rounded-md flex justify-center mb-4">
							{order?.table?.image_url && (
								<img
									src={order?.table.image_url}
									alt="table_image"
									className="w-full h-full rounded-md"
								/>
							)}
						</div>

						<p className="text-md">
							{order?.table?.table_name || "Individual"}
						</p>
					</div>

					<p className="text-md font-medium">
						{`${order.status}`.toUpperCase()}
					</p>
				</div>

				<div className="mt-4 text-sm flex w-full justify-between">
					<p className="text-xs">{formatTime(order.created_at)}</p>
				</div>

				<div className="mt-4 border-t pt-4">
					<ul>
						{order.menu_items?.map((item) => (
							<React.Fragment key={item.menu_id}>
								{item.quantity > 0 && (
									<li className="flex justify-between">
										<span>
											{item.menu_name} x {item.quantity}
										</span>
										<span>{item.price * item.quantity}</span>
									</li>
								)}
								{item.takeawayQuantity > 0 && (
									<li className="flex justify-between">
										<div className="flex items-center gap-2">
											<p>
												{item.menu_name} x {item.takeawayQuantity}
											</p>
											<TbPaperBag className="inline" color="cyan" size={18} />
										</div>
										<span>{item.price * item.takeawayQuantity}</span>
									</li>
								)}
							</React.Fragment>
						))}
					</ul>

					<div className="flex justify-between mt-4 font-bold">
						<span>Total</span>
						<span>{getMenuPriceTotal(order.menu_items)} ฿</span>
					</div>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="mt-6 flex justify-between gap-2">
				{session && (
					<Link className="w-full" to={`/order/edit/${order.id}`}>
						<button className="w-full">See Details</button>
					</Link>
				)}

				{order.payment_method !== null ? (
					order.status !== "completed" && (
						<button
							type="button"
							onClick={() => handleUpdateOrder(order.id, order.table_id)}
							className="bg-blue-400 text-black w-full">
							Complete
						</button>
					)
				) : (
					<button
						onClick={() => setIsPaymentModalOpen(true)}
						className="w-full bg-yellow-400 text-black">
						Pay Bill
					</button>
				)}
			</div>

			{order.payment_method && (
				<div className="absolute text-3xl text-red-500 border-4 px-3 border-red-500 rounded-lg font-bold flex flex-col items-center right-[10%] bottom-[30%] -rotate-45">
					<p>PAID BY</p>
					<p>{order.payment_method}</p>
				</div>
			)}

			{isPaymentModalOpen && session && (
				<PaymentModal
					orderId={order.id}
					onClose={() => setIsPaymentModalOpen(false)}
				/>
			)}

			{isPaymentModalOpen && !session && (
				<UserPaymentQR
					orderId={order.id}
					onClose={() => setIsPaymentModalOpen(false)}
				/>
			)}
		</div>
	);
};

export default OrderCard;
