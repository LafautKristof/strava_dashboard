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
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 pt-10 px-4 sm:px-6 lg:px-10">
            <LeftDashboardComponent
                athlete={dataAthlete}
                activities={dataActivities}
                activities8Weeks={dataActivities8Weeks}
            />
            <MiddleDashboardComponent
                athlete={dataAthlete}
                activities={dataActivities}
            />
        </div>
    );
};
export default page;
