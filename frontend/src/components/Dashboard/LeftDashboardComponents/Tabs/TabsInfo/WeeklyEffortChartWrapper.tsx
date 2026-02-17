"use client";

import { ActivitiesGroupedByWeek } from "@/src/types/activitiesGroupedByWeek";
import dynamic from "next/dynamic";

const WeeklyEffortChart = dynamic(() => import("./WeeklyEffortChart"), {
    ssr: false,
    loading: () => (
        <div className="flex justify-center items-center  text-sm text-muted-foreground">
            Chart loading...
        </div>
    ),
});
export default function WeeklyEffortChartWrapper({
    data,
    onHoverWeek,
}: {
    data: ActivitiesGroupedByWeek[];
    onHoverWeek?: (week: ActivitiesGroupedByWeek | null) => void;
}) {
    return <WeeklyEffortChart data={data} onHoverWeek={onHoverWeek} />;
}
