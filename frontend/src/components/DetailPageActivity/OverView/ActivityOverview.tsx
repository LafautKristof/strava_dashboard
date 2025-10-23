"use client";

import { useState } from "react";
import Splits from "./Splits";
import ActivityChartWrapper from "./ActivityChartWrapper";
import { Activities } from "@/app/types/activities";
import { Streams } from "@/app/types/streams";

export default function ActivityOverview({
    activity,
    streams,
}: {
    activity: Activities;
    streams: Streams;
}) {
    const [hoverKm, setHoverKm] = useState<number | null>(null);
    const [selectedSplit, setSelectedSplit] = useState<number | null>(null);

    return (
        <div className="flex flex-col gap-6 mt-6 rounded-md bg-white shadow-sm border p-4 sm:p-6">
            <div className="overflow-x-auto -mx-2 sm:mx-0">
                <Splits
                    activity={activity}
                    splits={activity.splits_metric}
                    hoverKm={hoverKm}
                    selectedSplit={selectedSplit}
                    onSelectedSplit={setSelectedSplit}
                />
            </div>

            <div className="w-full">
                <ActivityChartWrapper
                    activity={activity}
                    streams={streams}
                    onHoverKm={setHoverKm}
                    selectedSplit={selectedSplit}
                />
            </div>
        </div>
    );
}
