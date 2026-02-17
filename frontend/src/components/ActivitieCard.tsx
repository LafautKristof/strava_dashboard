import { ActivityList } from "@/app/types/activityList";

import LazyMap from "./Dashboard/MiddleDashboardComponents/LazyMap";
import Link from "next/link";
import { getTimeInHoursMinutes } from "@/helpers/formatDateAndTime";
import { getTypeIcon } from "@/helpers/getTypeIcon";

const ActivitieCard = ({
    activity,
    map,
}: {
    activity: ActivityList;
    map: boolean;
}) => {
    return (
        <section className="bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-shadow mb-6 overflow-hidden border">
            {/* HEADER */}
            <div className="flex items-center justify-between px-4 pt-4">
                <p className="text-4xl font-semibold">
                    {getTypeIcon(activity.type, "large")}
                </p>
                <span className="text-xs text-gray-500">
                    {new Date(activity.start_date_local).toLocaleDateString()}
                </span>
            </div>

            {/* TITLE */}
            <div className="px-4 mt-2">
                <h2 className="text-lg font-semibold">{activity.name}</h2>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-4 py-4 text-sm">
                {activity.distance > 0 && (
                    <div>
                        <p className="text-gray-400 text-xs">Distance</p>
                        <p className="font-medium">
                            {(activity.distance / 1000).toFixed(1)} km
                        </p>
                    </div>
                )}

                {activity.moving_time > 0 && (
                    <div>
                        <p className="text-gray-400 text-xs">Time</p>
                        <p className="font-medium">
                            {getTimeInHoursMinutes(activity.moving_time)}
                        </p>
                    </div>
                )}

                {activity.total_elevation_gain > 0 && (
                    <div>
                        <p className="text-gray-400 text-xs">Elevation</p>
                        <p className="font-medium">
                            {activity.total_elevation_gain} m
                        </p>
                    </div>
                )}

                {activity.average_heartrate && (
                    <div>
                        <p className="text-gray-400 text-xs">HR</p>
                        <p className="font-medium">
                            {activity.average_heartrate} bpm
                        </p>
                    </div>
                )}
            </div>

            {/* LOCATION */}
            {activity.location?.city && (
                <div className="px-4 pb-2 text-xs text-gray-500">
                    {activity.location.city}, {activity.location.country}
                </div>
            )}

            {/* MAP */}
            {map && (
                <div className="border-t">
                    {activity.map?.summary_polyline ? (
                        <Link href={`/activities/${activity.id}`}>
                            <div className="h-[280px]">
                                <LazyMap
                                    route={activity.map.summary_polyline}
                                    activitieType={activity.type}
                                />
                            </div>
                        </Link>
                    ) : (
                        <div className="h-[120px] flex items-center justify-center text-gray-400 text-sm">
                            Indoor activity – no map available
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};
export default ActivitieCard;
