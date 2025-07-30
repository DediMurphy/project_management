function toYMDDate(input) {
    try {
        const date = input instanceof Date ? input : new Date(input);
        if (isNaN(date.getTime())) {
            console.warn("[toYMDDate] Invalid date:", input);
            return "";
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    } catch (err) {
        console.error("[toYMDDate] Error:", err);
        return "";
    }
}

function formatBackendDate(isoString) {
    try {
        return isoString.split("T")[0];
    } catch (err) {
        console.error("[formatBackendDate] Error:", err);
        return "";
    }
}

function toHMTime(input) {
    try {
        const date = input instanceof Date ? input : new Date(input);
        if (isNaN(date.getTime())) {
            console.warn("[toHMTime] Invalid date:", input);
            return "";
        }

        const hour = String(date.getHours()).padStart(2, "0");
        const minute = String(date.getMinutes()).padStart(2, "0");

        return `${hour}:${minute}`;
    } catch (err) {
        console.error("[toHMTime] Error:", err);
        return "";
    }
}

function formatDateTimeIndo(input) {
    try {
        const date = input instanceof Date ? input : new Date(input);
        if (isNaN(date.getTime())) {
            console.warn("[formatDateTimeIndo] Invalid date:", input);
            return "";
        }

        const datePart = date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "Asia/Jakarta",
        });

        const timePart = date.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "Asia/Jakarta",
        });

        return `${datePart}, ${timePart}`;
    } catch (err) {
        console.error("[formatDateTimeIndo] Error:", err);
        return "";
    }
}

export {
    toYMDDate,
    formatBackendDate,
    toHMTime,
    formatDateTimeIndo,
};
