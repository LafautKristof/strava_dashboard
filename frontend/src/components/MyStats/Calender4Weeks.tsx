"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activities, Activities4Weeks } from "@/app/types/activities4Weeks";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getTypeIcon } from "@/helpers/getTypeIcon";

const Calender4Weeks = ({
    activities4Weeks,
}: {
    activities4Weeks: Activities4Weeks[];
}) => {
    const router = useRouter();
    const [hoveredDate, setHoveredDate] = useState<string | null>(null);

    const days = ["M", "Tu", "W", "Th", "F", "Sa", "Su"];
    const types = ["Run", "Ride", "Workout", "Walk"];

    const typeColors: Record<string, string> = {
        Run: "#f97316",
        Ride: "#3b82f6",
        Workout: "#a855f7",
        Walk: "#22c55e",
    };

    function getDayIndex(dateStr: string) {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return -1;
        const day = d.getDay();
        return day === 0 ? 6 : day - 1;
    }

    function isSameDay(d1: Date, d2: Date) {
        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
        );
    }

    function formatDuration(seconds: number) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    }

    const today = new Date();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {days.map((day, i) => (
                        <TableHead
                            key={i}
                            className="text-center font-semibold"
                        >
                            {day}
                        </TableHead>
                    ))}
                    <TableHead className="text-center font-semibold p-1">
                        <div className="flex justify-center items-center gap-3">
                            {types.map((type, i) => (
                                <span key={i}>{getTypeIcon(type)}</span>
                            ))}
                        </div>
                    </TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {activities4Weeks.map((week, weekIndex) => {
                    const dayCells: Activities[][] = Array.from(
                        { length: 7 },
                        () => []
                    );

                    week.activities.forEach((activity) => {
                        const dayIndex = getDayIndex(activity.start_date_local);
                        if (dayIndex >= 0 && dayIndex < 7) {
                            dayCells[dayIndex].push(activity);
                        }
                    });

                    const typeTimes: Record<string, number> = {
                        Run: 0,
                        Ride: 0,
                        Workout: 0,
                        Walk: 0,
                    };

                    week.activities.forEach((a: Activities) => {
                        if (typeTimes[a.type] !== undefined) {
                            typeTimes[a.type] += a.moving_time ?? 0;
                        }
                    });

                    const totalTime = Object.values(typeTimes).reduce(
                        (a, b) => a + b,
                        0
                    );

                    const typePercentages =
                        totalTime > 0
                            ? Object.fromEntries(
                                  Object.entries(typeTimes).map(([k, v]) => [
                                      k,
                                      Math.round((v / totalTime) * 100),
                                  ])
                              )
                            : { Run: 0, Ride: 0, Workout: 0, Walk: 0 };

                    return (
                        <TableRow key={weekIndex}>
                            {dayCells.map((activities, dayIndex) => {
                                const weekStart = new Date(week.start);
                                const cellDate = new Date(weekStart);
                                cellDate.setDate(
                                    weekStart.getDate() + dayIndex
                                );

                                const dayOfMonth = cellDate.getDate();
                                const dateKey =
                                    cellDate.toLocaleDateString("sv-SE");
                                const isToday = isSameDay(cellDate, today);
                                const isHovered = hoveredDate === dateKey;

                                const hasActivities = activities.length > 0;
                                const showDayNumber =
                                    (isToday && !hoveredDate) || isHovered;

                                return (
                                    <TableCell
                                        key={dayIndex}
                                        className={`h-10 w-10 text-center align-middle transition-all duration-200 ${
                                            hasActivities
                                                ? "cursor-pointer hover:bg-orange-100"
                                                : ""
                                        }`}
                                        onMouseEnter={() =>
                                            setHoveredDate(dateKey)
                                        }
                                        onMouseLeave={() =>
                                            setHoveredDate(null)
                                        }
                                        onClick={() => {
                                            if (!hasActivities) return;

                                            if (activities.length === 1) {
                                                router.push(
                                                    `/activities/${activities[0].id}`
                                                );
                                            } else {
                                                router.push(
                                                    `/activities/day/${dateKey}`
                                                );
                                            }
                                        }}
                                        title={
                                            hasActivities
                                                ? `${activities.length} activiteit(en) op ${dateKey}`
                                                : undefined
                                        }
                                    >
                                        <div className="flex items-center justify-center flex-wrap gap-0.5">
                                            {showDayNumber ? (
                                                <span className="text-xs font-bold underline">
                                                    {dayOfMonth}
                                                </span>
                                            ) : hasActivities ? (
                                                activities.map((act, i) => (
                                                    <span
                                                        key={i}
                                                        className="inline-block w-2.5 h-2.5 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                typeColors[
                                                                    act.type
                                                                ] || "gray",
                                                        }}
                                                    ></span>
                                                ))
                                            ) : (
                                                <span className="inline-block w-2 h-2 rounded-full bg-gray-300"></span>
                                            )}
                                        </div>
                                    </TableCell>
                                );
                            })}

                            <TableCell className="align-middle w-40">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-6 flex-1 overflow-hidden border border-gray-300">
                                        {types.map((type) => (
                                            <div
                                                key={type}
                                                className="h-full transition-all duration-700 ease-in-out"
                                                style={{
                                                    width: `${typePercentages[type]}%`,
                                                    backgroundColor:
                                                        typeColors[type],
                                                }}
                                            ></div>
                                        ))}
                                    </div>

                                    <span className="text-sm text-black font-medium min-w-[45px] text-right">
                                        {formatDuration(totalTime)}
                                    </span>
                                </div>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

export default Calender4Weeks;
