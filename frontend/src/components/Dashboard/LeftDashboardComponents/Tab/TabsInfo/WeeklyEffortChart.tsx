"use client";

import {
    ComposedChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Area,
} from "recharts";
import { Card } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import type { Activities8Weeks } from "@/app/types/activities12Weeks";

function getCurrentISOWeek() {
    const now = new Date();
    const year = now.getFullYear();
    const firstJan = new Date(year, 0, 1);
    const days = Math.floor((now.getTime() - firstJan.getTime()) / 86400000);
    const week = Math.ceil((days + firstJan.getDay() + 1) / 7);
    return `${year}-W${String(week).padStart(2, "0")}`;
}

type CustomDotProps = {
    cx?: number;
    cy?: number;
    payload?: {
        total_effort: number;
        minZone: number;
        maxZone: number;
    };
};

type CustomActiveDotProps = CustomDotProps & {
    viewBox?: { width?: number; height?: number };
};

function getZoneColor(total: number, min: number, max: number) {
    if (total < min) return "#c4b5fd";
    if (total > max) return "#ef4444";
    return "#a855f7";
}

export default function WeeklyEffortChart({
    data,
    onHoverWeek,
}: {
    data: Activities8Weeks[];
    onHoverWeek?: (week: Activities8Weeks | null) => void;
}) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setIsVisible(true), 50);
        return () => clearTimeout(timeout);
    }, []);

    const completeData = useMemo(() => {
        if (!data?.length) return [];

        const currentWeek = getCurrentISOWeek();
        const hasCurrentWeek = data.some((w) => w.week === currentWeek);

        if (!hasCurrentWeek) {
            return [
                ...data,
                {
                    week: currentWeek,
                    total_effort: 0,
                    activities: [],
                },
            ];
        }
        return data;
    }, [data]);

    const chartData = useMemo(() => {
        if (!completeData.length) return [];

        const total = completeData.reduce(
            (sum, w) => sum + (w.total_effort || 0),
            0
        );
        const avg = total / completeData.length;

        return completeData.map((w, i, arr) => {
            const prev = arr.slice(Math.max(0, i - 3), i);
            const base =
                prev.length > 0
                    ? prev.reduce((s, p) => s + p.total_effort, 0) / prev.length
                    : avg;

            return {
                ...w,
                weekIndex: i + 1,
                minZone: base * 0.8,
                maxZone: base * 1.2,
            };
        });
    }, [completeData]);

    if (!chartData.length) {
        return (
            <Card className="p-6 text-center text-muted-foreground">
                No data for the last 8 weeks
            </Card>
        );
    }

    const CustomDot = ({ cx, cy, payload }: CustomDotProps) => {
        if (typeof cx !== "number" || typeof cy !== "number" || !payload)
            return <g />;

        const { total_effort, minZone, maxZone } = payload;
        const color = getZoneColor(total_effort, minZone, maxZone);

        return (
            <g key={`${cx}-${cy}`}>
                <circle
                    cx={cx}
                    cy={cy}
                    r={6}
                    fill={color}
                    stroke="#fff"
                    strokeWidth={2}
                    style={{ transition: "all 0.2s ease" }}
                />
            </g>
        );
    };

    const CustomActiveDot = ({ cx, cy, viewBox }: CustomActiveDotProps) => {
        if (typeof cx !== "number" || typeof cy !== "number") return <g />;

        return (
            <g>
                <line
                    x1={cx}
                    x2={cx}
                    y1={cy}
                    y2={viewBox?.height || 320}
                    stroke="#9ca3af"
                    strokeDasharray="4 2"
                    strokeWidth={1.5}
                />
                <circle
                    cx={cx}
                    cy={cy}
                    r={8}
                    fill="#2563eb"
                    stroke="#fff"
                    strokeWidth={2}
                />
            </g>
        );
    };

    return (
        <div className="w-full h-[320px] flex items-center justify-center">
            {isVisible && (
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={chartData}
                        margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
                        onMouseMove={(state) => {
                            const week = state?.activePayload?.[0]?.payload;
                            if (week) onHoverWeek?.(week);
                        }}
                        onMouseLeave={() => onHoverWeek?.(null)}
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
                            tickFormatter={(label) =>
                                label.replace("2025-W", "W")
                            }
                            stroke="#9ca3af"
                        />
                        <YAxis stroke="#9ca3af" domain={[0, 300]} hide />
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
            )}
        </div>
    );
}
