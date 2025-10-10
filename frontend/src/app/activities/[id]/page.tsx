"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ActivityPage() {
    const { id } = useParams();
    console.log(id);
    const [activity, setActivity] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivity = async () => {
            console.log("Fetching activity with ID:", id);
            console.log(process.env.NEXT_PUBLIC_API_URL);
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/activity/${id}`
                );
                const data = await res.json();
                setActivity(data);
            } catch (err) {
                console.error("Error fetching activity:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchActivity();
    }, [id]);

    if (loading) return <p className="text-gray-500">Loading activity...</p>;
    if (!activity) return <p>Activity not found.</p>;

    const km = (activity.distance / 1000).toFixed(2);
    const hours = Math.floor(activity.moving_time / 3600);
    const minutes = Math.floor((activity.moving_time % 3600) / 60);
    const pace = (
        activity.moving_time /
        60 /
        (activity.distance / 1000)
    ).toFixed(1);

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Link href="/" className="text-blue-500 hover:underline">
                ← Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold">{activity.name}</h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Distance</p>
                    <h2 className="text-xl font-bold">{km} km</h2>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Moving Time</p>
                    <h2 className="text-xl font-bold">
                        {hours}h {minutes}m
                    </h2>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Avg Pace</p>
                    <h2 className="text-xl font-bold">{pace} min/km</h2>
                </div>
            </div>

            <p className="text-gray-500">Type: {activity.type}</p>
            {activity.start_date_local && (
                <p className="text-gray-500">
                    Date:{" "}
                    {new Date(activity.start_date_local).toLocaleDateString()}
                </p>
            )}

            {activity.map && (
                <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-4 text-center">
                    🗺️ Map data available (polylines can be rendered later)
                </div>
            )}
        </div>
    );
}
