"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DirectionsBike,
    DirectionsRun,
    DirectionsWalk,
    FitnessCenter,
} from "@mui/icons-material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { TabsInfo } from "./TabsInfo/TabsInfo";

import { ActivitiesGroupedByWeek } from "@/app/types/activitiesGroupedByWeek";
import TabsSport from "./TabsSport/TabsSport";
import { ActivitiesStats } from "@/app/types/activititiesStats";

const TabLayout = ({
    activities8Weeks,
    activitiesStats,
}: {
    activities8Weeks: ActivitiesGroupedByWeek[];
    activitiesStats: ActivitiesStats;
}) => {
    const TABS = [
        { value: "overall", type: "overall", icon: AssignmentIcon },
        {
            value: "run",
            type: "sport",
            icon: DirectionsRun,
            activityKey: "Run",
        },
        {
            value: "bike",
            type: "sport",
            icon: DirectionsBike,
            activityKey: "Ride",
        },
        {
            value: "walk",
            type: "sport",
            icon: DirectionsWalk,
            activityKey: "Walk",
        },
        {
            value: "workout",
            type: "sport",
            icon: FitnessCenter,
            activityKey: "Workout",
        },
    ] as const;

    return (
        <div className="flex flex-col w-full gap-4">
            <Tabs defaultValue="overall" className="w-full">
                <TabsList className="flex w-full justify-around bg-muted/20 rounded-md p-1">
                    {TABS.map(({ value, icon: Icon }) => (
                        <TabsTrigger
                            key={value}
                            value={value}
                            className="flex items-center justify-center p-2 sm:p-3 data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-md transition-colors"
                        >
                            <Icon fontSize="medium" />
                        </TabsTrigger>
                    ))}
                </TabsList>

                <div className="bg-white rounded-md mt-4 p-4 shadow-sm border min-h-130">
                    {TABS.map((tab) => (
                        <TabsContent key={tab.value} value={tab.value}>
                            {tab.type === "overall" ? (
                                <TabsInfo data={activities8Weeks} />
                            ) : (
                                <TabsSport
                                    activities8Weeks={activities8Weeks}
                                    activitiesStats={activitiesStats}
                                    type={tab.activityKey}
                                />
                            )}
                        </TabsContent>
                    ))}
                </div>
            </Tabs>
        </div>
    );
};

export default TabLayout;
