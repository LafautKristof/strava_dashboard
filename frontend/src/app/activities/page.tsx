"use client";

import { useEffect, useState } from "react";
import StatsSection from "@/components/StatsSection";
import ActivitiesSection from "@/components/ActivitiesSection";
import MapSection from "@/components/MapSection";

export default function Home() {
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/activities`
                );
                const data = await res.json();
                setActivities(data);
            } catch (err) {
                console.error("Error fetching activities:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading)
        return (
            <p className="text-center text-gray-500">Loading activities...</p>
        );

    return (
        <div className="space-y-8">
            <StatsSection activities={activities} />
            <ActivitiesSection activities={activities} />
            <MapSection />
        </div>
    );
}
