import MenuDetailActivity from "@/components/DetailPageActivity/MenuDetailActivity/MenuDetailActivity";
import { notFound } from "next/navigation";
export default async function ActivityPage({
    params,
}: {
    params: { id: string };
}) {
    const { id } = await params;

    try {
        const [resAthlete, resActivities, resStreams] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/athlete`, {
                cache: "force-cache",
            }),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/activity/${id}`, {
                cache: "no-store",
            }),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/streams/${id}`, {
                cache: "no-store",
            }),
        ]);

        if (!resAthlete.ok || !resActivities.ok || !resStreams.ok) {
            return notFound();
        }
        const [dataAthlete, dataActivities, dataStreams] = await Promise.all([
            safeJson(resAthlete),
            safeJson(resActivities),
            safeJson(resStreams),
        ]);

        if (!dataAthlete || !dataActivities || !dataStreams) {
            return notFound();
        }

        return (
            <main>
                <MenuDetailActivity
                    activity={dataActivities}
                    athlete={dataAthlete}
                    streams={dataStreams}
                />
            </main>
        );
    } catch (error) {
        console.error("❌ Activity fetch error:", error);
        return notFound();
    }
}
async function safeJson(res: Response) {
    try {
        return await res.json();
    } catch {
        return null;
    }
}
