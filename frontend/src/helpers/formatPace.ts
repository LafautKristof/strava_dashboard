export function formatPace(speed: number) {
    if (!speed || speed <= 0) return "-";
    const paceInMinPerKm = 1000 / (speed * 60);
    const minutes = Math.floor(paceInMinPerKm);
    const seconds = Math.round((paceInMinPerKm - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")} /km`;
}
