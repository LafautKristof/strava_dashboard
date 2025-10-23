export function getMessageLabelColor(
    totalEffort: number,
    minZone: number,
    maxZone: number
) {
    let rangeLabel = "Steady progress";
    let rangeColor = "#a855f7";
    let message =
        "Your activity level is steady. Keep maintaining a balanced workload.";

    if (totalEffort > maxZone) {
        rangeLabel = "Above weekly range";
        rangeColor = "#ef4444";
        message =
            "You're training harder than usual. Be sure to get enough rest!";
    } else if (totalEffort < minZone) {
        rangeLabel = "Below weekly range";
        rangeColor = "#ee82ee";
        message =
            "Your activity level has been lighter than average. If you are recovering, try to stay under your current threshold.";
    }

    return { rangeLabel, rangeColor, message };
}
