"use client";

import dynamic from "next/dynamic";
import { Activities } from "@/app/types/activities";
import { Streams } from "@/app/types/streams";

const Chart = dynamic(() => import("./Chart"), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-[250px] text-gray-400">
            📊 Chart laden...
        </div>
    ),
});

export default function ActivityChartWrapper({
    activity,
    streams,
    onHoverKm,
    selectedSplit,
}: {
    activity: Activities;
    streams: Streams;
    onHoverKm?: (km: number | null) => void;
    selectedSplit?: number | null;
}) {
    return (
        <div className="flex flex-col gap-6">
            <Chart
                activity={activity}
                streams={streams}
                onHoverKm={onHoverKm}
                selectedSplit={selectedSplit}
            />
        </div>
    );
}
