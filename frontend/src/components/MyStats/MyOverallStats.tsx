"use client";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/src/components/ui/tabs";
import {
    DirectionsBike,
    DirectionsRun,
    DirectionsWalk,
} from "@mui/icons-material";

import TabsSport from "./Tabs/TabsSport";

const MyOverallStats = () => {
    const TABS = [
        { value: "run", icon: DirectionsRun },
        { value: "ride", icon: DirectionsBike },
        { value: "walk", icon: DirectionsWalk },
    ];
    return (
        <div className="flex flex-col gap-4 items-center">
            <Tabs defaultValue="run" className="w-full max-w-[800px]">
                <TabsList className="flex w-full justify-around bg-white rounded-md shadow-sm border p-2">
                    {TABS.map(({ value, icon: Icon }) => (
                        <TabsTrigger
                            value={value}
                            key={value}
                            className="flex items-center justify-center w-full py-3 data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-md transition-colors hover:bg-orange-200/60 cursor-pointer"
                        >
                            <Icon fontSize="medium" />
                        </TabsTrigger>
                    ))}
                </TabsList>

                <div className="bg-white rounded-md mt-4 p-4 shadow-sm border w-full min-w-[300px] max-w-[800px] mx-auto transition-all duration-300">
                    {TABS.map((tab) => (
                        <TabsContent value={tab.value} key={tab.value}>
                            <TabsSport tab={tab.value} />
                        </TabsContent>
                    ))}
                </div>
            </Tabs>
        </div>
    );
};

export default MyOverallStats;
