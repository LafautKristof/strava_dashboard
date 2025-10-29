"use client";

import { Activities8Weeks } from "@/app/types/activities12Weeks";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const WeeklyEffortChart = dynamic(() => import("./WeeklyEffortChart"), {
    ssr: false,
    loading: () => (
        <div className="flex justify-center items-center h-[320px] text-sm text-muted-foreground">
            Chart loading...
        </div>
    ),
});

export default function WeeklyEffortChartWrapper({
    data,
    onHoverWeek,
}: {
    data: Activities8Weeks[];
    onHoverWeek?: (week: Activities8Weeks | null) => void;
}) {
    return (
        <Suspense
            fallback={
                <div className="flex justify-center items-center h-[320px] text-sm text-muted-foreground">
                    Chart Loading...
                </div>
            }
        >
            <WeeklyEffortChart data={data} onHoverWeek={onHoverWeek} />
        </Suspense>
    );
}
