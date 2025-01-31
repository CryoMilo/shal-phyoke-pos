/* eslint-disable react/prop-types */
import { useState } from "react";
import { IoMdCash } from "react-icons/io";
import { IoQrCode } from "react-icons/io5";

const PaymentModal = ({
	paymentMethod,
	setPaymentMethod,
	setIsPaid,
	onClose,
}) => {
	const CASH = "Cash";
	const QR = "QR";

	const [activePayment, setActivePayment] = useState(paymentMethod);

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
			<div className="bg-black rounded-lg p-6 w-96 shadow-lg">
				Select Payment Method
				<div className="flex justify-center p-8 gap-8">
					<div
						onClick={() => {
							setActivePayment(CASH);
						}}
						className={`w-32 h-36 border-2 ${
							activePayment === CASH ? "border-yellow-400" : "border-white"
						} grid place-items-center`}>
						<IoMdCash size={35} />
					</div>
					<div
						onClick={() => {
							setActivePayment(QR);
						}}
						className={`w-32 h-36 ${
							activePayment === QR ? "border-yellow-400" : "border-white"
						} border-2 border-white grid place-items-center`}>
						<IoQrCode size={30} />
					</div>
				</div>
				<div className="mt-4 flex justify-end gap-4">
					<button
						className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
						onClick={() => {
							onClose();
							setPaymentMethod("");
						}}>
						Close
					</button>
					<button
						className="px-4 py-2 bg-green-300 text-black rounded hover:bg-gray-600"
						onClick={() => {
							setPaymentMethod(activePayment);
							setIsPaid(true);
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
