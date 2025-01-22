/**
 * Formats an ISO timestamp into a 12-hour time string (e.g., "4:30 AM").
 *
 * @param {string} isoTimestamp - The ISO 8601 timestamp to format.
 * @returns {string} The formatted time string.
 */
export const formatTime = (isoTimestamp) => {
	const date = new Date(isoTimestamp);

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
