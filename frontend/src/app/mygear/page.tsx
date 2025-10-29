"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import LazyMap from "@/components/Dashboard/MiddleDashboardComponents/LazyMap";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import type { Activities, GearData } from "../types/gear";

export default function GearOverviewPage() {
    const [gear, setGear] = useState<GearData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGear, setSelectedGear] = useState<GearData | null>(null);

    useEffect(() => {
        const fetchGear = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/my_gear`,
                    {
                        cache: "no-store",
                    }
                );
                const data: GearData[] = await res.json();
                setGear(data);
            } catch (err) {
                console.error("Error fetching gear:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchGear();
    }, []);

    if (loading) return <p className="text-center py-8">Loading...</p>;

    return (
        <main className="w-full max-w-4xl mx-auto mt-8 bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6">My Gear</h1>

            <ul className="space-y-4">
                {gear.map((g) => {
                    const pct = Math.min((g.distance_km / 800) * 100, 100);
                    const hue = 120 - (pct * 120) / 100;
                    const isSelected = selectedGear?.id === g.id;

                    return (
                        <li
                            key={g.id}
                            className={`p-4 border rounded-md transition-all ${
                                isSelected
                                    ? "bg-orange-50 dark:bg-gray-800 border-orange-300"
                                    : "border-gray-200 dark:border-gray-700"
                            }`}
                        >
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                                <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                                    <h2 className="font-semibold w-48 truncate">
                                        {g.name}
                                    </h2>

                                    <div className="flex items-center gap-3">
                                        <div className="w-40 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-3 rounded-full transition-all"
                                                style={{
                                                    width: `${pct}%`,
                                                    backgroundColor: `hsl(${hue}, 100%, 45%)`,
                                                }}
                                            />
                                        </div>
                                        <p className="text-sm text-gray-500 whitespace-nowrap">
                                            {g.distance_km} km
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    variant={isSelected ? "default" : "outline"}
                                    onClick={() =>
                                        setSelectedGear(isSelected ? null : g)
                                    }
                                    className="mt-2 sm:mt-0"
                                >
                                    {isSelected
                                        ? "Sluiten"
                                        : `${g.activities.length} activities`}
                                    <ChevronDown
                                        className={`ml-2 h-4 w-4 transition-transform ${
                                            isSelected ? "rotate-180" : ""
                                        }`}
                                    />
                                </Button>
                            </div>

                            {isSelected && (
                                <div className="mt-4 border-t pt-4">
                                    {g.activities.length === 0 ? (
                                        <p className="text-sm text-gray-500">
                                            No activities with this gear
                                        </p>
                                    ) : (
                                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {g.activities.map(
                                                (a: Activities) => (
                                                    <li
                                                        key={a.id}
                                                        className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                                    >
                                                        <Link
                                                            href={`/activities/${a.id}`}
                                                            className="flex-1"
                                                        >
                                                            <div className="flex flex-col gap-1">
                                                                <p className="font-medium hover:underline">
                                                                    {a.name}
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    {new Date(
                                                                        a.start_date
                                                                    ).toLocaleDateString(
                                                                        "nl-BE"
                                                                    )}{" "}
                                                                    —{" "}
                                                                    {
                                                                        a.distance_km
                                                                    }{" "}
                                                                    km
                                                                </p>
                                                            </div>
                                                        </Link>

                                                        {a.map
                                                            ?.summary_polyline && (
                                                            <div className="w-full sm:w-32 h-20 rounded-md overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
                                                                <LazyMap
                                                                    route={
                                                                        a.map
                                                                            .summary_polyline
                                                                    }
                                                                    small
                                                                />
                                                            </div>
                                                        )}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </main>
    );
}
