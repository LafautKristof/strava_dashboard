import { get12WeeksAgo } from "@/helpers/get12WeeksAgo";
import WeeklyEffortChartWrapper from "./WeeklyEffortChartWrapper";
import Header from "../OverView/Header";
import { Activities } from "@/app/types/activities";
import StatsThisActivity from "./StatsThisActivity";
import EffortThisWeek from "./EffortThisWeek";
import { Activities12Weeks } from "@/app/types/activities12Weeks";

export default async function RelativeEffort({
    activity,
    firstname,
    lastname,
    type,
}: {
    activity: Activities;
    firstname: string;
    lastname: string;
    type: string;
}) {
    const after = get12WeeksAgo();
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/activities?after=${after}`,
        { cache: "no-cache" }
    );
    const activities12Weeks: Activities12Weeks[] = await res.json();
    const total = activities12Weeks.reduce(
        (sum: number, w: Activities12Weeks) => {
            return sum + (w.total_effort || 0);
        },
        0
    );
    const avg = total / activities12Weeks.length;

    const enrichedWeeks = activities12Weeks.map((w, i, arr) => {
        const prev = arr.slice(Math.max(0, i - 3), i);
        const base =
            prev.length > 0
                ? prev.reduce((s, p) => s + (p.total_effort || 0), 0) /
                  prev.length
                : avg;

        return {
            ...w,
            minZone: base * 0.8,
            maxZone: base * 1.2,
        };
    });

    const activityDate = new Date(activity.start_date_local);
    const currentWeek = enrichedWeeks.find((w) => {
        if (!w.start || !w.end) return false;
        const start = new Date(w.start);
        const end = new Date(w.end);
        return activityDate >= start && activityDate <= end;
    });

    let zoneStatus: "below" | "within" | "above" | null = null;
    if (currentWeek) {
        const { minZone, maxZone } = currentWeek;
        const effort = activity.suffer_score || 0;

        if (effort < minZone) zoneStatus = "below";
        else if (effort > maxZone) zoneStatus = "above";
        else zoneStatus = "within";
    }

    return (
        <>
            <div className="bg-gray-200 border mb-4">
                <Header athlete={firstname + " " + lastname} workout={type} />
            </div>
            <div className="border">
                <div className="border bg-gray-200 p-4 font-semibold">
                    <StatsThisActivity activity={activity} />
                </div>
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-[300px] flex-shrink-0    ">
                        <EffortThisWeek
                            sufferscore={activity.suffer_score}
                            zoneStatus={zoneStatus || ""}
                        />
                    </div>

                    <div className="flex-1   ">
                        <WeeklyEffortChartWrapper
                            activities12Weeks={activities12Weeks}
                            activity={activity}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
