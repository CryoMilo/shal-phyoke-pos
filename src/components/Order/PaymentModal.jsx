// eslint-disable-next-line react/prop-types
const PaymentModal = ({ setPaymentMethod, setIsPaid, onClose }) => {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
			<div className="bg-black rounded-lg p-6 w-96 shadow-lg">
				Select Payment Method
				<div className="flex justify-center p-8 gap-8">
					<div className="w-32 h-36 border-2 border-white">Cash</div>
					<div className="w-32 h-36 border-2 border-white">QR</div>
				</div>
				<div className="mt-4 flex justify-end gap-4">
					<button
						className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
						onClick={onClose}>
						Close
					</button>
					<button
						className="px-4 py-2 bg-green-300 text-black rounded hover:bg-gray-600"
						onClick={() => setIsPaid(true)}>
						Paid
					</button>
				</div>
			</div>
		</div>
	);
};

export default PaymentModal;
