/**
 * Formats a time string or ISO timestamp into a 12-hour time string (e.g., "4:30 AM").
 *
 * @param {string} timeString - The time string or ISO 8601 timestamp to format.
 * @returns {string} The formatted time string.
 */
export const formatTime = (timeString) => {
	// Handle time-only strings like "19:35:32.13511"
	let date;
	if (/^\d{2}:\d{2}:\d{2}(\.\d+)?$/.test(timeString)) {
		// Extract hours, minutes, and seconds
		const [hours, minutes, seconds] = timeString.split(":").map(Number);
		date = new Date();
		date.setHours(hours, minutes, seconds || 0, 0); // Set hours, minutes, seconds, and milliseconds
	} else {
		// Handle ISO 8601 timestamps
		date = new Date(timeString);
	}

	// Get hours and minutes
	let hours = date.getHours();
	const minutes = date.getMinutes();

	// Convert to 12-hour format
	const period = hours >= 12 ? "PM" : "AM";
	hours = hours % 12 || 12; // Convert 0 to 12 for midnight

	// Format minutes to always show two digits
	const formattedMinutes = minutes.toString().padStart(2, "0");

	// Return the formatted time
	return `${hours}:${formattedMinutes} ${period}`;
};
