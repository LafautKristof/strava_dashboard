"use client";

import { Activities } from "@/app/types/activities";
import { getTypeIcon } from "@/helpers/getTypeIcon";
import Link from "next/link";

export default function ActivitiesListClient({
    activities,
}: {
    activities: Activities[];
}) {
    return (
        <div className="space-y-3">
            {activities.map((a) => (
                <Link
                    href={`/activities/${a.id}`}
                    key={a.id}
                    className="flex items-center justify-between p-3 rounded-md bg-white hover:bg-gray-100 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{getTypeIcon(a.type)}</span>
                        <span className="font-medium">{a.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                        {Math.round(a.distance / 1000)} km
                    </span>
                </Link>
            ))}
        </div>
    );
}
