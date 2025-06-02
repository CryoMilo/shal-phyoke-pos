/* eslint-disable react/prop-types */
import { QrReader } from "react-qr-reader";
import { useState } from "react";

const QrReaderModal = ({ onClose }) => {
	const [data, setData] = useState("No result");
	const [hasScanned, setHasScanned] = useState(false);

	console.log("Modal is Mouting");

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
			<div className="bg-primary rounded-lg p-6 w-96 shadow-lg">
				Select Payment Method
				<>
					<QrReader
						onResult={(result, error) => {
							if (!!result && !hasScanned) {
								setHasScanned(true);
								setData(result?.text);
								alert("Scanned QR Code:", result.text);
							}

							if (error && error.name !== "NotFoundException") {
								console.info("QR Scan Error:", error);
							}
						}}
						constraints={{ facingMode: "environment" }}
						style={{ width: "100%" }}
					/>
				</>
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

export default QrReaderModal;
