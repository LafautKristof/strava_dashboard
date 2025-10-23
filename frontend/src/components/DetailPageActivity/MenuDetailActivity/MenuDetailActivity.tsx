import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverView from "../OverView/OverView";
import { Activities } from "@/app/types/activities";
import { Athlete } from "@/app/types/athlete";
import { Streams } from "@/app/types/streams";
import RelativeEffort from "../RelativeEffort/RelativeEffort";
import HeartRate from "../HeartRate/HeartRate";
import Segment from "../Segments/Segment";

const MenuDetailActivity = ({
    activity,
    athlete,
    streams,
}: {
    activity: Activities;
    athlete: Athlete;
    streams: Streams;
}) => {
    return (
        <Tabs
            defaultValue="overview"
            orientation="vertical"
            className="flex flex-col lg:flex-row min-h-[80vh] w-full bg-background"
        >
            <TabsList
                className="
            flex flex-row lg:flex-col 
            justify-start lg:justify-start 
            gap-2 bg-muted/20 p-2 rounded-md
            overflow-x-auto no-scrollbar
            whitespace-nowrap
            w-full lg:min-w-[200px]
        "
            >
                <TabsTrigger
                    value="overview"
                    className="flex-shrink-0 justify-center lg:justify-start px-4 py-2 rounded-md 
                       data-[state=active]:bg-orange-400 data-[state=active]:text-white 
                       lg:w-full"
                >
                    Overview
                </TabsTrigger>

                <TabsTrigger
                    value="relative-effort"
                    className="flex-shrink-0 justify-center lg:justify-start px-4 py-2 rounded-md 
                       data-[state=active]:bg-orange-400 data-[state=active]:text-white 
                       lg:w-full"
                >
                    Relative Effort
                </TabsTrigger>

                <TabsTrigger
                    value="heartrate"
                    className="flex-shrink-0 justify-center lg:justify-start px-4 py-2 rounded-md 
                       data-[state=active]:bg-orange-400 data-[state=active]:text-white 
                       lg:w-full"
                >
                    Heart Rate
                </TabsTrigger>

                <TabsTrigger
                    value="segments"
                    className="flex-shrink-0 justify-center lg:justify-start px-4 py-2 rounded-md 
                       data-[state=active]:bg-orange-400 data-[state=active]:text-white 
                       lg:w-full"
                >
                    Segments
                </TabsTrigger>
            </TabsList>

            <div className="flex-1 p-4 lg:p-6">
                <TabsContent value="overview">
                    <OverView
                        activity={activity}
                        athlete={athlete}
                        streams={streams}
                    />
                </TabsContent>

                <TabsContent value="relative-effort">
                    <RelativeEffort
                        activity={activity}
                        firstname={athlete.firstname}
                        lastname={athlete.lastname}
                        type={activity.type}
                    />
                </TabsContent>

                <TabsContent value="heartrate">
                    <HeartRate
                        heartRate={streams.heartrate.data}
                        athlete={athlete}
                        type={activity.type}
                        activity={activity}
                    />
                </TabsContent>

                <TabsContent value="segments">
                    <Segment
                        activities={activity}
                        type={activity.type}
                        athlete={athlete}
                        streams={streams}
                    />
                </TabsContent>
            </div>
        </Tabs>
    );
};
export default MenuDetailActivity;
