import { Activities } from "@/app/types/activities";
import { Athlete } from "@/app/types/athlete";
import Header from "./Header";
import { getStartTime } from "@/helpers/getStartTime";
import WhoWhereWhenWhat from "./WhoWhereWhenWhat";
import Details from "./Detail";
import { getTimeInHoursMinutes } from "@/helpers/getHours";
import { formatPace } from "@/helpers/getAveragePace";
import MyGear from "./MyGear";
import ActivityOverview from "./ActivityOverview";
import { Streams } from "@/app/types/streams";
import { Separator } from "@/components/ui/separator";

const OverView = ({
    activity,
    athlete,
    streams,
}: {
    activity: Activities;
    athlete: Athlete;
    streams: Streams;
}) => {
    const who = athlete.profile;
    const firstSegment = activity.segment_efforts?.[0]?.segment;
    console.log("activitie", activity);

    const where =
        activity.location_city && activity.location_country
            ? `${activity.location_city}, ${activity.location_country}`
            : activity.location_city ||
              activity.location_country ||
              (firstSegment?.city && firstSegment?.country
                  ? `${firstSegment.city}, ${firstSegment.country}`
                  : "Onbekende locatie");
    const when = getStartTime(activity.start_date_local).toLocaleString();
    const what = activity.name;
    const description = activity.description;

    const details = [
        {
            distance: (activity.distance / 1000).toFixed(2),
            movingTime: getTimeInHoursMinutes(activity.moving_time),
            pace: formatPace(activity.average_speed),
            relativeEffort: activity.suffer_score,
            elevation: activity.total_elevation_gain,
            elapsedTime: getTimeInHoursMinutes(activity.elapsed_time),
            calories: activity.calories,
        },
    ];

    return (
        <>
            <div className="border-b">
                <Header
                    athlete={`${athlete.firstname} ${athlete.lastname}`}
                    workout={activity.type}
                />
            </div>

            <div className="flex flex-col lg:flex-row border mt-4">
                <div className="flex-1 p-4">
                    <WhoWhereWhenWhat
                        who={who}
                        where1={where}
                        when={when}
                        what={what}
                        description={description}
                    />
                </div>

                <Separator
                    orientation="horizontal"
                    className="my-4 lg:hidden"
                />
                <Separator
                    orientation="vertical"
                    className="mx-4 hidden lg:block"
                />

                <div className="flex-1 p-4">
                    <Details details={details} />
                    {activity.gear && activity.device_name && (
                        <MyGear
                            gear={activity.gear}
                            device={activity.device_name}
                        />
                    )}
                </div>
            </div>

            <div className="mt-6">
                <ActivityOverview activity={activity} streams={streams} />
            </div>
        </>
    );
};

export default OverView;
