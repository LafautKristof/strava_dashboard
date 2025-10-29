import ActivitiesListClient from "@/components/ActivitiesListClient";

export default async function ActivitiesByDayPage({
    params,
}: {
    params: { date: string };
}) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/activities/day/${params.date}`,
        { cache: "no-store" }
    );
    const activities = await res.json();

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">
                Activities at {params.date}
            </h1>
            <ActivitiesListClient activities={activities} />
        </div>
    );
}
