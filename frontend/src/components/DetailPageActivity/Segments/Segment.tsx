"use client";

import dynamic from "next/dynamic";
import { Activities, SegmentEffort } from "@/app/types/activities";
import SegmentList from "./SegmentList";
import { useState } from "react";
import Header from "../OverView/Header";
import { Athlete } from "@/app/types/athlete";
import ActivityChart from "./ActivityChart";
import { Streams } from "@/app/types/streams";

const ActivityMap = dynamic(() => import("./ActivityMap"), { ssr: false });

const Segment = ({
    activities,
    type,
    athlete,
    streams,
}: {
    activities: Activities;
    type: string;
    athlete: Athlete;
    streams: Streams;
}) => {
    const [hoverSegment, setHoverSegment] = useState<SegmentEffort | null>(
        null
    );
    const [hoverKm, setHoverKm] = useState<number | null>(null);
    const segment = activities.segment_efforts;

    return (
        <section className="p-4 md:p-6">
            <div className="bg-gray-200 border mb-4 rounded-lg">
                <Header
                    athlete={`${athlete.firstname} ${athlete.lastname}`}
                    workout={type}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="min-h-[250px]">
                    <ActivityMap
                        activityPolyline={activities.map.polyline}
                        hoveredSegment={hoverSegment}
                        hoverKm={hoverKm}
                        streams={streams}
                        type={type}
                    />
                </div>
                <div className="min-h-[250px]">
                    <ActivityChart
                        distance={activities.distance}
                        hoveredSegment={hoverSegment}
                        streams={streams}
                        onHoverKm={setHoverKm}
                    />
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg border">
                <SegmentList
                    segment={segment}
                    onHoverSegment={setHoverSegment}
                />
            </div>
        </section>
    );
};

export default Segment;
