export function get4WeeksAgo() {
    const date = new Date();
    const fourWeeksAgo = new Date(date);
    fourWeeksAgo.setDate(date.getDate() - 7 * 4);
    return fourWeeksAgo.toISOString().split("T")[0];
}
