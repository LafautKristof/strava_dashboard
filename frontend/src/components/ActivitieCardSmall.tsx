import formatDateAndTime from "@/src/helpers/formatDateAndTime";
import { getTypeIcon } from "@/src/helpers/getTypeIcon";

const ActivitieCardSmall = ({ activities }: { activities: any }) => {
    return (
        <>
            <div className="flex items-start gap-2">
                <span>{getTypeIcon(activities.type, "small")}</span>
                <span className="font-medium">{activities.name}</span>
            </div>

            <span className="text-sm text-gray-500">
                {formatDateAndTime(activities.start_date_local, 1)}
            </span>
            <span className="text-gray-500">
                {(activities.distance / 1000).toFixed(1)} km —{" "}
                {(activities.moving_time / 60).toFixed(0)} min
            </span>
        </>
    );
};
export default ActivitieCardSmall;
