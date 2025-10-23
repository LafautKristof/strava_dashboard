"use client";

import { useMemo } from "react";
import { DaysThisWeek } from "@/app/types/streak";
import { getIconComponentForActivity } from "@/helpers/getIconForActivitie";

export default function WeekDays({
    daysThisWeek,
}: {
    daysThisWeek: DaysThisWeek | undefined;
}) {
    const days = useMemo(() => {
        const today = new Date();
        const todayUTC = new Date(
            Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
        );
        const dayOfWeek = todayUTC.getUTCDay();
        const monday = new Date(todayUTC);
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        monday.setUTCDate(todayUTC.getUTCDate() + mondayOffset);

        const dayNames: (keyof DaysThisWeek)[] = [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun",
        ];

        return dayNames.map((name, i) => {
            const d = new Date(monday);
            d.setUTCDate(monday.getUTCDate() + i);

            const dateOnly = new Date(
                d.getFullYear(),
                d.getMonth(),
                d.getDate()
            ).toDateString();
            const todayOnly = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
            ).toDateString();

            const entry = daysThisWeek?.[name];

            return {
                key: name,
                label: name[0],
                date: d.getUTCDate(),
                isToday: dateOnly === todayOnly,
                isFuture: d > today,
                activityType: entry?.type ?? null,
            };
        });
    }, [daysThisWeek]);

    return (
        <div className="flex justify-between items-center rounded-xl p-4 text-white ">
            {days.map((day) => {
                const Icon =
                    day.activityType && !day.isFuture
                        ? getIconComponentForActivity(
                              day.activityType.charAt(0).toUpperCase() +
                                  day.activityType.slice(1)
                          )
                        : null;

                return (
                    <div
                        key={day.key}
                        className="flex flex-col items-center justify-center w-10 text-center"
                    >
                        <div
                            className={`w-8 h-8 flex items-center justify-center rounded-full font-medium ${
                                day.isToday
                                    ? "bg-orange-500 text-white"
                                    : "text-stone-400"
                            }`}
                        >
                            {day.label}
                        </div>

                        <div className="mt-1 flex items-center justify-center text-sm">
                            <div
                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors
    ${
        Icon && !day.isFuture
            ? "bg-black border-black"
            : "bg-white border-gray-300"
    }
  `}
                            >
                                {Icon && !day.isFuture ? (
                                    <Icon
                                        fontSize="small"
                                        htmlColor="#ffffff"
                                    />
                                ) : (
                                    <span
                                        className={`text-sm font-semibold ${
                                            day.isFuture
                                                ? "text-gray-400"
                                                : "text-gray-800"
                                        }`}
                                    >
                                        {day.date}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
