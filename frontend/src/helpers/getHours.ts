export function getTimeInHours(time: number) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    return `${hours}h ${minutes}m`;
}

export function getTimeInHoursMinutes(time: number) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    const m = minutes.toString().padStart(2, "0");
    const s = seconds.toString().padStart(2, "0");
    if (hours === 0) {
        return `${m}:${s}`;
    }
    const h = hours.toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
}
