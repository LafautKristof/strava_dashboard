import { Activities4Weeks } from "@/app/types/activities4Weeks";
import Calender4Weeks from "./Calender4Weeks";
import MyOverallStats from "./MyOverallStats";
import MyOverallChart from "./MyOverallChart";
import { Athlete } from "@/app/types/athlete";
import Picture from "./Picture";
import Name from "./Name";

const TotalActivities4Weeks = ({
    activities4Weeks,

    athlete,
}: {
    activities4Weeks: Activities4Weeks[];

    athlete: Athlete;
}) => {
    const count = activities4Weeks.reduce(
        (acc, activity) => acc + activity.activities.length,
        0
    );

    return (
        <>
            <div className="flex flex-col lg:flex-row justify-between items-center bg-white border shadow-sm rounded-2xl p-6 gap-6">
                <div className="flex flex-col justify-center items-center text-center">
                    <Picture picture={athlete.profile_medium} />
                    <Name name={`${athlete.firstname} ${athlete.lastname}`} />
                </div>

                <div className="text-center lg:text-left">
                    <p className="font-bold text-gray-700">Last Month</p>
                    <h2 className="text-6xl font-bold text-orange-500">
                        {count}
                    </h2>
                    <p className="text-sm text-gray-400">Total Activities</p>
                </div>

                <div className="w-full sm:w-2/3 lg:w-1/3">
                    <Calender4Weeks activities4Weeks={activities4Weeks} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                <div className="lg:col-span-2">
                    <MyOverallChart />
                </div>
                <div className="lg:col-span-1">
                    <MyOverallStats />
                </div>
            </div>
        </>
    );
};
export default TotalActivities4Weeks;
