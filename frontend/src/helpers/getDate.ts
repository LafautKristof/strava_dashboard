export default function getDateWithoutTime(date: string | Date) {
    const d = typeof date === "string" ? new Date(date) : date;

    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function formatActivityDate(isoDate: Date) {
    const date = new Date(isoDate);
    const now = new Date();

    const optionsTime: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Europe/Brussels",
    };
    const optionsDate: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
        timeZone: "Europe/Brussels",
    };

    const timeStr = date.toLocaleTimeString("nl-BE", optionsTime);

    const isSameDay = (a: Date, b: Date) =>
        a.toDateString() === b.toDateString();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(now.getDate() - 2);

    if (isSameDay(date, now)) return `Vandaag om ${timeStr}`;
    if (isSameDay(date, yesterday)) return `Gisteren om ${timeStr}`;
    if (isSameDay(date, twoDaysAgo)) return `Eergisteren om ${timeStr}`;

    const dateStr = date.toLocaleDateString("nl-BE", optionsDate);
    return `${dateStr} om ${timeStr}`;
}
