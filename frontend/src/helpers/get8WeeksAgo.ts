export function get8WeeksAgo() {
    const date = new Date();
    const eightWeeksAgo = new Date(date);
    eightWeeksAgo.setDate(date.getDate() - 8 * 7);
    return eightWeeksAgo.toISOString().split("T")[0];
}
