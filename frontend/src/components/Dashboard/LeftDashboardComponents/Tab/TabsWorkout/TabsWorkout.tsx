import { DataActivity } from "@/app/types/activities";
import { getWeeklyStatsByType } from "@/helpers/getWeeklyStatsByType";
import Chart from "@/components/ChartByType";
import TimeElevation from "../../../../TimeElevation";
import { getCurrentYearlyStatsByType } from "@/helpers/getYearlyStatsByType";
import { Separator } from "@/components/ui/separator";
import ThisWeek from "@/components/ThisWeek";

const TabsWorkout = ({ data }: { data: DataActivity }) => {
    const { formattedTime, daysData } = getWeeklyStatsByType(
        data.activities,
        "Workout"
    );

    const yearly = getCurrentYearlyStatsByType(data.activities, "Workout");
    const { formattedTotalTime: formattedTimeY } = yearly.totals;

    return (
        <div className="space-y-4">
            <ThisWeek />
            <Chart data={daysData} />
            <TimeElevation
                formattedTime={formattedTime}
                totalElevationGain={null}
            />

            <Separator className="my-4" />

            <TimeElevation
                formattedTime={formattedTimeY}
                totalElevationGain={null}
            />
        </div>
    );
};

export default TabsWorkout;
