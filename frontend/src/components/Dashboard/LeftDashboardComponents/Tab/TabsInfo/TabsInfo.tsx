"use client";

import { Activities, Activities8Weeks } from "@/app/types/activities12Weeks";
import { useEffect, useMemo, useState } from "react";
import WeeklyEffortChartWrapper from "./WeeklyEffortChartWrapper";
import WeeklyDetailChart from "./WeeklyDetailChart";
import WeeklyDetailInfo from "./WeeklyDetailInfo";

type WeekDay = { day: string; total_effort: number };

function getCurrentISOWeek() {
    const now = new Date();
    const year = now.getFullYear();
    const week = Math.ceil(
        ((now.getTime() - new Date(year, 0, 1).getTime()) / 86400000 +
            new Date(year, 0, 1).getDay() +
            1) /
            7
    );
    return `${year}-W${String(week).padStart(2, "0")}`;
}

export function TabsInfo({ data }: { data: Activities8Weeks[] }) {
    const currentWeek = getCurrentISOWeek();

    const completeData = useMemo(() => {
        const hasCurrent = data.some((w) => w.week === currentWeek);
        return hasCurrent
            ? data
            : [...data, { week: currentWeek, total_effort: 0, activities: [] }];
    }, [data, currentWeek]);

    const [hoveredWeek, setHoveredWeek] = useState<Activities8Weeks | null>(
        null
    );

    useEffect(() => {
        if (!hoveredWeek && completeData.length > 0) {
            setHoveredWeek(
                completeData.find((w) => w.week === currentWeek) ??
                    completeData[completeData.length - 1]
            );
        }
    }, [completeData, hoveredWeek, currentWeek]);

    const dailyData = useMemo(() => {
        const orderedDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

        if (!hoveredWeek?.activities?.length) {
            return orderedDays.map((d) => ({ day: d, total_effort: 0 }));
        }

        const days = hoveredWeek.activities.reduce(
            (acc: WeekDay[], act: Activities) => {
                const date = new Date(act.start_date_local);
                const day = date.toLocaleDateString("en-US", {
                    weekday: "short",
                });
                const existing = acc.find((d) => d.day === day);
                if (existing) existing.total_effort += act.suffer_score ?? 0;
                else acc.push({ day, total_effort: act.suffer_score ?? 0 });
                return acc;
            },
            []
        );

        return orderedDays.map((day) => {
            const found = days.find((d) => d.day.startsWith(day));
            return found || { day, total_effort: 0 };
        });
    }, [hoveredWeek]);

    return (
        <>
            <div className="mb-6">
                <h1 className="text-lg font-semibold">
                    {hoveredWeek
                        ? hoveredWeek.week === getCurrentISOWeek()
                            ? "THIS WEEK"
                            : `Week ${hoveredWeek.week.split("-W")[1]}`
                        : "THIS WEEK"}
                </h1>

                {!hoveredWeek || hoveredWeek.activities.length === 0 ? (
                    <div className="mt-1">
                        <h2 className="text-sm text-gray-400 font-medium">
                            Hover over a week to see its activities
                        </h2>
                    </div>
                ) : hoveredWeek.total_effort > 160 ? (
                    <div className="mt-1">
                        <h2 className="text-sm text-red-600 font-semibold">
                            Above weekly range
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            This was a significant increase compared to previous
                            weeks.
                        </p>
                    </div>
                ) : hoveredWeek.total_effort >= 80 ? (
                    <div className="mt-1">
                        <h2 className="text-sm text-purple-700 font-semibold">
                            Consistent training
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            This was a good level for building or maintaining
                            fitness.
                        </p>
                    </div>
                ) : (
                    <div className="mt-1">
                        <h2 className="text-sm text-purple-400 font-semibold">
                            Below weekly range
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            These kinds of weeks can be good for active
                            recovery.
                        </p>
                    </div>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <WeeklyDetailChart
                    key={hoveredWeek?.week || "current"}
                    data={dailyData}
                    weekId={
                        hoveredWeek
                            ? completeData.indexOf(hoveredWeek)
                            : completeData.length - 1
                    }
                />
                <WeeklyDetailInfo data={hoveredWeek} />
            </div>

            <WeeklyEffortChartWrapper
                data={completeData}
                onHoverWeek={(week) => {
                    setHoveredWeek(
                        week ?? {
                            week: currentWeek,
                            total_effort: 0,
                            activities: [],
                        }
                    );
                }}
            />
        </>
    );
}
