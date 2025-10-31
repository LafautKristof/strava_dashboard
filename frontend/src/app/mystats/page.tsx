import Last4Weeks from "@/components/MyStats/Last4Weeks";
import { get4WeeksAgo } from "@/helpers/get4WeeksAgo";

const page = async () => {
    const after = get4WeeksAgo();
    const [resAthlete, resActivities4Weeks] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/athlete`, {
            cache: "no-store",
        }),

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/activities?after=${after}`, {
            cache: "no-store",
        }),
    ]);

    const [dataAthlete, dataActivities4Weeks] = await Promise.all([
        resAthlete.json(),

        resActivities4Weeks.json(),
    ]);

    return (
        <div>
            <Last4Weeks
                athlete={dataAthlete}
                activities4Weeks={dataActivities4Weeks}
            />
        </div>
    );
};
export default page;
