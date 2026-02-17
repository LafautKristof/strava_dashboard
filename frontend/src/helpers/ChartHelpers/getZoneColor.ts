export function getZoneColor(total: number, min: number, max: number) {
    if (total < min) return "#c4b5fd";
    if (total > max) return "#ef4444";
    return "#a855f7";
}
