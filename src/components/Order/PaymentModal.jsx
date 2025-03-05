/* eslint-disable react/prop-types */
import { useState } from "react";
import { IoMdCash } from "react-icons/io";
import { IoQrCode } from "react-icons/io5";
import supabase from "../../utils/supabase";

const PaymentModal = ({ orderId, onClose }) => {
	const CASH = "Cash";
	const QR = "QR";

	const [activePayment, setActivePayment] = useState();

	const handlePayment = async () => {
		const { error } = await supabase
			.from("order")
			.update({ payment_method: activePayment, status: "paid" })
			.eq("id", orderId);

		if (error) {
			console.error("Error updating order:", error);
			alert("Failed to update payment. Try again.");
		} else {
			onClose(true);
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
			<div className="bg-primary rounded-lg p-6 w-96 shadow-lg">
				Select Payment Method
				<div className="flex justify-center p-8 gap-8">
					<div
						onClick={() => {
							setActivePayment(CASH);
						}}
						className={`w-32 h-36 border-2 cursor-pointer ${
							activePayment === CASH ? "border-yellow-500" : "border-secondary"
						} grid place-items-center`}>
						<IoMdCash size={35} />
					</div>
					<div
						onClick={() => {
							setActivePayment(QR);
						}}
						className={`w-32 h-36 cursor-pointer ${
							activePayment === QR ? "border-yellow-500" : "border-secondary"
						} border-2 grid place-items-center`}>
						<IoQrCode size={30} />
					</div>
				</div>
				<div className="mt-4 flex justify-end gap-4">
					<button
						className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
						onClick={() => {
							onClose();
							setActivePayment("");
						}}>
						Close
					</button>
					<button
						className="px-4 py-2 bg-green-300 text-black rounded hover:bg-green-400"
						onClick={() => {
							handlePayment();
							onClose(true);
						}}>
						Paid
					</button>
				</div>
			</div>
		</div>
	);
};

export default PaymentModal;
