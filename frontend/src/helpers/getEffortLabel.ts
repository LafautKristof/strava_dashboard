export function getEffortLabel(score: number) {
    if (score < 50) return "Easy";
    if (score < 100) return "Moderate";
    if (score < 180) return "Tough";
    if (score < 300) return "Massive";
    return "Epic";
}
