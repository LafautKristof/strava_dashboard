export function calculatePaceAndGap(segment: {
    distance: number;
    moving_time: number;
    average_grade: number;
}) {
    const distanceKm = Math.max(0.05, segment.distance / 1000);

    const paceSecPerKm = segment.moving_time / distanceKm;

    const g = Math.max(-20, Math.min(20, segment.average_grade));

    const gapFactor = 1 + 0.0182 * g + 0.00031 * g * g;

    const gapSecPerKm = paceSecPerKm * gapFactor;

    return {
        pace: formatPace(paceSecPerKm),
        gap: formatPace(gapSecPerKm),
        raw: { paceSecPerKm, gapSecPerKm, grade: g },
    };
}

function formatPace(secondsPerKm: number) {
    const min = Math.floor(secondsPerKm / 60);
    const sec = Math.round(secondsPerKm % 60)
        .toString()
        .padStart(2, "0");
    return `${min}:${sec}`;
}
