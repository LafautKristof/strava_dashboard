import MiddleDashboardComponent from "@/components/Dashboard/MiddleDashboardComponents/MiddleDashboardComponent";
import LeftDashboardComponent from "@/components/Dashboard/LeftDashboardComponents/LeftDashboardComponent";

import { get8WeeksAgo } from "@/helpers/get8WeeksAgo";

const page = async () => {
    const after = get8WeeksAgo();
    const [resAthlete, resActivities, resActivities8Weeks] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/athlete`, {
            cache: "no-store",
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/activities`, {
            cache: "no-store",
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/activities?after=${after}`, {
            cache: "no-store",
        }),
    ]);

    const [dataAthlete, dataActivities, dataActivities8Weeks] =
        await Promise.all([
            resAthlete.json(),
            resActivities.json(),
            resActivities8Weeks.json(),
        ]);

    return (
        <main className="flex flex-col lg:flex-row w-full min-h-[80vh] items-start gap-6">
            <div className="w-full lg:w-1/3">
                <LeftDashboardComponent
                    athlete={dataAthlete}
                    activities={dataActivities}
                    activities8Weeks={dataActivities8Weeks}
                />
            </div>
            <div className="w-full lg:flex-1">
                <MiddleDashboardComponent
                    athlete={dataAthlete}
                    activities={dataActivities}
                />
            </div>
        </main>
    );
};
export default page;
