"use client";

import { useState, useMemo, useEffect } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    CartesianGrid,
    Tooltip,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { OverallChartData } from "@/app/types/overallChart";
import { Activities } from "@/app/types/activities";
import Link from "next/link";
import { getTypeIcon } from "@/helpers/getTypeIcon";
import { CategoricalChartState } from "recharts/types/chart/types";
type ChartEntry = {
    name: string;
    time: number;
    distance: number;
    elev: number;
};
export default function MyOverallChart() {
    const [data, setData] = useState<OverallChartData | null>(null);
    const [loading, setLoading] = useState(true);
    const [metric, setMetric] = useState<"time" | "distance" | "elev">(
        "distance"
    );
    const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
    const [activities, setActivities] = useState<Activities[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/overall_chart`,
                    {
                        cache: "no-cache",
                    }
                );
                const json: OverallChartData = await res.json();

                setData(json);
            } catch (err) {
                console.error("❌ Fout bij laden data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredData = useMemo(() => {
        if (!data) return [];
        const arr = period === "weekly" ? data.weekly : data.monthly;
        return arr
            .filter((d) => d.year === year)
            .map((d) => ({
                name: d.label,
                time: d.totalTime,
                distance: d.totalDistance,
                elev: d.totalElev,
            }))
            .reverse();
    }, [data, year, period]);
    const metricLabel = {
        time: "Time (h)",
        distance: "Distance (km)",
        elev: "Elevation (m)",
    }[metric];
    if (loading) {
        return (
            <div className="w-full min-w-2/3 h-[350px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl">
                <p className="text-gray-500">Loading chart...</p>
            </div>
        );
    }
    const handleBarClick = async (entry: ChartEntry) => {
        const label = entry.name;
        console.log(label);
        if (!label) return;
        setSelectedLabel(label);

        try {
            const res = await fetch(
                `${
                    process.env.NEXT_PUBLIC_API_URL
                }/activities_by_period?type=${period}&label=${encodeURIComponent(
                    label
                )}&year=${year}`
            );
            const json = await res.json();

            setActivities(json);
        } catch (err) {
            console.error("Failed to fetch activities:", err);
        }
    };
    return (
        <div className="w-full  mx-auto bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                <div className="flex gap-2">
                    {["time", "distance", "elev"].map((m) => (
                        <Button
                            key={m}
                            variant={metric === m ? "default" : "outline"}
                            onClick={() => {
                                setMetric(m as "time" | "distance" | "elev");
                            }}
                        >
                            {m === "time"
                                ? "Time"
                                : m === "distance"
                                ? "Distance"
                                : "Height"}
                        </Button>
                    ))}
                </div>

                <div className="flex gap-2">
                    {["weekly", "monthly"].map((p) => (
                        <Button
                            key={p}
                            variant={period === p ? "default" : "outline"}
                            onClick={() => setPeriod(p as "weekly" | "monthly")}
                        >
                            {p === "weekly" ? "Weekly" : "Monthly"}
                        </Button>
                    ))}
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            {year} <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {Array.from(
                            { length: new Date().getFullYear() - 2021 + 1 },
                            (_, i) => 2021 + i
                        ).map((y) => (
                            <DropdownMenuItem
                                key={y}
                                onClick={() => setYear(y)}
                            >
                                {y}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="w-full h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={filteredData}
                        margin={{ top: 0, right: 0, left: -30, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis
                            label={{
                                value: metricLabel,
                                angle: -90,
                                position: "insideLeft",
                                className: "hidden sm:block",
                            }}
                        />
                        <Tooltip
                            formatter={(value: number, name: string) => {
                                const num = Number(value) || 0;
                                if (name === "distance")
                                    return [`${num.toFixed(1)} km`, "Distance"];
                                if (name === "time")
                                    return [`${num.toFixed(1)} h`, "Time"];
                                if (name === "elev")
                                    return [`${Math.round(num)} m`, "Height"];
                                return [value, name];
                            }}
                            labelFormatter={(label) => ` ${label}`}
                        />
                        <Bar
                            dataKey={metric}
                            radius={[6, 6, 0, 0]}
                            onClick={({ payload }: { payload: ChartEntry }) =>
                                handleBarClick(payload)
                            }
                            cursor="pointer"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {selectedLabel ? (
                <div className="mt-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3">
                        Activities in {selectedLabel} ({activities.length})
                    </h3>

                    {activities.length === 0 ? (
                        <p className="text-sm text-gray-500">
                            No activities found
                        </p>
                    ) : (
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {activities
                                .map((a) => (
                                    <Link
                                        href={`/activities/${a.id}`}
                                        key={a.id}
                                        className="py-2 flex justify-between text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-2 transition-colors"
                                    >
                                        {" "}
                                        <div className="flex items-start gap-2">
                                            <span>{getTypeIcon(a.type)}</span>
                                            <span className="font-medium">
                                                {a.name}
                                            </span>
                                        </div>
                                        <span className="text-gray-500">
                                            {(a.distance / 1000).toFixed(1)} km
                                            — {(a.moving_time / 60).toFixed(0)}{" "}
                                            min
                                        </span>
                                    </Link>
                                ))
                                .reverse()}
                        </ul>
                    )}
                </div>
            ) : (
                <div className="mt-6 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center text-gray-500 text-sm">
                    <p>Click on a bar in the chart to view your activities.</p>
                </div>
            )}
        </div>
    );
}
