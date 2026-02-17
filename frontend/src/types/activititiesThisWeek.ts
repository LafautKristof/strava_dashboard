export type ActivityType = "run" | "ride" | "walk" | "hike" | "swim" | "other";

export type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export type ActivitiesThisWeek = Partial<
    Record<Weekday, { types: ActivityType[] }>
>;
