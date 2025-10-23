import Picture from "./Picture";
import Name from "./Name";
import FriendsAndCountActivities from "./FriendsAndCountActivities";
import YourStreak from "./YourStreak";
import { Athlete } from "@/app/types/athlete";
import { DataActivity } from "@/app/types/activities";
import LatestActivity from "./LatestActivity";
import { getDaysThisWeek } from "@/helpers/getActivitiesThisWeek";
import { Card, CardContent } from "@/components/ui/card";
import { Activities8Weeks } from "@/app/types/activities12Weeks";
import TabLayout from "./Tab/TabLayout";

const LeftDashboardComponent = ({
    athlete,
    activities,
    activities8Weeks,
}: {
    athlete: Athlete;
    activities: DataActivity;
    activities8Weeks: Activities8Weeks[];
}) => {
    const daysThisWeek = getDaysThisWeek(activities.activities);

    return (
        <>
            <div className="flex flex-col gap-6">
                <Card className="relative bg-white text-black  p-4 rounded-md">
                    <CardContent>
                        <div className="flex items-center gap-3">
                            <div>
                                <Picture picture={athlete.profile_medium} />
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
                                activities={
                                    activities.activities[0].achievement_count
                                }
                            />
                        </div>
                        <LatestActivity activitie={activities.activities[0]} />

                        <YourStreak
                            streak={activities.weekly_streak}
                            days={daysThisWeek}
                        />
                    </CardContent>
                </Card>

                <Card className="bg-white  text-black  p-4 rounded-md mt-6">
                    <CardContent>
                        <TabLayout
                            activities8Weeks={activities8Weeks}
                            activities={activities}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
};
export default LeftDashboardComponent;
