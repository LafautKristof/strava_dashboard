"use client";
import { Activities, DataActivity } from "@/app/types/activities";
import { Athlete } from "@/app/types/athlete";
import Picture from "./Picture";
import Name from "./Name";
import WhenWhere from "./WhenWhere";
import Type from "./Type";
import DistElevTimeAch from "./DistElevTimeAch";
import LazyMap from "./LazyMap";
import Link from "next/link";
import { useEffect, useState } from "react";

const MiddleDashboardComponent = ({ athlete }: { athlete: Athlete }) => {
    const [activities, setActivities] = useState<Activities[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchActivities = async (pageNumber: number) => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/activities?page=${pageNumber}&per_page=10`,
                { cache: "no-store" }
            );
            const newData: DataActivity = await res.json();

            if (newData.activities.length === 0) setHasMore(false);
            setActivities((prev) => [...prev, ...newData.activities]);
        } catch (err) {
            console.error("Error fetching activities:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities(1);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >=
                    document.body.offsetHeight - 300 &&
                hasMore &&
                !loading
            ) {
                setPage((prev) => prev + 1);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasMore, loading]);

    useEffect(() => {
        if (page > 1) fetchActivities(page);
    }, [page]);

    return (
        <main>
            {activities &&
                activities.map((activity, index) => (
                    <section
                        key={index}
                        className="bg-white rounded-md mb-6 p-4"
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
                                        elevation={
                                            activity.total_elevation_gain
                                        }
                                        time={activity.moving_time}
                                        description={activity.description}
                                        pace={activity.average_speed}
                                    />
                                )}
                            </div>
                        </div>
                        {activity.map?.summary_polyline && (
                            <Link href={`/activities/${activity.id}`}>
                                <LazyMap
                                    route={activity.map.summary_polyline}
                                />
                            </Link>
                        )}
                    </section>
                ))}
        </main>
    );
};
export default MiddleDashboardComponent;
