"use client";

import {
    ComposedChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Area,
    Tooltip,
} from "recharts";
import { Card } from "@/components/ui/card";
import { useCallback, useMemo } from "react";
import { ActivitiesGroupedByWeek } from "@/types/activitiesGroupedByWeek";
import {
    CustomActiveDot,
    CustomDot,
} from "@/components/ChartComponents/CustomDot";

export default function WeeklyEffortChart({
    data,
    onHoverWeek,
}: {
    data: ActivitiesGroupedByWeek[];
    onHoverWeek?: (week: ActivitiesGroupedByWeek | null) => void;
}) {
    const chartData = useMemo(() => {
        if (!data.length) return [];

        const avg =
            data.reduce((sum, w) => sum + w.total_effort, 0) / data.length;

        return data.map((week, i, arr) => {
            const prev = arr.slice(Math.max(0, i - 3), i);
            const base =
                prev.length > 0
                    ? prev.reduce((s, w) => s + w.total_effort, 0) / prev.length
                    : avg;
            return { ...week, minZone: base * 0.8, maxZone: base * 1.2 };
        });
    }, [data]);

    if (!chartData.length) {
        return (
            <Card className="p-6 text-center text-muted-foreground">
                No data for the last 8 weeks
            </Card>
        );
    }
    const handleMouseMove = useCallback(
        (state: unknown) => {
            const s = state as {
                activeTooltipIndex?: number | string | null;
            };

            const rawIndex = s.activeTooltipIndex;
            const index =
                typeof rawIndex === "number"
                    ? rawIndex
                    : typeof rawIndex === "string"
                      ? Number(rawIndex)
                      : null;

            if (
                typeof index === "number" &&
                !Number.isNaN(index) &&
                data[index]
            ) {
                onHoverWeek?.(data[index]);
            }
        },
        [data, onHoverWeek],
    );
    const handleMouseLeave = useCallback(() => {
        onHoverWeek?.(null);
    }, [onHoverWeek]);
    return (
        <div className="w-full h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                    data={chartData}
                    margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    <Tooltip content={() => null} cursor={false} />
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
                                stopColor="#9ca3af"
                                stopOpacity={0.25}
                            />
                            <stop
                                offset="100%"
                                stopColor="#9ca3af"
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
                        fill="#fff"
                        isAnimationActive={false}
                    />

                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="week"
                        tickFormatter={(label) => label.replace("2025-W", "W")}
                        stroke="#9ca3af"
                    />
                    <YAxis stroke="#9ca3af" domain={[0, "dataMax +40"]} hide />
                    <Line
                        type="monotone"
                        dataKey="total_effort"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={<CustomDot />}
                        activeDot={<CustomActiveDot />}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
