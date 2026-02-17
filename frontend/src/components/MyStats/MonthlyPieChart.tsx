"use client";
import {
    ActivitiesCurrentMonth,
    ActivityType,
} from "@/src/types/activitiesCurrentMonth";
import { typeColors } from "@/src/lib/constants/typeColors";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";

const MonthlyPieChart = ({
    activitiesCurrentMonth,
}: {
    activitiesCurrentMonth: ActivitiesCurrentMonth[];
}) => {
    const [metric, setMetric] = useState<"moving_time" | "distance">(
        "moving_time",
    );
    const monthTotals: Record<ActivityType, number> = {
        Run: 0,
        Ride: 0,
        Workout: 0,
        Walk: 0,
    };

    activitiesCurrentMonth.forEach((day) => {
        day.activities.forEach((act) => {
            const type = act.type as ActivityType;

            monthTotals[type] += act.moving_time ?? 0;
        });
    });

    const pieData = useMemo(() => {
        const totals: Record<ActivityType, number> = {
            Run: 0,
            Ride: 0,
            Workout: 0,
            Walk: 0,
        };

        activitiesCurrentMonth.forEach((day) => {
            day.activities.forEach((act) => {
                const value =
                    metric === "moving_time"
                        ? (act.moving_time ?? 0)
                        : (act.distance ?? 0);

                totals[act.type as ActivityType] += value;
            });
        });

        return Object.entries(totals)
            .filter(([, value]) => value > 0)
            .map(([name, value]) => ({ name, value }));
    }, [activitiesCurrentMonth, metric]);
    const getButtonStyle = (value: "moving_time" | "distance") =>
        `px-4 py-2 rounded-md cursor-pointer transition-all duration-200
   ${
       metric === value
           ? "bg-orange-600 text-white border-2 border-orange-800 shadow-md scale-105"
           : "bg-orange-200 text-orange-900 border-2 border-transparent hover:bg-orange-300"
   }`;

    return (
        <div className="mt-8 h-64 w-full relative">
            <div className="flex justify-center gap-2 mb-4">
                <Button
                    onClick={() => setMetric("moving_time")}
                    className={getButtonStyle("moving_time")}
                >
                    Time
                </Button>

                <Button
                    onClick={() => setMetric("distance")}
                    className={getButtonStyle("distance")}
                >
                    Distance
                </Button>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={90}
                        innerRadius={50}
                        paddingAngle={3}
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={index} fill={typeColors[entry.name]} />
                        ))}
                    </Pie>

                    <Tooltip
                        formatter={(value: number) => {
                            if (metric === "moving_time") {
                                const hours = Math.floor(value / 3600);
                                const minutes = Math.floor((value % 3600) / 60);
                                return hours > 0
                                    ? `${hours}h ${minutes}m`
                                    : `${minutes}m`;
                            } else {
                                return `${(value / 1000).toFixed(1)} km`;
                            }
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
export default MonthlyPieChart;
