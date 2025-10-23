import { Activities } from "@/app/types/activities";

export function getActivitiesPerWeek(activities: Activities[]) {
    const grouped: Record<string, Activities[]> = {};

    activities.forEach((a) => {
        const date = new Date(a.start_date_local);
        const year = date.getFullYear();
        const firstJan = new Date(year, 0, 1);
        const days = Math.floor(
            (date.getTime() - firstJan.getTime()) / (24 * 60 * 60 * 1000)
        );
        const week = Math.ceil((days + firstJan.getDay() + 1) / 7);

        const key = `${year}-W${week}`;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(a);
    });

    return Object.entries(grouped).map(([key, acts], index) => {
        const total_effort = acts.reduce(
            (sum, a) => sum + (a.suffer_score || 0),
            0
        );
        return {
            week: key,
            weekIndex: index + 1,
            total_effort,
            activities: acts,
        };
    });
}
