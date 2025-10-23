import { DataActivity } from "@/app/types/activities";
import ThisWeek from "../../../../ThisWeek";
import { getWeeklyStatsByType } from "@/helpers/getWeeklyStatsByType";
import Chart from "@/components/ChartByType";
import TimeElevation from "../../../../TimeElevation";

import { getCurrentYearlyStatsByType } from "@/helpers/getYearlyStatsByType";
import ThisYear from "../../../../ThisYear";
import { Separator } from "@/components/ui/separator";

const TabsBike = ({ data }: { data: DataActivity }) => {
    const { totalDistanceKm, formattedTime, totalElevationGain, daysData } =
        getWeeklyStatsByType(data.activities, "Ride");

    const yearly = getCurrentYearlyStatsByType(data.activities, "Ride");
    const {
        totalDistanceKm: totalDistanceKmY,
        totalElevationGain: totalElevationGainY,
        formattedTotalTime: formattedTimeY,
    } = yearly.totals;

    return (
        <div className="space-y-4">
            <ThisWeek totalDistanceKm={totalDistanceKm} />
            <Chart data={daysData} />
            <TimeElevation
                formattedTime={formattedTime}
                totalElevationGain={totalElevationGain}
            />

            <Separator className="my-4" />

            <ThisYear totalDistanceKm={totalDistanceKmY} />
            <TimeElevation
                formattedTime={formattedTimeY}
                totalElevationGain={totalElevationGainY}
            />
        </div>
    );
};

export default TabsBike;
