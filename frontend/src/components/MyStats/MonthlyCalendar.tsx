"use client";
import {
    Activities,
    ActivitiesCurrentMonth,
} from "@/app/types/activitiesCurrentMonth";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { buildMonthGrid } from "@/helpers/CalendarHelpers/buildMonthGrid";
import { typeColors } from "@/lib/constants/typeColors";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getTimeInHoursMinutes } from "@/helpers/formatDateAndTime";
import { getTypeIcon } from "@/helpers/getTypeIcon";
import { Button } from "../ui/button";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import LoaderComponent from "../LoaderComponent";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MonthlyCalendar = ({
    monthData,
    setMonthData,
    setLoading,
    loading,
}: {
    monthData: ActivitiesCurrentMonth[];
    setMonthData: (data: ActivitiesCurrentMonth[]) => void;
    setLoading: (loading: boolean) => void;
    loading: boolean;
}) => {
    const today = new Date();
    const router = useRouter();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    const [selectedActivities, setSelectedActivities] = useState<
        Activities[] | null
    >(null);
    const weeks = useMemo(() => {
        return buildMonthGrid(monthData, currentMonth, currentYear);
    }, [monthData, currentMonth, currentYear]);

    useEffect(() => {
        const controller = new AbortController();

        const fetchMonth = async () => {
            try {
                setLoading(true);

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/activities/month?year=${currentYear}&month=${currentMonth + 1}`,
                    { signal: controller.signal },
                );

                const json = await res.json();
                setMonthData(json);
            } catch (err: any) {
                if (err.name !== "AbortError") {
                    console.error(err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMonth();

        return () => controller.abort();
    }, [currentMonth, currentYear, setLoading, setMonthData]);

    const handleClick = (day: any) => {
        if (!day || day.activities.length === 0) return;
        if (day.activities.length == 1) {
            router.push(`/activities/${day.activities[0].id}`);
        } else {
            setSelectedActivities(day.activities);
        }
    };
    function isSameDay(d1: Date, d2: Date) {
        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
        );
    }

    return (
        <div className="relative w-full max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl z-10">
                    <LoaderComponent text="Loading month..." />
                </div>
            )}
            {/* ---------------- HEADER ---------------- */}
            <div className="flex justify-between items-center mb-6">
                <Button
                    className="px-3 py-1 rounded-md bg-orange-500 hover:text-white  hover:bg-orange-400 cursor-pointer transition"
                    onClick={() => {
                        if (currentMonth === 0) {
                            setCurrentMonth(11);
                            setCurrentYear((y) => y - 1);
                        } else {
                            setCurrentMonth((m) => m - 1);
                        }
                    }}
                >
                    <FaArrowLeft />
                </Button>

                <h2 className="text-xl font-semibold tracking-wide cursor-default">
                    {new Date(currentYear, currentMonth).toLocaleString(
                        "default",
                        {
                            month: "long",
                            year: "numeric",
                        },
                    )}
                </h2>

                <Button
                    className="px-3 py-1 rounded-md bg-orange-500 hover:text-white  hover:bg-orange-400 cursor-pointer transition"
                    onClick={() => {
                        if (currentMonth === 11) {
                            setCurrentMonth(0);
                            setCurrentYear((y) => y + 1);
                        } else {
                            setCurrentMonth((m) => m + 1);
                        }
                    }}
                >
                    <FaArrowRight />{" "}
                </Button>
            </div>

            {/* ---------------- WEEKDAYS ---------------- */}
            <div className="grid grid-cols-7  text-sm font-medium text-gray-500 cursor-default">
                {DAYS.map((day) => (
                    <div key={day} className="text-center">
                        {day}
                    </div>
                ))}
            </div>

            {/* ---------------- DAYS GRID ---------------- */}
            <div
                className={`grid grid-cols-7 gap-1 transition-opacity duration-200 cursor-default ${loading ? "opacity-40" : "opacity-100"}`}
            >
                {weeks.flat().map((day, index) => {
                    if (!day) return <div key={index} className="h-10" />;

                    const cellDate = new Date(day.date);
                    const isToday = isSameDay(cellDate, today);
                    const isFuture = cellDate > today;
                    const hasActivities = day.activities.length > 0;

                    return (
                        <div
                            key={index}
                            onClick={() => handleClick(day)}
                            className={`
              h-10 rounded-xl p-2 flex flex-col items-center justify-start
              transition-all duration-200 cursor-default">
              ${hasActivities ? "cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/20" : ""}
              ${isFuture ? "opacity-40" : ""}
            `}
                        >
                            {/* Day number */}
                            <div
                                className={`
                w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold
                ${isToday ? "bg-orange-500 text-white" : "text-gray-700 dark:text-gray-300"}
              `}
                            >
                                {cellDate.getDate()}
                            </div>

                            {/* Activity dots */}
                            <div className="flex gap-1  flex-wrap justify-center">
                                {hasActivities
                                    ? day.activities
                                          .slice(0, 4)
                                          .map((act: Activities) => (
                                              <span
                                                  key={act.id}
                                                  className="w-2 h-2 rounded-full"
                                                  style={{
                                                      backgroundColor:
                                                          typeColors[
                                                              act.type
                                                          ] ?? "#9ca3af",
                                                  }}
                                              />
                                          ))
                                    : null}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ---------------- DIALOG ---------------- */}
            <Dialog
                open={!!selectedActivities}
                onOpenChange={() => setSelectedActivities(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Select an activity</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-2 mt-4">
                        {selectedActivities?.map((act) => (
                            <div
                                key={act.id}
                                className="p-3 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex justify-between items-center transition"
                                onClick={() => {
                                    setSelectedActivities(null);
                                    router.push(`/activities/${act.id}`);
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">
                                        {getTypeIcon(act.type, "large")}
                                    </span>
                                    <span className="font-medium">
                                        {act.name}
                                    </span>
                                </div>

                                <span className="text-sm text-gray-500">
                                    {getTimeInHoursMinutes(act.moving_time)}
                                </span>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
export default MonthlyCalendar;
