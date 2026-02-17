import { Activity } from "./activity";
export type ActivityType = "Ride" | "Run" | "Walk" | "Workout";
export type ActivitiesStats = {
    days_this_week: {
        Mon: boolean;
        Tue: boolean;
        Wed: boolean;
        Thu: boolean;
        Fri: boolean;
        Sat: boolean;
        Sun: boolean;
    };
    last_activity: Activity;
    total_activities: number;
    weekly_streak: number;
    activities_this_year_by_activity: ActivitiesThisYearByActivity;
};

export type ActivitiesThisYearByActivity = {
    Ride: FullActivityYearStats;
    Run: FullActivityYearStats;
    Walk: FullActivityYearStats;
    Workout: WorkoutYearStats;
};
export type FullActivityYearStats = {
    count: number;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    total_elevation_gain: number;
    achievement_count: number;
};

export type WorkoutYearStats = {
    count: number;
    elapsed_time: number;
    achievement_count: number;
};
