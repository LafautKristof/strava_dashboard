export function get12WeeksAgo() {
    const date = new Date();
    const twelveWeeksAgo = new Date(date);
    twelveWeeksAgo.setDate(date.getDate() - 12 * 7);
    return twelveWeeksAgo.toISOString().split("T")[0];
}
