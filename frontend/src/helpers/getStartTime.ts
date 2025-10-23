export function getStartTime(date: string | Date) {
    const d = new Date(date);
    return d.toLocaleString("nl-BE", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}
