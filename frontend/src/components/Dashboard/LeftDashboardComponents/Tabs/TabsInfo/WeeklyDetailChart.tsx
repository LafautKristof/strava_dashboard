"use client";

import {
    BarChart,
    Bar,
    XAxis,
    CartesianGrid,
    ResponsiveContainer,
    YAxis,
} from "recharts";

type DayData = {
    day: string;
    total_effort: number;
};

export default function WeeklyDetailChart({
    data,
    weekId,
}: {
    data: DayData[];
    weekId: number;
}) {
    const orderedDays = [
        { key: "Mon", label: "M" },
        { key: "Tue", label: "T" },
        { key: "Wed", label: "W" },
        { key: "Thu", label: "T" },
        { key: "Fri", label: "F" },
        { key: "Sat", label: "S" },
        { key: "Sun", label: "S" },
    ];

    const fullWeek = orderedDays.map((d) => {
        const existing = data.find((day) => day.day === d.key);
        return {
            key: d.key,
            label: d.label,
            total_effort: existing?.total_effort ?? 0,
        };
    });

    const displayData = fullWeek.map((d) => {
        if (d.total_effort === 0) {
            return {
                ...d,
                total_effort: 2,
                isEmpty: true,
                fill: "#d1d5db",
            };
        }

        return {
            ...d,
            isEmpty: false,
            fill: "#000000",
        };
    });
    const minEffort = 2;
    const maxEffort = Math.max(...displayData.map((d) => d.total_effort));

    return (
        <div className="h-40 w-full mt-4 transition-all duration-500">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    key={weekId}
                    data={displayData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                    barCategoryGap="20%"
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="key"
                        interval={0}
                        tickLine={false}
                        axisLine={false}
                        tick={({ x, y, payload }) => {
                            const day = orderedDays.find(
                                (d) => d.key === payload.value,
                            );

                            return (
                                <text
                                    x={x}
                                    y={y}
                                    textAnchor="middle"
                                    fill="#6b7280"
                                    fontSize={12}
                                >
                                    {day?.label ?? ""}
                                </text>
                            );
                        }}
                    />

                    <YAxis hide domain={[0, Math.max(100, maxEffort + 10)]} />

                    <Bar
                        dataKey="total_effort"
                        radius={[4, 4, 0, 0]}
                        animationDuration={800}
                        animationEasing="ease-in-out"
                    ></Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
