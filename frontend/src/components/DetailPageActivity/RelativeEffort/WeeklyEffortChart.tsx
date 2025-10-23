"use client";

import {
    ComposedChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Area,
    ReferenceLine,
    ReferenceArea,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Activities12Weeks } from "@/app/types/activities12Weeks";
import { Activities } from "@/app/types/activities";

type EffortDotProps = {
    cx: number;
    cy: number;
    value: number;
    index: number;
};

export default function WeeklyEffortChart({
    activities12Weeks,
    onHoverWeek,
    activity,
}: {
    activities12Weeks: Activities12Weeks[];
    onHoverWeek?: (week: Activities12Weeks | null) => void;
    activity: Activities;
}) {
    const [selectedWeek, setSelectedWeek] = useState<Activities12Weeks | null>(
        null
    );

    const hasData = activities12Weeks?.length > 0;

    const total = hasData
        ? activities12Weeks.reduce((sum, w) => sum + (w.total_effort || 0), 0)
        : 0;
    const avg = hasData ? total / activities12Weeks.length : 0;
    const chartData = hasData
        ? activities12Weeks.map((w, i, arr) => {
              const prev = arr.slice(Math.max(0, i - 3), i);
              const base =
                  prev.length > 0
                      ? prev.reduce((s, p) => s + (p.total_effort || 0), 0) /
                        prev.length
                      : avg;
              return {
                  ...w,
                  weekIndex: i + 1,
                  minZone: base * 0.8,
                  maxZone: base * 1.2,
              };
          })
        : [];

    useEffect(() => {
        if (!selectedWeek && chartData.length > 0) {
            const last = chartData[chartData.length - 1];
            setSelectedWeek(last);
            onHoverWeek?.(last);
        }
    }, [chartData, selectedWeek, onHoverWeek]);

    if (!hasData) {
        return (
            <Card className="p-6 text-center text-muted-foreground">
                Geen data voor de laatste 12 weken
            </Card>
        );
    }

    let activityWeekIndex: number | null = null;
    const activityDate = new Date(activity.start_date_local);
    for (let i = 0; i < chartData.length; i++) {
        const w = chartData[i];
        if (
            w.start &&
            w.end &&
            activityDate >= new Date(w.start) &&
            activityDate <= new Date(w.end)
        ) {
            activityWeekIndex = i;
            break;
        }
    }

    const EffortDot = ({ cx, cy, value, index }: EffortDotProps) => {
        if (typeof value !== "number")
            return (
                <circle cx={cx ?? 0} cy={cy ?? 0} r={0} fill="transparent" />
            );
        const w = chartData[index];
        const color =
            value < w.minZone
                ? "#ee82ee"
                : value > w.maxZone
                ? "#ef4444"
                : "#a855f7";

        return (
            <circle
                key={w.week}
                cx={cx}
                cy={cy}
                r={6}
                fill={color}
                stroke="#fff"
                strokeWidth={1.5}
                style={{ cursor: "pointer", transition: "all 0.25s ease" }}
                onMouseEnter={() => {
                    setSelectedWeek(w);
                    onHoverWeek?.(w);
                }}
            />
        );
    };

    return (
        <Card>
            <CardContent className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={chartData}
                        margin={{ top: 10, right: 40, bottom: 0, left: 10 }}
                        onMouseMove={(state) => {
                            if (state?.activeTooltipIndex != null) {
                                const hoveredWeek =
                                    chartData[state.activeTooltipIndex];
                                setSelectedWeek(hoveredWeek);
                                onHoverWeek?.(hoveredWeek);
                            }
                        }}
                        onClick={(state) => {
                            if (state?.activeTooltipIndex != null) {
                                const clickedWeek =
                                    chartData[state.activeTooltipIndex];
                                setSelectedWeek(clickedWeek);
                                onHoverWeek?.(clickedWeek);
                            }
                        }}
                        onMouseLeave={() => onHoverWeek?.(selectedWeek ?? null)}
                    >
                        <defs>
                            <linearGradient
                                id="zoneBand"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="#a855f7"
                                    stopOpacity={0.2}
                                />
                                <stop
                                    offset="100%"
                                    stopColor="#a855f7"
                                    stopOpacity={0.05}
                                />
                            </linearGradient>
                        </defs>

                        <Area
                            type="monotone"
                            dataKey="maxZone"
                            stroke="none"
                            fill="url(#zoneBand)"
                            isAnimationActive={false}
                        />
                        <Area
                            type="monotone"
                            dataKey="minZone"
                            stroke="none"
                            fill="white"
                            isAnimationActive={false}
                        />

                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="weekIndex"
                            tickFormatter={(v) => {
                                const week = chartData[v - 1];
                                if (!week?.start) return "";
                                const date = new Date(week.start);
                                return date.toLocaleDateString("nl-BE", {
                                    day: "2-digit",
                                    month: "short",
                                });
                            }}
                            stroke="#cbd5e1"
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            stroke="#cbd5e1"
                            label={{
                                value: "Effort",
                                angle: -90,
                                position: "insideLeft",
                                offset: 10,
                            }}
                        />

                        <Line
                            type="monotone"
                            dataKey="total_effort"
                            stroke="#a855f7"
                            strokeWidth={2}
                            dot={EffortDot}
                            activeDot={{
                                r: 8,
                                strokeWidth: 2,
                                stroke: "#000",
                            }}
                        />

                        {activityWeekIndex !== null && (
                            <ReferenceLine
                                x={chartData[activityWeekIndex].weekIndex}
                                stroke="#000000"
                                strokeWidth={3}
                            />
                        )}

                        {selectedWeek &&
                            selectedWeek.weekIndex !== undefined && (
                                <ReferenceArea
                                    x1={selectedWeek.weekIndex - 0.5}
                                    x2={selectedWeek.weekIndex + 0.5}
                                    fill="#a855f7"
                                    fillOpacity={0.08}
                                />
                            )}
                    </ComposedChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
