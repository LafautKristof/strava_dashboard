"use client";

import dynamic from "next/dynamic";

import { Streams } from "@/types/streams";
import { Activity } from "@/types/activity";

const Chart = dynamic(() => import("./Chart"), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-62.5 text-gray-400">
            Chart loading...
        </div>
    ),
});

export default function ActivityChartWrapper({
    activity,
    streams,
    onHoverKm,
    selectedSplit,
}: {
    activity: Activity;
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
