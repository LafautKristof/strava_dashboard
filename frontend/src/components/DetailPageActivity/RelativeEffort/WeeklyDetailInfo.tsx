"use client";

import { getMessageLabelColor } from "@/helpers/getMessageLabelColor";
import { endOfISOWeek, format, startOfISOWeek } from "date-fns";
import { enUS } from "date-fns/locale";

type WeekData = {
    week: string;
    total_effort: number;
    minZone?: number;
    maxZone?: number;
    activities: {
        id: number;
        name: string;
        suffer_score: number;
        start_date_local: string;
    }[];
};

export default function WeeklyDetailInfo({
    week,
    avgEffort,
}: {
    week: WeekData | null;
    avgEffort?: number;
}) {
    if (!week) {
        return (
            <div className="text-center text-sm text-muted-foreground italic py-4">
                Hover over a week to see more details
            </div>
        );
    }

    let startDate = "—";
    let endDate = "—";

    if (week?.week) {
        const [year, weekNumber] = week.week.split("-W").map(Number);
        if (year && weekNumber) {
            const refDate = new Date(year, 0, (weekNumber - 1) * 7 + 4);
            const start = startOfISOWeek(refDate);
            const end = endOfISOWeek(refDate);

            startDate = format(start, "MMM d, yyyy", { locale: enUS });
            endDate = format(end, "MMM d, yyyy", { locale: enUS });
        }
    }
    const dateRange = `${startDate} – ${endDate}`;
    const baseEffort =
        avgEffort ??
        (week.minZone && week.maxZone
            ? (week.minZone + week.maxZone) / 2
            : week.total_effort);

    const minZone = week.minZone ?? baseEffort * 0.8;
    const maxZone = week.maxZone ?? baseEffort * 1.2;
    const totalEffort = Math.round(week.total_effort);

    const messageLabelColor = getMessageLabelColor(
        totalEffort,
        minZone,
        maxZone
    );

    return (
        <div className="flex flex-col items-start text-start py-4 space-y-2">
            <h3 className="text-sm text-muted-foreground">{dateRange}</h3>
            <p
                className={`text-4xl font-bold `}
                style={{ color: messageLabelColor.rangeColor }}
            >
                {totalEffort}
            </p>
            <p className={`text-sm font-medium `}>
                {messageLabelColor.rangeLabel}
            </p>
            <p className="text-xs text-muted-foreground max-w-xs">
                {messageLabelColor.message}
            </p>
        </div>
    );
}
