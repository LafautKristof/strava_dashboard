export function getEffortText(zoneStatus: string) {
    if (zoneStatus === "above") {
        return "You're training harder than usual. Be sure to get enough rest!";
    } else if (zoneStatus === "below") {
        return "You might want to increase your training intensity to meet your goals.";
    } else {
        return "Your activity level is steady. Keep maintaining a balanced workload.";
    }
}
