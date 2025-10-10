import { Activity } from "@/app/types/strava";
import Link from "next/link";
const ActivitiesSection = ({ activities }: { activities: Activity[] }) => {
    console.log(activities);
    return (
        <section>
            <h2 className="text-xl font-bold mb-4">Recent Activities</h2>
            <ul className="space-y-3">
                {activities.slice(0, 10).map((a) => (
                    <Link key={a.id} href={`/activities/${a.id}`}>
                        <li
                            key={a.id}
                            className="border border-gray-300 dark:border-gray-700 p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                            <p className="font-semibold">{a.name}</p>
                            <p className="text-sm text-gray-500">
                                {(a.distance / 1000).toFixed(2)} km — {a.type}
                            </p>
                        </li>
                    </Link>
                ))}
            </ul>
        </section>
    );
};

export default ActivitiesSection;
