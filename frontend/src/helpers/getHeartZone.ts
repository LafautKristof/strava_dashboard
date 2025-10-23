export function getHeartRateZones(HRmax: number) {
    return [
        { zone: "Z1", name: "Recovery", min: 0, max: 0.68 * HRmax },
        { zone: "Z2", name: "Endurance", min: 0.68 * HRmax, max: 0.83 * HRmax },
        { zone: "Z3", name: "Tempo", min: 0.83 * HRmax, max: 0.94 * HRmax },
        { zone: "Z4", name: "Threshold", min: 0.94 * HRmax, max: 1.05 * HRmax },
        { zone: "Z5", name: "Anaerobic", min: 1.05 * HRmax, max: HRmax * 2 },
    ];
}

export function getHeartRateDistribution(
    heartRates: number[],
    HRmax: number,
    sampleRate = 1
) {
    const zones = getHeartRateZones(HRmax);
    const totalSeconds = heartRates.length * sampleRate;

    const zoneStats = zones.map((zone) => {
        const seconds =
            heartRates.filter((hr) => hr >= zone.min && hr < zone.max).length *
            sampleRate;
        const percentage =
            totalSeconds > 0 ? (seconds / totalSeconds) * 100 : 0;
        return { ...zone, seconds, percentage };
    });

    return zoneStats;
}

export function formatDuration(seconds: number) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min > 0 ? `${min}m ` : ""}${sec}s`;
}
