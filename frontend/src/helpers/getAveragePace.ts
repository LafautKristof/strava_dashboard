export function formatPace(avgSpeed: number) {
    if (!avgSpeed || avgSpeed === 0) return "-";
    const pace = 1000 / avgSpeed / 60;
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")} `;
}
