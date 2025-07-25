/**
 * Converts UTC available slots to local time strings in 24h format.
 *
 * @param response - The UTC response from backend
 * @returns Array of formatted local time slots (24h)
 */
export function convertUtcSlotsToLocal24h({ date, availableSlots }) {

    return availableSlots.map((slot) => {

        // Combine date and time into a UTC ISO string
        const utcDateTime = new Date(`${date}T${slot}:00Z`);

        // Convert to local time and format in 24h
        return utcDateTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false, // 24h format
        });
    });
}
