import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import Link from "next/link";
import { Activity } from "@/app/types/activity";
import { getTimeInHoursMinutes } from "@/helpers/formatDateAndTime";
import { ActivityShort } from "@/app/types/activitiesGroupedByWeek";
import { getTypeIcon } from "@/helpers/getTypeIcon";

const WeeklyActivitiesList = ({
    activities,
    minZone,
    maxZone,
}: {
    activities: ActivityShort[];
    minZone: number;
    maxZone: number;
}) => {
    if (!activities?.length) {
        return (
            <p className="text-center text-sm text-muted-foreground italic py-4">
                No activities this week
            </p>
        );
    }

    const getZoneColor = (score: number) => {
        let color = "";
        if (score < minZone) color = "#ee82ee";
        if (score > maxZone) color = "#ef4444";
        if (score >= minZone && score <= maxZone) color = "#a855f7";
        return color;
    };
    return (
        <div className="space-y-2">
            {activities.map((a, i) => (
                <Link
                    href={`/activities/${a.id}`}
                    key={i}
                    className="border border-gray-300 p-3 rounded-md hover:bg-orange-100 transition flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
                >
                    <div className="flex gap-3 items-center min-w-0">
                        <p className="shrink-0">
                            {getTypeIcon(a.type, "medium")}
                        </p>

                        <p
                            className="font-semibold truncate max-w-25 sm:max-w-50"
                            title={a.name}
                        >
                            {a.name}
                        </p>

                        <p className="text-sm text-gray-500 whitespace-nowrap">
                            {(a.distance / 1000).toFixed(2)} km
                        </p>
                    </div>

                    <div className="flex gap-6 items-center text-right font-mono">
                        <p className="w-16">
                            {getTimeInHoursMinutes(a.moving_time)}
                        </p>
                        <p
                            className="font-bold w-10"
                            style={{
                                color: getZoneColor(
                                    parseFloat(a.suffer_score.toFixed(0)),
                                ),
                            }}
                        >
                            {a.suffer_score.toFixed(0)}
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    );
};
export default WeeklyActivitiesList;
