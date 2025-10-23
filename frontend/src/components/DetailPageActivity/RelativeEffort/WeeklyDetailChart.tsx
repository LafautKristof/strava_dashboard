"use client";
import * as React from "react";
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

type BarShapeProps = {
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
};

export default function WeeklyDetailChart({
    data,
    weekId,
}: {
    data: DayData[];
    weekId: number;
}) {
    if (!data?.length) return null;

    return (
        <div>
            <h2>Weekly Effort</h2>
            <div className="h-[180px] w-full transition-all duration-500">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        key={weekId}
                        data={data}
                        margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                        barCategoryGap="20%"
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="day"
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis hide />

                        <Bar
                            dataKey="total_effort"
                            fill="#000000"
                            radius={[4, 4, 0, 0]}
                            animationDuration={800}
                            animationEasing="ease-in-out"
                            shape={(props: unknown) => {
                                const { x, y, width, height, fill } =
                                    props as BarShapeProps;

                                const minHeight = 4;
                                const adjustedY =
                                    y + height - Math.max(height, minHeight);
                                const adjustedHeight = Math.max(
                                    height,
                                    minHeight
                                );

                                return (
                                    <rect
                                        x={x}
                                        y={adjustedY}
                                        width={width}
                                        height={adjustedHeight}
                                        fill={fill}
                                        rx={4}
                                        ry={4}
                                    />
                                );
                            }}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
