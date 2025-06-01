import QRCode from "react-qr-code";

// eslint-disable-next-line react/prop-types
const UserPaymentQR = ({ orderId, onClose }) => {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
			<div className="bg-primary rounded-lg p-6 w-96 shadow-lg">
				QR to Pay
				{orderId && (
					<div className="flex justify-center p-8 gap-8">
						<QRCode
							value={orderId}
							bgColor="#000000"
							fgColor="#ffffff"
							level="M"
							size={150}
						/>
					</div>
				)}
				<div className="mt-4 flex justify-end gap-4">
					<button
						className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
						onClick={() => {
							onClose();
						}}>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default UserPaymentQR;
