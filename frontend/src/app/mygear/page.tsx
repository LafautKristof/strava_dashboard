"use client";

import { useEffect, useState } from "react";
import { GearData, GearResponse } from "../../types/gear";
import LoaderComponent from "@/components/LoaderComponent";
import { ActivityList } from "../../types/activityList";
import GearOverviewList from "@/components/MyGear/GearOverviewList";
import { Pagination } from "../../types/pagination";

export default function GearOverviewPage({
    initialOpenGearId,
}: {
    initialOpenGearId?: string;
}) {
    console.log("initialOpenGearId", initialOpenGearId);
    const [gear, setGear] = useState<GearData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGear, setSelectedGear] = useState<string | null>(
        initialOpenGearId ?? null,
    );

    const [activities, setActivities] = useState<ActivityList[]>([]);
    const [activitiesPage, setActivitiesPage] = useState(1);
    const [activitiesPagination, setActivitiesPagination] =
        useState<Pagination | null>(null);
    const [activitiesLoading, setActivitiesLoading] = useState(false);

    useEffect(() => {
        const fetchGear = async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/my_gear`,
                {
                    cache: "no-store",
                },
            );
            const result: GearResponse = await res.json();

            setGear(result.data);
            setLoading(false);
        };

        fetchGear();
    }, []);

    useEffect(() => {
        if (!selectedGear) return;

        const fetchActivities = async () => {
            setActivitiesLoading(true);

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/gear/${selectedGear}/activities?page=${activitiesPage}&per_page=10`,
                { cache: "no-store" },
            );

            const result = await res.json();

            setActivities(result.data);
            setActivitiesPagination(result.pagination);
            setActivitiesLoading(false);
        };

        fetchActivities();
    }, [selectedGear, activitiesPage, gear]);
    useEffect(() => {
        if (initialOpenGearId) {
            setSelectedGear(initialOpenGearId);
        }
    }, [initialOpenGearId]);
    useEffect(() => {
        if (!selectedGear) return;
        setActivitiesPage(1);
    }, [selectedGear]);
    if (loading) return <LoaderComponent text="Loading your gear..." />;

    return (
        <main className="w-full max-w-4xl mx-auto mt-8 bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6">My Gear</h1>
            <GearOverviewList
                gear={gear}
                selectedGear={selectedGear}
                setSelectedGear={setSelectedGear}
                activities={activities}
                activitiesPagination={activitiesPagination}
                activitiesLoading={activitiesLoading}
                activitiesPage={activitiesPage}
                setActivitiesPage={setActivitiesPage}
            />
        </main>
    );
}
