import { Activities } from "@/app/types/activities";

function getISOWeekFromDate(date: Date): string {
    const tmp = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((+tmp - +yearStart) / 86400000 + 1) / 7);
    return `${tmp.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

export function getCurrentYearlyStatsByType(
    activities: Activities[],
    type: string
) {
    const currentYear = new Date().getFullYear();

    const filtered = activities.filter((a) => {
        if (a.type.toLowerCase() !== type.toLowerCase()) return false;
        const date = new Date(a.start_date_local);
        return date.getFullYear() === currentYear;
    });

    const grouped: Record<
        string,
        {
            activities: Activities[];
            totalDistanceKm: number;
            totalTimeSec: number;
            totalElevation: number;
        }
    > = {};

    filtered.forEach((a) => {
        const weekKey = getISOWeekFromDate(new Date(a.start_date_local));
        if (!grouped[weekKey]) {
            grouped[weekKey] = {
                activities: [],
                totalDistanceKm: 0,
                totalTimeSec: 0,
                totalElevation: 0,
            };
        }
        grouped[weekKey].activities.push(a);
        grouped[weekKey].totalDistanceKm += a.distance / 1000;
        grouped[weekKey].totalTimeSec += a.moving_time || 0;
        grouped[weekKey].totalElevation += a.total_elevation_gain || 0;
    });

    const yearlyData = Array.from({ length: 52 }, (_, i) => {
        const weekId = `${currentYear}-W${String(i + 1).padStart(2, "0")}`;
        const entry = grouped[weekId];

        if (!entry) {
            return {
                week: weekId,
                totalDistanceKm: 0,
                totalTimeSec: 0,
                totalElevation: 0,
                formattedTime: "0m",
                activities: [],
            };
        }

        const hours = Math.floor(entry.totalTimeSec / 3600);
        const minutes = Math.floor((entry.totalTimeSec % 3600) / 60);
        const formattedTime =
            hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

        return {
            week: weekId,
            totalDistanceKm: Number(entry.totalDistanceKm.toFixed(1)),
            totalTimeSec: entry.totalTimeSec,
            totalElevation: Math.round(entry.totalElevation),
            formattedTime,
            activities: entry.activities,
        };
    });

    const totals = yearlyData.reduce(
        (acc, w) => {
            acc.totalDistanceKm += w.totalDistanceKm;
            acc.totalTimeSec += w.totalTimeSec;
            acc.totalElevation += w.totalElevation;
            return acc;
        },
        { totalDistanceKm: 0, totalTimeSec: 0, totalElevation: 0 }
    );

    const totalHours = Math.floor(totals.totalTimeSec / 3600);
    const totalMinutes = Math.floor((totals.totalTimeSec % 3600) / 60);
    const formattedTotalTime =
        totalHours > 0 ? `${totalHours}h ${totalMinutes}m` : `${totalMinutes}m`;

    return {
        year: currentYear,
        totals: {
            totalDistanceKm: Number(totals.totalDistanceKm.toFixed(1)),
            totalElevationGain: Math.round(totals.totalElevation),
            formattedTotalTime,
        },
        weeks: yearlyData,
    };
}
