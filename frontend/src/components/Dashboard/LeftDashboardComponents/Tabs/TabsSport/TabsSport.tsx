import { Separator } from "@/components/ui/separator";
import Chart from "./Chart";
import ThisWeek from "./ThisWeek";
import TimeElevation from "./TimeElevation";
import ThisYear from "./ThisYear";
import { ActivitiesGroupedByWeek } from "@/types/activitiesGroupedByWeek";
import {
    getDaysDataForWeek,
    getWeeklyStatsByType,
} from "@/helpers/getWeeklyStatsByType";
import { ActivitiesStats, ActivityType } from "@/types/activititiesStats";
import { getThisYearStatsByType } from "@/helpers/getThisYearStatsByType";
import { useMemo } from "react";
import { getCurrentISOWeek } from "@/helpers/getCurrentWeek";

const TabsSport = ({
    activities8Weeks,
    activitiesStats,
    type,
}: {
    activities8Weeks: ActivitiesGroupedByWeek[];
    activitiesStats: ActivitiesStats;
    type: ActivityType;
}) => {
    // console.log("data", activities8Weeks);
    const { totalDistanceKm, formattedTime, totalElevationGain } =
        getWeeklyStatsByType(activities8Weeks, type);

    const { totalDistanceKmY, formattedTimeY, totalElevationGainY } =
        getThisYearStatsByType(activitiesStats, type);

    const currentWeekId = getCurrentISOWeek();

    const currentWeek = useMemo(
        () =>
            activities8Weeks.find((week) => week.week === currentWeekId) ??
            null,
        [activities8Weeks, currentWeekId],
    );

    const daysData = useMemo(() => {
        if (!currentWeek) return [];
        return getDaysDataForWeek(currentWeek);
    }, [currentWeek]);
    return (
        <div className="space-y-4">
            <ThisWeek
                totalDistanceKm={totalDistanceKm}
                totalTime={formattedTime}
                type={type}
            />
            <Chart data={daysData} />
            <TimeElevation
                formattedTime={formattedTime}
                totalElevationGain={totalElevationGain}
                type={type}
            />

            <Separator className="my-4" />
            <ThisYear
                totalDistanceKm={totalDistanceKmY}
                type={type}
                formattedTime={formattedTimeY}
            />
            <TimeElevation
                formattedTime={formattedTimeY || ""}
                totalElevationGain={totalElevationGainY}
                type={type}
            />
        </div>
    );
};
export default TabsSport;
