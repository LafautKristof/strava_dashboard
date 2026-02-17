import LeftDashboardComponent from "@/components/Dashboard/LeftDashboardComponents/LeftDashboardComponent";
import MiddleDashboardComponent from "@/components/Dashboard/MiddleDashboardComponents/MiddleDashboardComponent";

const DashboardPage = async () => {
    const [resAthlete, resActivities, resActivitiesLast8Weeks] =
        await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/athlete`, {
                cache: "no-store",
            }),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/activities/stats`, {
                cache: "no-store",
            }),
            fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/activities/weeks?range=8`,
                { cache: "no-store" },
            ),
        ]);

    const [athlete, activitiesStats, activitiesLast8Weeks] = await Promise.all([
        resAthlete.json(),
        resActivities.json(),
        resActivitiesLast8Weeks.json(),
    ]);

    return (
        <div className="flex flex-col lg:flex-row min-h-[80vh] items-start gap-6">
            <div className="w-full lg:w-1/3">
                <LeftDashboardComponent
                    athlete={athlete}
                    activitiesStats={activitiesStats}
                    activitiesLast8Weeks={activitiesLast8Weeks}
                />
            </div>
            <div className="w-full lg:w-2/3">
                <MiddleDashboardComponent athlete={athlete} />
            </div>
        </div>
    );
};
export default DashboardPage;
