import { Athlete } from "@/types/athlete";
import WhoWhereWhenWhat from "./WhoWhereWhenWhat";
import Details from "./Detail";
import MyGear from "./MyGear";
import ActivityOverview from "./ActivityOverview";
import { Separator } from "@/components/ui/separator";
import { Activity } from "@/types/activity";
import { Streams } from "@/types/streams";
import formatDateAndTime, {
    getTimeInHoursMinutes,
} from "@/helpers/formatDateAndTime";
import { formatPace } from "@/helpers/formatPace";

const OverView = ({
    activity,
    athlete,
    streams,
}: {
    activity: Activity;
    athlete: Athlete;
    streams: Streams;
}) => {
    const who = athlete.profile;
    const firstSegment = activity.segment_efforts?.[0]?.segment;

    const where =
        activity.location.city && activity.location.country
            ? `${activity.location.city}, ${activity.location.country}`
            : activity.location.city ||
              activity.location.country ||
              (firstSegment?.city && firstSegment?.country
                  ? `${firstSegment.city}, ${firstSegment.country}`
                  : "Onbekende locatie");
    const when = formatDateAndTime(activity.start_date_local, 2);
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

    const weather = activity.weather
        ? [
              {
                  condition: activity.weather.condition,
                  temperature: activity.weather.temperature,
                  feels_like: activity.weather.feels_like,
                  humidity: activity.weather.humidity,
                  wind_speed: activity.weather.wind_speed,
                  wind_dir: activity.weather.wind_dir,
                  cloud_cover: activity.weather.cloud_cover,
              },
          ]
        : [];

    return (
        <>
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
                    <Details details={details} weather={weather} />
                    {(activity.gear || activity.device_name) && (
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
