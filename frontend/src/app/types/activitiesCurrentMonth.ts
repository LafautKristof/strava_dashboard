export type ActivitiesCurrentMonth = {
    activities: Activities[];
    date: Date;
};

export type Activities = {
    id: number;
    type: string;
    name: string;
    moving_time: number;
    distance: number;
};

export type ActivityType = "Run" | "Ride" | "Workout" | "Walk";
