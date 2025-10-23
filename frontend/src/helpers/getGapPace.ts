export function getGapPace(gradeAdjustedSpeed: number | null | undefined) {
    if (!gradeAdjustedSpeed || gradeAdjustedSpeed <= 0) return `-`;
    const secondsPerKm = 1000 / gradeAdjustedSpeed;
    const minutes = Math.floor(secondsPerKm / 60);
    const seconds = Math.round(secondsPerKm % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")} /km`;
}
