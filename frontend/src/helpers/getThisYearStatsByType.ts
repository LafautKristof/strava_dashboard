import { ActivitiesStats, ActivityType } from "@/app/types/activititiesStats";
import { Activity } from "@/app/types/activity";

export function getThisYearStatsByType(
    data: ActivitiesStats,
    type: ActivityType,
) {
    if (type === "Workout") {
        const stats = data.activities_this_year_by_activity[type];
        return {
            count: stats.count,
            hours: stats.elapsed_time / 3600,
            achievements: stats.achievement_count,
        };
    }
    const stats = data.activities_this_year_by_activity[type];
    const hours = Math.floor(stats.moving_time / 3600);
    const minutes = Math.floor((stats.moving_time % 3600) / 60);
    const formattedTime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    return {
        // count: stats.count,
        totalDistanceKmY: +(stats.distance / 1000).toFixed(2),
        formattedTimeY: formattedTime,
        totalElevationGainY: +stats.total_elevation_gain.toFixed(2),
        // achievements: stats.achievement_count,
    };
}
