export default function formatDateAndTime(dateString: string, option: number) {
    if (option === 1) {
        const date = new Date(dateString);

        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
        };

        return date.toLocaleDateString("nl-BE", options);
    }
    if (option === 2) {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        };
        return date.toLocaleDateString("en-US", options);
    } else {
        return "Invalid option";
    }
}

export function getStartTime(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleTimeString("nl-BE");
}

export function getTimeInHoursMinutes(seconds: number) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
        return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    }

    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function getTimeInHoursMinutes2(seconds: number) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hrs}h${mins.toString().padStart(2, "0")}m${secs
        .toString()
        .padStart(2, "0")}s`;
}
