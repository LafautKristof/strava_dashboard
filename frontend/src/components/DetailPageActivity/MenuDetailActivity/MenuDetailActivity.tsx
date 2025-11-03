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
    console.log("streams", streams);
    return (
        <Tabs
            defaultValue="overview"
            orientation="vertical"
            className="flex flex-col lg:flex-row w-full min-h-[80vh] items-start"
        >
            <TabsList
                className="
            flex flex-row lg:flex-col
            gap-2
            bg-muted/20
            p-2
            rounded-md
            overflow-x-auto lg:overflow-y-auto no-scrollbar
            whitespace-nowrap
            w-full lg:w-[220px]
            shrink-0
        "
            >
                {[
                    { value: "overview", label: "Overview" },
                    { value: "relative-effort", label: "Relative Effort" },
                    { value: "heartrate", label: "Heart Rate" },
                    { value: "segments", label: "Segments" },
                ].map((tab) => (
                    <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="
                    flex items-center justify-center lg:justify-start
                    px-3 py-2 rounded-md
                    text-sm sm:text-base
                    transition-colors
                    data-[state=active]:bg-orange-400
                    data-[state=active]:text-white
                    hover:bg-orange-200/60
                    w-auto lg:w-full
                    h-auto
                    flex-shrink-0
                "
                    >
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>

            <div className="flex-1 w-full p-4 lg:p-6 bg-white rounded-md border shadow-sm">
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
