import { ActivityList } from "@/src/types/activityList";
import { GearData } from "@/src/types/gear";

import CardButton from "./CardButton";
import PercentageBar from "./PercentageBar";
import PaginationButton from "./PaginationButton";
import { Loader } from "lucide-react";
import Link from "next/link";
import ActivitieCardSmall from "../ActivitieCardSmall";
import { Pagination } from "@/src/types/pagination";

const GearOverviewList = ({
    gear,
    selectedGear,
    setSelectedGear,
    activities,
    activitiesPagination,
    activitiesLoading,
    activitiesPage,
    setActivitiesPage,
}: {
    gear: GearData[];
    selectedGear?: string | null;
    setSelectedGear: (id: string | null) => void;
    activities: ActivityList[];
    activitiesPagination: Pagination | null;
    activitiesLoading: boolean;
    activitiesPage: number;
    setActivitiesPage: (page: number) => void;
}) => {
    return (
        <ul className="space-y-4">
            {gear.map((g) => {
                const pct = Math.min((g.distance / 800) * 100, 100);
                const hue = 120 - (pct * 120) / 100;
                const isSelected = selectedGear === g.id;

                return (
                    <li
                        key={g.id}
                        className={`p-4 border rounded-md transition-all ${
                            isSelected
                                ? "bg-orange-50 dark:bg-gray-800 border-orange-300"
                                : "border-gray-200 dark:border-gray-700"
                        }`}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="font-semibold">{g.name}</h2>

                                <PercentageBar pct={pct} hue={hue} />
                            </div>
                            <CardButton
                                isSelected={isSelected}
                                setSelectedGear={setSelectedGear}
                                setActivitiesPage={setActivitiesPage}
                                gear={g}
                            />
                        </div>

                        {/* Activities Section */}
                        {isSelected && (
                            <div className="mt-4 border-t pt-4">
                                <div className="relative min-h-[300px] flex flex-col">
                                    {/* Overlay Loader */}
                                    {activitiesLoading && (
                                        <div className="absolute inset-0 bg-white/60 dark:bg-black/40 flex items-center justify-center z-10 rounded-md">
                                            <Loader className="animate-spin" />
                                        </div>
                                    )}

                                    {/* Activities List */}
                                    <div className="flex flex-col flex-1 justify-between">
                                        {/* Activities List */}
                                        <div>
                                            {activities.length === 0 ? (
                                                <p className="text-sm text-gray-500">
                                                    No activities found
                                                </p>
                                            ) : (
                                                <ul className="divide-y">
                                                    {activities.map((a) => (
                                                        <Link
                                                            key={a.id}
                                                            href={`/activities/${a.id}`}
                                                            className="py-2 block hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 transition-colors flex justify-between"
                                                        >
                                                            <ActivitieCardSmall
                                                                activities={a}
                                                            />
                                                        </Link>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>

                                        {activitiesPagination &&
                                            activities.length > 0 && (
                                                <div className="flex justify-between mt-6 pt-4 border-t">
                                                    <PaginationButton
                                                        activitiesPage={
                                                            activitiesPage
                                                        }
                                                        setActivitiesPage={
                                                            setActivitiesPage
                                                        }
                                                        activitiesPagination={
                                                            activitiesPagination
                                                        }
                                                    />
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </li>
                );
            })}
        </ul>
    );
};
export default GearOverviewList;
