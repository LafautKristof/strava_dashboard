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

export function getCurrentISOWeek(): string {
    return getISOWeekFromDate(new Date());
}

export function getWeeklyStatsByType(activities: Activities[], type: string) {
    const currentWeek = getCurrentISOWeek();
    const filtered = activities.filter((a) => {
        if (a.type.toLowerCase() !== type.toLowerCase()) return false;
        const date = new Date(a.start_date_local);
        return getISOWeekFromDate(date) === currentWeek;
    });

    const totalDistanceKm = filtered.reduce(
        (sum, a) => sum + a.distance / 1000,
        0
    );
    const totalMovingTimeSec = filtered.reduce(
        (sum, a) => sum + (a.moving_time || 0),
        0
    );
    const totalElevationGain = filtered.reduce(
        (sum, a) => sum + (a.total_elevation_gain || 0),
        0
    );

    const hours = Math.floor(totalMovingTimeSec / 3600);
    const minutes = Math.floor((totalMovingTimeSec % 3600) / 60);
    const formattedTime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    const orderedDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const daysData = orderedDays.map((day) => {
        const dayActivities = filtered.filter((a) =>
            new Date(a.start_date_local)
                .toLocaleDateString("en-US", { weekday: "short" })
                .startsWith(day)
        );

        return {
            day,
            hasActivity: dayActivities.length > 0,
            totalDistanceKm: dayActivities.reduce(
                (s, a) => s + a.distance / 1000,
                0
            ),
            totalTimeSec: dayActivities.reduce(
                (s, a) => s + (a.moving_time || 0),
                0
            ),
            totalElevation: dayActivities.reduce(
                (s, a) => s + (a.total_elevation_gain || 0),
                0
            ),
        };
    });

    return {
        totalDistanceKm: Number(totalDistanceKm.toFixed(1)),
        totalElevationGain: Math.round(totalElevationGain),
        totalMovingTimeSec,
        formattedTime,
        daysData,
    };
}
