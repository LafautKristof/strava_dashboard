import { ActivitiesStats } from "@/app/types/activititiesStats";

import { Athlete } from "@/app/types/athlete";
import { Card, CardContent } from "@/components/ui/card";
import Picture from "./Picture";
import Name from "./Name";
import FriendsAndCountActivities from "./FriendsAndCountActivities";
import LatestActivity from "./LatestActivity";
import YourStreak from "./YourStreak";

import { getActivitiesThisWeek } from "@/helpers/getActivitiesThisWeek";
import TabLayout from "./Tabs/TabLayout";
import { ActivitiesGroupedByWeek } from "@/app/types/activitiesGroupedByWeek";
import { getCurrentISOWeek } from "@/helpers/getCurrentWeek";
const LeftDashboardComponent = ({
    athlete,
    activitiesStats,
    activitiesLast8Weeks,
}: {
    athlete: Athlete;
    activitiesStats: ActivitiesStats;
    activitiesLast8Weeks: ActivitiesGroupedByWeek[];
}) => {
    const currentWeek = getCurrentISOWeek();
    //current week => 2026-w07
    const currentWeekData =
        activitiesLast8Weeks.find((w) => w.week === currentWeek) ??
        activitiesLast8Weeks.at(-1);

    //current week data => {activities: [],end: "2026-02-15T00:00:00+00:00"start: "2026-02-09T00:00:00+00:00"total_effort: 0week: "2026-W07"
    const activitiesThisWeek = getActivitiesThisWeek(
        currentWeekData?.activities ?? [],
    );
    //console.log("activities this week", activitiesThisWeek); // activities[...]
    return (
        <>
            <div className="flex flex-col gap-6">
                <Card className="relative bg-white text-black  p-4 rounded-md">
                    <CardContent>
                        <div className="flex items-center gap-3">
                            <div>
                                <Picture picture={athlete.profile} />
                            </div>

                            <div className="text-left">
                                <Name
                                    name={`${athlete.firstname} ${athlete.lastname}`}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col justify-center gap-4 mt-4">
                            <FriendsAndCountActivities
                                following={athlete.friend_count}
                                followers={athlete.follower_count}
                                activities={activitiesStats.total_activities}
                            />
                        </div>
                        <LatestActivity
                            activitie={activitiesStats.last_activity}
                        />

                        <YourStreak
                            streak={activitiesStats.weekly_streak}
                            days={activitiesThisWeek}
                        />
                    </CardContent>
                </Card>

                <Card className="bg-white  text-black  p-4 rounded-md mt-6">
                    <CardContent>
                        <TabLayout
                            activities8Weeks={activitiesLast8Weeks}
                            activitiesStats={activitiesStats}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
};
export default LeftDashboardComponent;
