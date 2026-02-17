import HeaderStats from "@/components/MyStats/HeaderStats";

import MyOverallChart from "@/components/MyStats/MyOverallChart";
import MyOverallStats from "@/components/MyStats/MyOverallStats";

const page = async () => {
    const resAthlete = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/athlete`,
        {
            cache: "no-store",
        },
    );

    const athlete = await resAthlete.json();

    return (
        <>
            <div>
                <HeaderStats athlete={athlete} />
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
export default page;
