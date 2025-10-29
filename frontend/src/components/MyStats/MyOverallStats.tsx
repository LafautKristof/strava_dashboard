import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DirectionsBike,
    DirectionsRun,
    DirectionsWalk,
} from "@mui/icons-material";

import TabsRun from "./Tabs/TabsRun";
import TabsBike from "./Tabs/TabsBike";
import TabsWalk from "./Tabs/TabsWalk";

const MyOverallStats = () => {
    return (
        <div className="flex flex-col gap-4 items-center">
            <Tabs defaultValue="run" className="w-full max-w-[800px]">
                <TabsList className="flex w-full justify-around bg-white rounded-md shadow-sm border p-2">
                    <TabsTrigger
                        value="run"
                        className="flex items-center justify-center w-full py-3 data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-md transition-colors"
                    >
                        <DirectionsRun fontSize="medium" />
                    </TabsTrigger>
                    <TabsTrigger
                        value="bike"
                        className="flex items-center justify-center w-full py-3 data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-md transition-colors"
                    >
                        <DirectionsBike fontSize="medium" />
                    </TabsTrigger>
                    <TabsTrigger
                        value="walk"
                        className="flex items-center justify-center w-full py-3 data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-md transition-colors"
                    >
                        <DirectionsWalk fontSize="medium" />
                    </TabsTrigger>
                </TabsList>

                <div className="bg-white rounded-md mt-4 p-4 shadow-sm border w-full min-w-[300px] max-w-[800px] mx-auto transition-all duration-300">
                    <TabsContent value="run">
                        <TabsRun />
                    </TabsContent>
                    <TabsContent value="bike">
                        <TabsBike />
                    </TabsContent>
                    <TabsContent value="walk">
                        <TabsWalk />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};

export default MyOverallStats;
