"use client";

import { useEffect, useState } from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table";
import { Stats } from "@/src/types/stats";
import LoaderComponent from "@/src/components/LoaderComponent";

const TabsSport = ({ tab }: { tab: string }) => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [selectedYear, setSelectedYear] = useState<number>(
        new Date().getFullYear(),
    );
    const [loading, setLoading] = useState(true);
    console.log("stats", stats);
    useEffect(() => {
        async function fetchStats() {
            try {
                setLoading(true);
                setStats(null);
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/my_stats?date=${selectedYear}&type=${tab}`,
                    { cache: "force-cache" },
                );
                const data = await res.json();
                setStats(data);
            } catch (err) {
                console.error("Error fetching stats:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, [selectedYear, tab]);

    const years = Array.from(
        { length: 5 },
        (_, i) => new Date().getFullYear() - i,
    );

    return (
        <div className="space-y-6 text-sm sm:text-base">
            {" "}
            <div className="relative min-h-[650px]">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-10 rounded-md">
                        <LoaderComponent text="Loading..." />
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Statistics
                    </h3>
                </div>
                <div className="relative min-h-[650px]">
                    <Table className="border border-gray-200 rounded-md cursor-default">
                        <TableHeader>
                            <TableRow className="bg-gray-100">
                                <TableHead className="text-left">
                                    Metric
                                </TableHead>
                                <TableHead className="text-center">
                                    Value
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            <TableRow>
                                <TableCell
                                    colSpan={2}
                                    className="font-semibold text-gray-800 bg-orange-50"
                                >
                                    Last 4 Weeks
                                </TableCell>
                            </TableRow>
                            <TableRow className=" hover:bg-orange-200">
                                <TableCell>Activities / Week</TableCell>
                                <TableCell className="text-center text-orange-600 font-medium">
                                    {stats?.last_4_weeks.activities_per_week}
                                </TableCell>
                            </TableRow>
                            <TableRow className=" hover:bg-orange-200">
                                <TableCell>Avg Distance / Week</TableCell>
                                <TableCell className="text-center text-orange-600 font-medium">
                                    {
                                        stats?.last_4_weeks
                                            .avg_distance_per_week_km
                                    }{" "}
                                    km
                                </TableCell>
                            </TableRow>
                            <TableRow className=" hover:bg-orange-200">
                                <TableCell>Avg Time / Week</TableCell>
                                <TableCell className="text-center text-orange-600 font-medium">
                                    {stats?.last_4_weeks.avg_time_per_week ||
                                        "-"}
                                </TableCell>
                            </TableRow>
                            <TableRow className=" hover:bg-orange-200">
                                <TableCell>Elev Gain / Week</TableCell>
                                <TableCell className="text-center text-orange-600 font-medium">
                                    {
                                        stats?.last_4_weeks
                                            .avg_elev_gain_per_week_m
                                    }{" "}
                                    m
                                </TableCell>
                            </TableRow>

                            <TableRow className=" hover:bg-orange-200">
                                <TableCell
                                    colSpan={2}
                                    className="font-semibold text-gray-800 bg-orange-50"
                                >
                                    Best Efforts
                                </TableCell>
                            </TableRow>
                            {stats?.best_efforts.map((effort) => (
                                <TableRow
                                    key={effort.label}
                                    className="hover:bg-orange-200"
                                >
                                    <TableCell>{effort.label}</TableCell>
                                    <TableCell className="text-center font-medium text-orange-600">
                                        {effort.time}
                                    </TableCell>
                                </TableRow>
                            ))}

                            <TableRow>
                                <TableCell
                                    colSpan={2}
                                    className="font-semibold text-gray-800 bg-orange-50"
                                >
                                    Highlights
                                </TableCell>
                            </TableRow>
                            <TableRow className=" hover:bg-orange-200">
                                <TableCell>Longest Ride(distance)</TableCell>
                                <TableCell className="text-center text-orange-600 font-medium">
                                    {stats?.longest_distance_km} km
                                </TableCell>
                            </TableRow>
                            <TableRow className=" hover:bg-orange-200">
                                <TableCell>Longest Ride(time)</TableCell>
                                <TableCell className="text-center text-orange-600 font-medium">
                                    {stats?.longest_time}
                                </TableCell>
                            </TableRow>
                            <TableRow className=" hover:bg-orange-200">
                                <TableCell>Total Elevation Climbed</TableCell>
                                <TableCell className="text-center text-orange-600 font-medium">
                                    {stats?.most_elevation_m} {"m"}
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell
                                    colSpan={2}
                                    className="font-semibold text-gray-800 bg-orange-50"
                                >
                                    <div className="flex items-center justify-between">
                                        <span>Selected Year</span>
                                        <select
                                            value={selectedYear}
                                            onChange={(e) =>
                                                setSelectedYear(
                                                    Number(e.target.value),
                                                )
                                            }
                                            className="border rounded-md p-1 text-sm bg-orang-100 hover:bg-orange-300 hover:text-white shadow-sm"
                                        >
                                            {years.map((y) => (
                                                <option key={y} value={y}>
                                                    {y}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow className=" hover:bg-orange-200">
                                <TableCell>Activities</TableCell>
                                <TableCell className="text-center text-orange-600 font-medium">
                                    {stats?.yearly.total_activities}
                                </TableCell>
                            </TableRow>
                            <TableRow className=" hover:bg-orange-200">
                                <TableCell>Distance</TableCell>
                                <TableCell className="text-center text-orange-600 font-medium">
                                    {stats?.yearly.total_distance_km} km
                                </TableCell>
                            </TableRow>
                            <TableRow className=" hover:bg-orange-200">
                                <TableCell>Time</TableCell>
                                <TableCell className="text-center text-orange-600 font-medium">
                                    {stats?.yearly.total_time}
                                </TableCell>
                            </TableRow>
                            <TableRow className=" hover:bg-orange-200">
                                <TableCell>Elev Gain</TableCell>
                                <TableCell className="text-center text-orange-600 font-medium">
                                    {stats?.yearly.avg_elev_gain_per_week_m}{" "}
                                    {"m"}
                                </TableCell>
                            </TableRow>

                            <TableRow className=" hover:bg-orange-200">
                                <TableCell
                                    colSpan={2}
                                    className="font-semibold text-gray-800 bg-orange-50"
                                >
                                    All-Time
                                </TableCell>
                            </TableRow>
                            <TableRow className=" hover:bg-orange-200">
                                <TableCell>Activities</TableCell>
                                <TableCell className="text-center text-orange-600 font-medium">
                                    {stats?.all_time?.total_activities ?? 0}
                                </TableCell>
                            </TableRow>
                            <TableRow className=" hover:bg-orange-200">
                                <TableCell>Distance</TableCell>
                                <TableCell className="text-center text-orange-600 font-medium">
                                    {stats?.all_time?.total_distance_km ?? 0} km
                                </TableCell>
                            </TableRow>
                            <TableRow className=" hover:bg-orange-200">
                                <TableCell>Time</TableCell>
                                <TableCell className="text-center text-orange-600 font-medium">
                                    {stats?.all_time?.total_time ?? "0h 0m"}
                                </TableCell>
                            </TableRow>
                            <TableRow className=" hover:bg-orange-200 ">
                                <TableCell>Elev Gain</TableCell>
                                <TableCell className="text-center text-orange-600 font-medium">
                                    {stats?.all_time?.total_elev_gain_m ?? 0} m
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default TabsSport;
