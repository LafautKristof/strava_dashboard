import { ActivitiesGroupedByWeek } from "@/src/types/activitiesGroupedByWeek";

export function getLastActiveWeek(
    weeks: ActivitiesGroupedByWeek[],
): ActivitiesGroupedByWeek | null {
    return (
        [...weeks]
            .reverse()
            .find((w) => w.activities && w.activities.length > 0) ?? null
    );
}
type DayData = {
    day: string; // "Mon" | "Tue" | ...
    hasActivity: boolean;
};
const ORDERED_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getLocalWeekStart(date: Date) {
    const d = new Date(date);
    const day = d.getDay(); // 0 = Sun, 1 = Mon
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

export function getDaysDataForWeek(week: ActivitiesGroupedByWeek) {
    const weekStart = getLocalWeekStart(new Date(week.start));

    const activeDays = new Set<string>();

    for (const act of week.activities) {
        if (!act.start_date_local) continue;

        const actDate = new Date(act.start_date_local);

        // verschil in lokale dagen
        const diffDays = Math.floor(
            (actDate.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (diffDays >= 0 && diffDays <= 6) {
            activeDays.add(ORDERED_DAYS[diffDays]);
        }
    }

    return ORDERED_DAYS.map((day) => ({
        day,
        hasActivity: activeDays.has(day),
    }));
}

export function getWeeklyStatsByType(
    data: ActivitiesGroupedByWeek[],
    type: string,
) {
    const currentWeek = data[7].activities;

    const totalDistanceKm =
        currentWeek.reduce((total, activity) => total + activity.distance, 0) /
        1000;
    const totalMovingTimeInSeconds = currentWeek.reduce(
        (total, activity) => total + activity.moving_time,
        0,
    );
    const hours = Math.floor(totalMovingTimeInSeconds / 3600);
    const minutes = Math.floor((totalMovingTimeInSeconds % 3600) / 60);
    const formattedTime =
        hours > 0 ? `${hours}h ${minutes}min` : `${minutes} min`;
    const totalElevationGain = currentWeek.reduce(
        (total, activity) => total + activity.elevation,
        0,
    );

    return {
        totalDistanceKm,
        formattedTime,
        totalElevationGain,
    };
}
