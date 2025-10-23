"use client";

import {
    BarChart,
    Bar,
    XAxis,
    CartesianGrid,
    ResponsiveContainer,
    YAxis,
    Cell,
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
        const existing = data.find((day) =>
            day.day.toLowerCase().startsWith(d.key.toLowerCase())
        );
        return existing
            ? { ...existing, label: d.label }
            : { day: d.key, total_effort: 0, label: d.label };
    });

    const minEffort = 2;
    const displayData = fullWeek.map((d) => ({
        ...d,
        total_effort: d.total_effort > 0 ? d.total_effort : minEffort,
        isEmpty: d.total_effort === 0,
    }));

    return (
        <div className="h-[180px] w-full transition-all duration-500 mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    key={weekId}
                    data={displayData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                    barCategoryGap="20%"
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="label"
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis hide domain={[0, 100]} />

                    <Bar
                        dataKey="total_effort"
                        radius={[4, 4, 0, 0]}
                        animationDuration={800}
                        animationEasing="ease-in-out"
                    >
                        {displayData.map((entry, index) => (
                            <Cell key={`bar-${index}`} fill={"#000000"} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
