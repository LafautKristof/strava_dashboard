import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { getTimeInHoursMinutes } from "@/helpers/getHours";
import Link from "next/link";
import { Activities } from "@/app/types/activities12Weeks";

const WeeklyActivitiesList = ({
    activities,
    minZone,
    maxZone,
}: {
    activities: Activities[];
    minZone: number;
    maxZone: number;
}) => {
    if (!activities?.length) {
        return (
            <p className="text-center text-sm text-muted-foreground italic py-4">
                Geen activiteiten deze week
            </p>
        );
    }
    const getIconForType = (type: string) => {
        switch (type) {
            case "Run":
                return <DirectionsRunIcon />;
            case "Ride":
                return <DirectionsBikeIcon />;
            case "Walk":
                return <DirectionsWalkIcon />;
            case "Workout":
                return <FitnessCenterIcon />;
            default:
                return <MoreHorizIcon />;
        }
    };
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
                    className="border border-gray-300 p-3 rounded-md hover:bg-gray-100 transition flex justify-between items-center"
                >
                    {" "}
                    <div className="flex gap-6 items-center">
                        <p>{getIconForType(a.type)}</p>
                        <p className="font-semibold">{a.name}</p>
                        <p className="text-sm text-gray-500">
                            {(a.distance / 1000).toFixed(2)} km
                        </p>
                    </div>
                    <div className="flex gap-6 items-center">
                        <p>{getTimeInHoursMinutes(a.moving_time)}</p>
                        <p
                            className={`font-bold `}
                            style={{
                                color: getZoneColor(
                                    parseFloat(a.suffer_score.toFixed(0))
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
