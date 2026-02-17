import { ActivityShort } from "@/types/activitiesGroupedByWeek";
import {
    ActivitiesThisWeek,
    ActivityType,
    Weekday,
} from "@/types/activititiesThisWeek";

const TYPE_MAP: Record<string, ActivityType> = {
    run: "run",
    ride: "ride",
    walk: "walk",
    hike: "hike",
    swim: "swim",
};

const WEEKDAYS: Weekday[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function getActivitiesThisWeek(
    activities: ActivityShort[],
): ActivitiesThisWeek {
    const days: ActivitiesThisWeek = {};

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const monday = new Date(today);
    const day = today.getDay() || 7;
    monday.setDate(today.getDate() - (day - 1));

    for (const act of activities) {
        const start = new Date(act.start_date_local);

        if (start >= monday && start <= today) {
            const index = (start.getDay() + 6) % 7;
            const key = WEEKDAYS[index];

            const type = TYPE_MAP[act.type.toLowerCase()] ?? "other";

            if (!days[key]) {
                days[key] = { types: [type] };
            } else if (!days[key]!.types.includes(type)) {
                days[key]!.types.push(type);
            }
        }
    }

    return days;
}
