"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
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

import Link from "next/link";

import { OverallChartData } from "@/types/overAllChart";
import { Activity } from "@/types/activity";
import LoaderComponent from "../LoaderComponent";
import ActivitieCardSmall from "../ActivitieCardSmall";
type ChartEntry = {
    name: string;
    time: number;
    distance: number;
    elev: number;
};

type Metric = "time" | "distance" | "elev";
type Period = "weekly" | "monthly";
export default function MyOverallChart() {
    const currentYear = new Date().getFullYear();
    const [data, setData] = useState<OverallChartData | null>(null);
    const [activitiesLoading, setActivitiesLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [metric, setMetric] = useState<Metric>("distance");
    const [period, setPeriod] = useState<Period>("weekly");
    const [year, setYear] = useState<number>(currentYear);
    const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/overall_chart`,
                    {
                        cache: "no-cache",
                    },
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
        console.log("1", data);
        const source = period === "weekly" ? data.weekly : data.monthly;
        return source
            .filter((d) => d.year === year)
            .map((d) => ({
                name: d.label,
                time: d.totalTime,
                distance: d.totalDistance,
                elev: d.totalElev,
            }));
    }, [data, year, period]);

    const handleBarClick = useCallback(
        async (entry: ChartEntry) => {
            if (!entry?.name) return;
            setSelectedLabel(entry.name);
            setActivitiesLoading(true);

            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/activities_by_period?type=${period}&label=${encodeURIComponent(entry.name)}&year=${year}`,
                    {
                        cache: "no-cache",
                    },
                );
                const json = await res.json();
                setActivities(json.reverse());
            } catch (err) {
                console.error("❌ Fout bij laden data:", err);
            } finally {
                setActivitiesLoading(false);
            }
        },
        [period, year],
    );

    const metricLabelMap: Record<Metric, string> = {
        time: "Time (h)",
        distance: "Distance (km)",
        elev: "Elevation (m)",
    };

    const metricButtonLabel: Record<Metric, string> = {
        time: "Time",
        distance: "Distance",
        elev: "Height",
    };

    return (
        <div className="w-full mx-auto bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                {/* Metric buttons */}
                <div className="flex gap-2">
                    {(Object.keys(metricButtonLabel) as Metric[]).map((m) => (
                        <Button
                            key={m}
                            variant={metric === m ? "default" : "outline"}
                            onClick={() => setMetric(m)}
                            className={`px-4 py-2 transition-all duration-200 rounded-md  cursor-pointer ${
                                metric === m
                                    ? "bg-orange-600 text-white shadow-md hover:bg-orange-600"
                                    : "bg-orange-200 text-orange-900 hover:bg-orange-300 hover:text-white"
                            }`}
                        >
                            {metricButtonLabel[m]}
                        </Button>
                    ))}
                </div>

                {/* Period buttons */}
                <div className="flex gap-2">
                    {(["weekly", "monthly"] as Period[]).map((p) => (
                        <Button
                            key={p}
                            variant={period === p ? "default" : "outline"}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-2 transition-all duration-200 rounded-md cursor-pointer ${
                                period === p
                                    ? "bg-orange-600 text-white shadow-md hover:bg-orange-600"
                                    : "bg-orange-200 text-orange-900 hover:bg-orange-300 hover:text-white"
                            }`}
                        >
                            {p === "weekly" ? "Weekly" : "Monthly"}
                        </Button>
                    ))}
                </div>

                {/* Year dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="flex items-center gap-2 cursor-pointer bg-orange-200 hover:bg-orange-300 text-orange-900 rounded-md px-4 py-2"
                        >
                            {year} <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="
    cursor-pointer
    bg-orange-100
    focus:bg-orange-300
    data-[highlighted]:bg-orange-300
    data-[state=checked]:bg-orange-500
    data-[state=checked]:text-white
  "
                    >
                        {Array.from(
                            { length: currentYear - 2021 + 1 },
                            (_, i) => 2021 + i,
                        )
                            .reverse()
                            .map((y) => (
                                <DropdownMenuItem
                                    key={y}
                                    onClick={() => setYear(y)}
                                    className="hover:bg-orange-600 hover:text-white"
                                >
                                    {y}
                                </DropdownMenuItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="w-full h-[350px]">
                <ResponsiveContainer>
                    <BarChart
                        data={filteredData}
                        margin={{ top: 0, right: 0, left: -30, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis
                            label={{
                                value: metricLabelMap[metric],
                                angle: -90,
                                position: "insideLeft",
                                className: "hidden sm:block",
                            }}
                        />
                        <Tooltip
                            cursor={{ fill: "rgb(249,115,22,0.15" }}
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
                        />
                        <Bar
                            dataKey={metric}
                            radius={[6, 6, 0, 0]}
                            cursor="pointer"
                            onClick={({ payload }) =>
                                handleBarClick(payload as ChartEntry)
                            }
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg min-h-[120px] relative">
                {activitiesLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <LoaderComponent text="Loading activities..." />
                    </div>
                ) : selectedLabel ? (
                    <>
                        <h3 className="font-semibold text-lg mb-3">
                            Activities in {selectedLabel} ({activities.length})
                        </h3>

                        {activities.length === 0 ? (
                            <p className="text-sm text-gray-500">
                                No activities found
                            </p>
                        ) : (
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {activities.map((a) => (
                                    <Link
                                        key={a.id}
                                        href={`/activities/${a.id}`}
                                        className="py-2 flex justify-between text-sm hover:bg-orange-100  rounded-md px-2 transition-colors"
                                    >
                                        <ActivitieCardSmall activities={a} />
                                    </Link>
                                ))}
                            </ul>
                        )}
                    </>
                ) : (
                    <p className="text-center text-sm text-gray-500">
                        Click on a bar in the chart to view your activities.
                    </p>
                )}
            </div>
        </div>
    );
}
