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
import { Activities8Weeks } from "@/app/types/activities12Weeks";
import { DataActivity } from "@/app/types/activities";
import TabsRun from "./TabsRun/TabsRun";
import TabsBike from "./TabsBike/TabsBike";
import TabsWalk from "./TabsWalk/TabsWalk";
import TabsWorkout from "./TabsWorkout/TabsWorkout";

const TabLayout = ({
    activities8Weeks,
    activities,
}: {
    activities8Weeks: Activities8Weeks[];
    activities: DataActivity;
}) => {
    return (
        <div className="flex flex-col w-full gap-4">
            <Tabs defaultValue="overall" className="w-full">
                <TabsList className="flex w-full justify-around bg-muted/20 rounded-md p-1">
                    <TabsTrigger
                        value="overall"
                        className="flex items-center justify-center p-2 sm:p-3 data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-md transition-colors"
                    >
                        <AssignmentIcon fontSize="medium" />
                    </TabsTrigger>
                    <TabsTrigger
                        value="run"
                        className="flex items-center justify-center p-2 sm:p-3 data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-md transition-colors"
                    >
                        <DirectionsRun fontSize="medium" />
                    </TabsTrigger>
                    <TabsTrigger
                        value="bike"
                        className="flex items-center justify-center p-2 sm:p-3 data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-md transition-colors"
                    >
                        <DirectionsBike fontSize="medium" />
                    </TabsTrigger>
                    <TabsTrigger
                        value="walk"
                        className="flex items-center justify-center p-2 sm:p-3 data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-md transition-colors"
                    >
                        <DirectionsWalk fontSize="medium" />
                    </TabsTrigger>
                    <TabsTrigger
                        value="workout"
                        className="flex items-center justify-center p-2 sm:p-3 data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-md transition-colors"
                    >
                        <FitnessCenter fontSize="medium" />
                    </TabsTrigger>
                </TabsList>

                <div className="bg-white rounded-md mt-4 p-4 shadow-sm border">
                    <TabsContent value="overall">
                        <TabsInfo data={activities8Weeks} />
                    </TabsContent>
                    <TabsContent value="run">
                        <TabsRun data={activities} />
                    </TabsContent>
                    <TabsContent value="bike">
                        <TabsBike data={activities} />
                    </TabsContent>
                    <TabsContent value="walk">
                        <TabsWalk data={activities} />
                    </TabsContent>
                    <TabsContent value="workout">
                        <TabsWorkout data={activities} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};

export default TabLayout;
