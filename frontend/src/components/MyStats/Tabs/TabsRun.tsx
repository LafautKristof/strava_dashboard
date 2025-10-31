"use client";

import { useEffect, useState } from "react";
import { BestEfforts, Stats } from "@/app/types/stats";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const TabsRun = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [selectedYear, setSelectedYear] = useState<number>(
        new Date().getFullYear()
    );

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/my_stats?date=${selectedYear}&type=run`
                );
                const data = await res.json();
                console.log(data);
                setStats(data);
            } catch (err) {
                console.error("Error fetching stats:", err);
            }
        }
        fetchStats();
    }, [selectedYear]);

    const years = Array.from(
        { length: 5 },
        (_, i) => new Date().getFullYear() - i
    );

    if (!stats)
        return (
            <div className="flex justify-center items-center text-gray-500 min-h-[300px]">
                Loading...
            </div>
        );

    return (
        <div className="space-y-6 text-sm sm:text-base">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                    Run Statistics
                </h3>
            </div>

            <Table className="border border-gray-200 rounded-md">
                <TableHeader>
                    <TableRow className="bg-gray-100">
                        <TableHead className="text-left">Metric</TableHead>
                        <TableHead className="text-center">Value</TableHead>
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
                    <TableRow>
                        <TableCell>Activities / Week</TableCell>
                        <TableCell className="text-center text-orange-600 font-medium">
                            {stats.last_4_weeks.activities_per_week}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Avg Distance / Week</TableCell>
                        <TableCell className="text-center text-orange-600 font-medium">
                            {stats.last_4_weeks.avg_distance_per_week_km} km
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Avg Time / Week</TableCell>
                        <TableCell className="text-center text-orange-600 font-medium">
                            {stats.last_4_weeks.avg_time_per_week}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Elev Gain / Week</TableCell>
                        <TableCell className="text-center text-orange-600 font-medium">
                            {stats.last_4_weeks.avg_elev_gain_per_week_m} m
                        </TableCell>
                    </TableRow>

                    {stats.best_efforts && (
                        <>
                            <TableRow>
                                <TableCell
                                    colSpan={2}
                                    className="font-semibold text-gray-800 bg-orange-50"
                                >
                                    Best Efforts
                                </TableCell>
                            </TableRow>
                            {stats.best_efforts.map((effort: BestEfforts) => (
                                <TableRow key={effort.label}>
                                    <TableCell>{effort.label}</TableCell>
                                    <TableCell className="text-center font-medium text-orange-600">
                                        {effort.time}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </>
                    )}

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
                                        setSelectedYear(Number(e.target.value))
                                    }
                                    className="border rounded-md p-1 text-sm bg-white shadow-sm"
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
                    <TableRow>
                        <TableCell>Activities</TableCell>
                        <TableCell className="text-center text-orange-600 font-medium">
                            {stats.yearly.total_activities}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Distance</TableCell>
                        <TableCell className="text-center text-orange-600 font-medium">
                            {stats.yearly.total_distance_km} km
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Time</TableCell>
                        <TableCell className="text-center text-orange-600 font-medium">
                            {stats.yearly.total_time}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Elev Gain</TableCell>
                        <TableCell className="text-center text-orange-600 font-medium">
                            {stats.yearly.avg_elev_gain_per_week_m} m
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell
                            colSpan={2}
                            className="font-semibold text-gray-800 bg-orange-50"
                        >
                            All-Time
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Activities</TableCell>
                        <TableCell className="text-center text-orange-600 font-medium">
                            {stats.all_time?.total_activities ?? 0}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Distance</TableCell>
                        <TableCell className="text-center text-orange-600 font-medium">
                            {stats.all_time?.total_distance_km ?? 0} km
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Time</TableCell>
                        <TableCell className="text-center text-orange-600 font-medium">
                            {stats.all_time?.total_time ?? "0h 0m"}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Elev Gain</TableCell>
                        <TableCell className="text-center text-orange-600 font-medium">
                            {stats.all_time?.total_elev_gain_m ?? 0} m
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
};

export default TabsRun;
