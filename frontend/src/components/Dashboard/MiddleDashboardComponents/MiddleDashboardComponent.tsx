"use client";
import { DataActivity } from "@/app/types/activities";
import { Athlete } from "@/app/types/athlete";
import Picture from "./Picture";
import Name from "./Name";
import WhenWhere from "./WhenWhere";
import Type from "./Type";
import DistElevTimeAch from "./DistElevTimeAch";
import LazyMap from "./LazyMap";
import Link from "next/link";

const MiddleDashboardComponent = ({
    athlete,
    activities,
}: {
    athlete: Athlete;
    activities: DataActivity;
}) => {
    return (
        <main>
            {activities.activities.map((activity, index) => (
                <section
                    key={index}
                    className=" bg-white rounded-md mb-6 mr-4 p-4"
                >
                    <div className="flex flex-col sm:flex-row items-start gap-6 mb-4">
                        <div className="shrink-0">
                            <Picture picture={athlete.profile_medium} />
                        </div>
                        <div className="flex flex-col text-start leading-tight">
                            <div>
                                <Name
                                    name={`${athlete.firstname} ${athlete.lastname}`}
                                />
                            </div>
                            <div className="mt-0.5">
                                <WhenWhere
                                    when={activity.start_date}
                                    where={activity.location_city ?? ""}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start gap-8 mb-4">
                        <Type type={activity.type} />
                        <div className="flex flex-col gap-4">
                            <p className="text-3xl font-semibold">
                                {activity.name}
                            </p>
                            {activity.type !== "Workout" && (
                                <DistElevTimeAch
                                    distance={activity.distance}
                                    elevation={activity.total_elevation_gain}
                                    time={activity.moving_time}
                                    description={activity.description}
                                    pace={activity.average_speed}
                                />
                            )}
                        </div>
                    </div>
                    {activity.map?.summary_polyline && (
                        <Link href={`/activities/${activity.id}`}>
                            <LazyMap route={activity.map.summary_polyline} />
                        </Link>
                    )}
                </section>
            ))}
        </main>
    );
};
export default MiddleDashboardComponent;
