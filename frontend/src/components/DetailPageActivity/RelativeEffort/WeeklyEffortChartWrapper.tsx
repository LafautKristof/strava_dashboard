"use client";

import { useEffect, useState } from "react";
import WeeklyEffortChart from "./WeeklyEffortChart";
import WeeklyDetailChart from "./WeeklyDetailChart";
import WeeklyDetailInfo from "./WeeklyDetailInfo";
import WeeklyActivitiesList from "./WeeklyActivitiesList";
import { Activities } from "@/app/types/activities";
import {
    Activities12Weeks,
    Activities as Activities12,
} from "@/app/types/activities12Weeks";

export default function WeeklyEffortChartWrapper({
    activities12Weeks,
    activity,
}: {
    activities12Weeks: Activities12Weeks[];
    activity: Activities;
}) {
    const [hoveredWeek, setHoveredWeek] = useState<Activities12Weeks | null>(
        null
    );

    useEffect(() => {
        if (activities12Weeks?.length && !hoveredWeek) {
            setHoveredWeek(activities12Weeks[activities12Weeks.length - 1]);
        }
    }, [activities12Weeks, hoveredWeek]);

    function getDaysForWeek(activities: Activities12[] = []) {
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const grouped: Record<string, number> = Object.fromEntries(
            days.map((d) => [d, 0])
        );

        activities.forEach((a) => {
            const date = new Date(a.start_date_local);
            const dayIndex = (date.getDay() + 6) % 7;
            grouped[days[dayIndex]] += a.suffer_score || 0;
        });

        return days.map((d) => ({
            day: d,
            total_effort: grouped[d],
        }));
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <WeeklyDetailChart
                    data={getDaysForWeek(hoveredWeek?.activities ?? [])}
                    weekId={hoveredWeek?.weekIndex ?? 0}
                />

                <div className="min-h-[180px] transition-none">
                    <WeeklyDetailInfo
                        week={
                            hoveredWeek
                                ? {
                                      week: hoveredWeek.week,
                                      total_effort: hoveredWeek.total_effort,
                                      minZone: hoveredWeek.minZone,
                                      maxZone: hoveredWeek.maxZone,
                                      activities: hoveredWeek.activities.map(
                                          (a) => ({
                                              id: a.id,
                                              name: a.name,
                                              suffer_score: a.suffer_score,
                                              start_date_local:
                                                  typeof a.start_date_local ===
                                                  "string"
                                                      ? a.start_date_local
                                                      : a.start_date_local.toISOString(),
                                          })
                                      ),
                                  }
                                : null
                        }
                        avgEffort={
                            hoveredWeek
                                ? ((hoveredWeek.minZone ?? 0) +
                                      (hoveredWeek.maxZone ?? 0)) /
                                  2
                                : undefined
                        }
                    />
                </div>
            </div>
            <div>
                <WeeklyEffortChart
                    activities12Weeks={activities12Weeks}
                    onHoverWeek={setHoveredWeek}
                    activity={activity}
                />
            </div>

            <div className="min-h-[200px]">
                <WeeklyActivitiesList
                    activities={hoveredWeek?.activities ?? []}
                    minZone={hoveredWeek?.minZone ?? 0}
                    maxZone={hoveredWeek?.maxZone ?? 0}
                />
            </div>
        </div>
    );
}
