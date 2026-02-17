"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import WeeklyEffortChartWrapper from "./WeeklyEffortChartWrapper";
import WeeklyDetailChart from "./WeeklyDetailChart";
import WeeklyDetailInfo from "./WeeklyDetailInfo";
import { getCurrentISOWeek } from "@/helpers/getCurrentWeek";
import { ActivitiesGroupedByWeek } from "@/app/types/activitiesGroupedByWeek";

type WeekDay = { day: string; total_effort: number };

export function TabsInfo({ data }: { data: ActivitiesGroupedByWeek[] }) {
    const [hoveredWeek, setHoveredWeek] =
        useState<ActivitiesGroupedByWeek | null>(null);
    const lastValidWeek = useRef<ActivitiesGroupedByWeek | null>(null);
    const currentWeek = getCurrentISOWeek();

    useEffect(() => {
        if (!data.length) return;
        const current =
            data.find((w) => w.week === currentWeek) ??
            [...data].reverse().find((w) => w.activities.length > 0);
        if (!current) return;
        lastValidWeek.current = current;
        setHoveredWeek((prev) => prev ?? current);
    }, [data, currentWeek]);

    const handleHoverWeek = useCallback(
        (week: ActivitiesGroupedByWeek | null) => {
            if (week) {
                lastValidWeek.current = week;
                setHoveredWeek(week); // 🔥 DIT ontbrak
            } else {
                setHoveredWeek(lastValidWeek.current);
            }
        },
        [],
    );

    const dailyData = useMemo(() => {
        const orderedDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

        if (!hoveredWeek?.activities?.length) {
            return orderedDays.map((day) => ({ day, total_effort: 0 }));
        }

        const weekStart = new Date(hoveredWeek.start); // maandag 00:00 UTC

        const totals = hoveredWeek.activities.reduce<WeekDay[]>((acc, act) => {
            if (!act.start_date_local) return acc;

            const actDate = new Date(act.start_date_local);

            // verschil in dagen t.o.v. weekstart
            const diffDays = Math.floor(
                (actDate.getTime() - weekStart.getTime()) /
                    (1000 * 60 * 60 * 24),
            );

            if (diffDays < 0 || diffDays > 6) return acc;

            const day = orderedDays[diffDays];

            const existing = acc.find((d) => d.day === day);
            if (existing) {
                existing.total_effort += act.suffer_score ?? 0;
            } else {
                acc.push({ day, total_effort: act.suffer_score ?? 0 });
            }

            return acc;
        }, []);

        return orderedDays.map(
            (day) =>
                totals.find((d) => d.day === day) ?? { day, total_effort: 0 },
        );
    }, [hoveredWeek]);

    if (!hoveredWeek) return null;
    return (
        <>
            <div className="flex flex-col min-h-120">
                <div className="mb-6 flex-1">
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
                                This was a significant increase compared to
                                previous weeks.
                            </p>
                        </div>
                    ) : hoveredWeek.total_effort >= 80 ? (
                        <div className="mt-1">
                            <h2 className="text-sm text-purple-700 font-semibold">
                                Consistent training
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                This was a good level for building or
                                maintaining fitness.
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

                <div className="flex flex-col md:flex-row gap-6 flex-1">
                    <WeeklyDetailChart
                        key={hoveredWeek?.week || "current"}
                        data={dailyData}
                        weekId={data.indexOf(hoveredWeek)}
                    />
                    <WeeklyDetailInfo data={hoveredWeek} />
                </div>

                <WeeklyEffortChartWrapper
                    data={data}
                    onHoverWeek={handleHoverWeek}
                />
            </div>
        </>
    );
}
