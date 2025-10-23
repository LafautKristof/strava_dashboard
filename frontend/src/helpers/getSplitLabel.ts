export function getSplitLabel(
    index: number,
    totalSplits: number,
    distance: number
) {
    const isLast = index === totalSplits - 1;

    if (isLast && distance < 999) {
        return `${(distance / 1000).toFixed(2)} `;
    }
    return `${index + 1}`;
}
