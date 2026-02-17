export function getCurrentISOWeek() {
    const now = new Date();
    const year = now.getFullYear();
    const week = Math.ceil(
        ((now.getTime() - new Date(year, 0, 1).getTime()) / 86400000 +
            new Date(year, 0, 1).getDay() +
            1) /
            7,
    );
    return `${year}-W${String(week).padStart(2, "0")}`;
}
