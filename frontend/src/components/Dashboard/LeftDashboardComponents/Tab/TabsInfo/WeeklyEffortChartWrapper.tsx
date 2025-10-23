"use client";

import { Activities8Weeks } from "@/app/types/activities12Weeks";
import dynamic from "next/dynamic";
import { Suspense } from "react";

/**
 * We gebruiken dynamic import met `ssr: false` omdat Recharts
 * niet goed werkt tijdens server-side rendering in Next.js.
 *
 * Dit component laadt de WeeklyEffortChart pas client-side.
 */
const WeeklyEffortChart = dynamic(() => import("./WeeklyEffortChart"), {
    ssr: false,
    loading: () => (
        <div className="flex justify-center items-center h-[320px] text-sm text-muted-foreground">
            Grafiek laden...
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
                    Grafiek laden...
                </div>
            }
        >
            <WeeklyEffortChart data={data} onHoverWeek={onHoverWeek} />
        </Suspense>
    );
}
