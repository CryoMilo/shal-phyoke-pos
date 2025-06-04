/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import QrScannerWorkerPath from "qr-scanner/qr-scanner-worker.min.js?url";

QrScanner.WORKER_PATH = QrScannerWorkerPath;

const QrReaderModal = ({ onClose }) => {
	const [data, setData] = useState("No result");
	const [hasScanned, setHasScanned] = useState(false);
	const videoRef = useRef(null);
	const scannerRef = useRef(null);

	useEffect(() => {
		if (videoRef.current) {
			const scanner = new QrScanner(
				videoRef.current,
				(result) => {
					if (!hasScanned) {
						setHasScanned(true);
						setData(result?.data || result?.text || "No text");
						alert("Scanned QR Code: " + result.data);
					}
				},
				{
					highlightScanRegion: true,
					highlightCodeOutline: true,
					returnDetailedScanResult: true,
				}
			);

			scannerRef.current = scanner;
			scanner.start();

			console.log("Scanner started");

			return () => {
				console.log("Cleaning up scanner");
				scanner.stop();
				scanner.destroy();
			};
		}
	}, [hasScanned]);

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
			<div className="bg-primary rounded-lg p-6 w-96 shadow-lg text-white">
				<h2 className="text-lg font-semibold mb-4">Scan QR Code</h2>

				<video ref={videoRef} className="w-full rounded" />

				<p className="mt-4">Result: {data}</p>

				<div className="mt-4 flex justify-end gap-4">
					<button
						className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
						onClick={() => {
							scannerRef.current?.stop();
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
