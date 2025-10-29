"use client";

import { useMemo } from "react";
import {
    Area,
    CartesianGrid,
    ComposedChart,
    ReferenceArea,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import type { SegmentEffort } from "@/app/types/activities";
import { Streams } from "@/app/types/streams";

export default function ActivityChart({
    distance,
    hoveredSegment,
    streams,
    onHoverKm,
}: {
    distance: number;
    hoveredSegment?: SegmentEffort | null;
    streams: Streams;
    onHoverKm?: (km: number | null) => void;
}) {
    const chartData = useMemo(() => {
        if (
            !streams ||
            !streams.altitude?.data?.length ||
            !streams.distance?.data?.length
        )
            return [];

        return streams.altitude.data.map((elev, i) => ({
            km: streams.distance.data[i] / 1000,
            elevation: elev,
        }));
    }, [streams]);

    const highlightRange = useMemo(() => {
        if (!hoveredSegment || !chartData.length) return null;

        const start = hoveredSegment.start_index;
        const end = hoveredSegment.end_index;

        if (
            start == null ||
            end == null ||
            start < 0 ||
            end >= chartData.length ||
            start >= end
        )
            return null;

        const startKm = chartData[start]?.km;
        const endKm = chartData[end]?.km;

        if (startKm == null || endKm == null) return null;

        return { x1: startKm, x2: endKm };
    }, [hoveredSegment, chartData]);

    if (!chartData.length) {
        return (
            <div className="p-6 text-muted-foreground text-center text-sm sm:text-base">
                No elevation data available
            </div>
        );
    }

    return (
        <ChartContainer className="aspect-auto h-[220px] sm:h-[280px] md:h-[320px] w-full overflow-visible">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                    data={chartData}
                    margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
                    onMouseMove={(e) => {
                        const km = e?.activePayload?.[0]?.payload?.km;
                        onHoverKm?.(km ?? null);
                    }}
                    onMouseLeave={() => onHoverKm?.(null)}
                >
                    <Tooltip
                        cursor={{
                            stroke: "#8884d8",
                            strokeWidth: 1,
                            opacity: 0.3,
                        }}
                        contentStyle={{
                            backgroundColor: "rgba(255,255,255,0.85)",
                            border: "none",
                            borderRadius: "6px",
                            padding: "6px 10px",
                            fontSize: "0.8rem",
                        }}
                    />
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="km"
                        type="number"
                        domain={[0, Number((distance / 1000).toFixed(2))]}
                        tickFormatter={(v) => v.toFixed(1)}
                        allowDecimals
                        interval="preserveStartEnd"
                        tick={{ fontSize: 10, fill: "#64748b" }}
                    />
                    <YAxis
                        dataKey="elevation"
                        stroke="#64748b"
                        tick={{ fill: "#64748b", fontSize: 10 }}
                        width={35}
                        domain={["auto", "auto"]}
                    />

                    <Area
                        type="monotone"
                        dataKey="elevation"
                        stroke="#a855f7"
                        fill="rgba(168,85,247,0.3)"
                        strokeWidth={2}
                        isAnimationActive={false}
                        dot={false}
                    />

                    {highlightRange && (
                        <ReferenceArea
                            x1={highlightRange.x1}
                            x2={highlightRange.x2}
                            fill="#22c55e"
                            fillOpacity={0.25}
                            stroke="none"
                        />
                    )}
                </ComposedChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}
