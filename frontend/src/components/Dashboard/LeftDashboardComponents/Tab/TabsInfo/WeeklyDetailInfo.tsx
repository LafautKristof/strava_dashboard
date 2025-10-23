"use client";

import { Activities8Weeks } from "@/app/types/activities12Weeks";

export default function WeeklyDetailInfo({
    data,
}: {
    data: Activities8Weeks | null;
}) {
    if (!data) return null;
    const heartRates = data.activities.flatMap((a) => [
        a.min_heartrate,
        a.max_heartrate,
    ]);

    const minHr = heartRates.length > 0 ? Math.min(...heartRates) : null;
    const maxHr = heartRates.length > 0 ? Math.max(...heartRates) : null;

    return (
        <div className="flex justify-between items-center my-3 px-2  gap-4 text-sm">
            <div className="flex flex-col items-center">
                <p className="text-2xl">Score</p>
                <p className="font-semibold">{data.total_effort}</p>
            </div>
            <div className="flex flex-col items-center">
                <p className="text-2xl">Range</p>
                <p className="font-semibold">
                    {minHr && maxHr ? `${minHr}–${maxHr}` : "0"}
                </p>
            </div>
        </div>
    );
}
