export type ActivityType = "run" | "ride" | "swim" | "walk" | "hike" | "other";

export type DayActivity = {
    type: ActivityType;
};

export type DaysThisWeek = Partial<{
    Mon: DayActivity;
    Tue: DayActivity;
    Wed: DayActivity;
    Thu: DayActivity;
    Fri: DayActivity;
    Sat: DayActivity;
    Sun: DayActivity;
}>;
