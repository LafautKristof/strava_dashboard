import { Activities } from "@/app/types/activities";
import { formatPace } from "@/helpers/getAveragePace";
import { getTimeInHoursMinutes } from "@/helpers/getHours";

const StatsThisActivity = ({
    activity,
    relativeEffort,
}: {
    activity: Activities;
    relativeEffort?: number;
}) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 w-full text-center sm:text-left">
            <div className="flex flex-col items-center sm:items-start">
                <div className="flex items-baseline gap-1">
                    <h2 className="text-2xl sm:text-3xl font-semibold">
                        {(activity.distance / 1000).toFixed(1)}
                    </h2>
                    <p className="text-base sm:text-lg text-gray-700">km</p>
                </div>
                <p className="text-xs sm:text-sm text-gray-500">Distance</p>
            </div>

            <div className="flex flex-col items-center sm:items-start">
                <h2 className="text-2xl sm:text-3xl font-semibold">
                    {getTimeInHoursMinutes(activity.moving_time)}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">Moving Time</p>
            </div>

            <div className="flex flex-col items-center sm:items-start">
                <div className="flex items-baseline gap-1">
                    <h2 className="text-2xl sm:text-3xl font-semibold">
                        {formatPace(activity.average_speed)}
                    </h2>
                    <p className="text-base sm:text-lg text-gray-700">/km</p>
                </div>
                <p className="text-xs sm:text-sm text-gray-500">Average Pace</p>
            </div>

            {relativeEffort !== undefined && (
                <div className="flex flex-col items-center sm:items-start">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-red-500">
                        {relativeEffort}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500">
                        Relative Effort
                    </p>
                </div>
            )}
        </div>
    );
};

export default StatsThisActivity;
