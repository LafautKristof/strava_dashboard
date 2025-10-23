"use client";

import {
    CartesianGrid,
    Line,
    Tooltip,
    XAxis,
    YAxis,
    ResponsiveContainer,
    ReferenceDot,
    Area,
    ComposedChart,
    ReferenceLine,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { Activities } from "@/app/types/activities";
import { Button } from "@/components/ui/button";
import { Streams } from "@/app/types/streams";
import { useEffect, useState } from "react";

type Metric = "elevation" | "pace" | "gap" | "heartrate";

export default function Chart({
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
    const [activeKm, setActiveKm] = useState<number | null>(null);

    const chartData =
        streams.time?.data?.map((_, i) => ({
            km: streams.distance?.data?.[i]
                ? Number((streams.distance.data[i] / 1000).toFixed(2))
                : Number((i * 0.001).toFixed(2)),
            heartrate: streams.heartrate?.data?.[i] ?? null,
            pace: streams.velocity_smooth?.data?.[i]
                ? 1000 / streams.velocity_smooth.data[i] / 60
                : null,
            gap: streams.grade_adjusted_speed?.data?.[i]
                ? 1000 / streams.grade_adjusted_speed.data[i] / 60
                : null,
            elevation: streams.altitude?.data?.[i] ?? 0,
        })) ?? [];

    const maxKm =
        chartData.length > 0 ? chartData[chartData.length - 1].km ?? 0 : 0;
    const ticks = Array.from({ length: Math.ceil(maxKm) + 1 }, (_, i) => i);

    const [visibleMetrics, setVisibleMetrics] = useState<Metric[]>([
        "elevation",
    ]);

    const toggleMetric = (metric: Metric) => {
        if (metric === "elevation") return;
        setVisibleMetrics((prev) =>
            prev.includes(metric)
                ? prev.filter((m) => m !== metric)
                : [...prev, metric]
        );
    };

    const colors = {
        elevation: "#82ca9d",
        pace: "#8884d8",
        gap: "#00C49F",
        heartrate: "#FF7300",
    };

    useEffect(() => {
        if (typeof selectedSplit === "number") {
            const totalSplits = activity.splits_metric?.length ?? 0;
            const totalDistance =
                (activity.distance ?? streams.distance?.data?.at(-1) ?? 0) /
                1000;
            const splitLength = totalDistance / totalSplits;
            const startKm = selectedSplit * splitLength;
            console.log(startKm);
        }
    }, [
        selectedSplit,
        activity.distance,
        activity.splits_metric,
        streams.distance,
    ]);

    return (
        <div className="w-full">
            <ChartContainer className="aspect-auto h-[220px] sm:h-[280px] md:h-[320px] w-full overflow-visible">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        layout="horizontal"
                        data={chartData}
                        margin={{
                            top: 10,
                            right: 20,
                            left: 40,
                            bottom: 10,
                        }}
                        onMouseMove={(e) => {
                            const km =
                                typeof e?.activeLabel === "number"
                                    ? e.activeLabel
                                    : parseFloat(String(e?.activeLabel));
                            if (!isNaN(km)) {
                                setActiveKm(km);
                                onHoverKm?.(km);
                            } else {
                                setActiveKm(null);
                                onHoverKm?.(null);
                            }
                        }}
                        onMouseLeave={() => {
                            setActiveKm(null);
                            onHoverKm?.(null);
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis
                            dataKey="km"
                            type="number"
                            domain={[0, Math.ceil(maxKm) + 0.2]}
                            allowDataOverflow
                            ticks={ticks}
                            tickFormatter={(v) => `${v} km`}
                            tick={{ fill: "var(--foreground)" }}
                        />

                        <YAxis
                            orientation="right"
                            stroke="var(--muted-foreground)"
                            tick={{ fill: "var(--muted-foreground)" }}
                        />

                        <Tooltip
                            contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                            }}
                            formatter={(value: number, name: string) => {
                                if (name === "elevation")
                                    return [`${value.toFixed(1)} m`, "Hoogte"];
                                if (name === "pace" || name === "gap")
                                    return [
                                        `${value.toFixed(1)} min/km`,
                                        name.toUpperCase(),
                                    ];
                                if (name === "heartrate")
                                    return [
                                        `${Math.round(value)} bpm`,
                                        "Hartslag",
                                    ];
                                return [value, name];
                            }}
                            labelFormatter={(v: number) => `${v.toFixed(1)} km`}
                        />

                        <Area
                            type="monotone"
                            dataKey="elevation"
                            fill={colors.elevation}
                            stroke={colors.elevation}
                            strokeWidth={2}
                            isAnimationActive={false}
                            dot={false}
                        />

                        {visibleMetrics
                            .filter((m) => m !== "elevation")
                            .map((metric) => (
                                <Line
                                    key={metric}
                                    type="monotone"
                                    dataKey={metric}
                                    stroke={colors[metric]}
                                    strokeWidth={2}
                                    dot={false}
                                    isAnimationActive={false}
                                />
                            ))}

                        {activeKm !== null &&
                            (() => {
                                const point = chartData.find(
                                    (d) => Math.abs(d.km - activeKm) < 0.02
                                );
                                const yValue = point?.elevation;
                                if (yValue === undefined || yValue === null)
                                    return null;
                                return (
                                    <ReferenceDot
                                        x={activeKm}
                                        y={yValue}
                                        r={5}
                                        fill="yellow"
                                        stroke="black"
                                        strokeWidth={1}
                                    />
                                );
                            })()}
                    </ComposedChart>
                </ResponsiveContainer>
            </ChartContainer>

            <div className="flex gap-2 px-2 py-2 bg-muted/40 overflow-x-auto no-scrollbar mt-3 rounded-md lg:justify-start">
                {(["pace", "gap", "heartrate"] as Metric[]).map((metric) => (
                    <Button
                        key={metric}
                        size="sm"
                        variant={
                            visibleMetrics.includes(metric)
                                ? "default"
                                : "outline"
                        }
                        onClick={() => toggleMetric(metric)}
                        className="whitespace-nowrap"
                    >
                        {metric.charAt(0).toUpperCase() + metric.slice(1)}
                    </Button>
                ))}
            </div>
        </div>
    );
}
