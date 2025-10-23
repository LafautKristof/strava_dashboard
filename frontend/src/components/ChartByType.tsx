"use client";
import { IoTriangle } from "react-icons/io5";
import {
    BarChart,
    Bar,
    XAxis,
    CartesianGrid,
    ResponsiveContainer,
    YAxis,
    Cell,
} from "recharts";
import { useMemo } from "react";

type DayData = {
    day: string;
    hasActivity: boolean;
};

export default function Chart({ data }: { data: DayData[] }) {
    const today = useMemo(() => {
        return new Date()
            .toLocaleDateString("en-US", { weekday: "short" })
            .slice(0, 3);
    }, []);

    const displayData = data.map((d) => ({
        ...d,
        value: d.hasActivity ? 10 : 2,
    }));

    return (
        <div className="h-[180px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={displayData}
                    margin={{ top: 10, bottom: 30 }}
                    barCategoryGap="20%"
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="day"
                        tick={({ x, y, payload }) => {
                            const day = payload.value;
                            const label = day.charAt(0);
                            const isToday = day === today;

                            return (
                                <g transform={`translate(${x},${y})`}>
                                    <text
                                        x={0}
                                        y={10}
                                        textAnchor="middle"
                                        fill={isToday ? "#a855f7" : "#9ca3af"}
                                        fontSize={13}
                                    >
                                        {label}
                                    </text>

                                    {isToday && (
                                        <foreignObject
                                            x={-6}
                                            y={14}
                                            width={14}
                                            height={14}
                                        >
                                            <div
                                                style={{
                                                    color: "#FFA500",
                                                    fontSize: "14px",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <IoTriangle />
                                            </div>
                                        </foreignObject>
                                    )}
                                </g>
                            );
                        }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis hide domain={[0, 15]} />
                    <Bar
                        dataKey="value"
                        radius={[4, 4, 0, 0]}
                        animationDuration={600}
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
