import { Activities } from "@/app/types/activities";

export type DaysThisWeek = {
    Mon?: { type: "run" | "ride" };
    Tue?: { type: "run" | "ride" };
    Wed?: { type: "run" | "ride" };
    Thu?: { type: "run" | "ride" };
    Fri?: { type: "run" | "ride" };
    Sat?: { type: "run" | "ride" };
    Sun?: { type: "run" | "ride" };
};

export function getDaysThisWeek(activities: Activities[]): DaysThisWeek {
    const days: DaysThisWeek = {};

    const today = new Date();
    const monday = new Date(today);
    const day = today.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    monday.setDate(today.getDate() + diff);

    const dayNames: (keyof DaysThisWeek)[] = [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun",
    ];

    for (const act of activities) {
        const start = new Date(act.start_date);

        if (start >= monday && start <= today) {
            const index = (start.getDay() + 6) % 7;
            const key = dayNames[index];
            days[key] = { type: act.type.toLowerCase() as "run" | "ride" };
        }
    }

    return days;
}
