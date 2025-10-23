"use client";

import { getAge } from "@/helpers/getAge";
import { getHeartRateDistribution } from "@/helpers/getHeartZone";
import Header from "../OverView/Header";
import StatsThisActivity from "../RelativeEffort/StatsThisActivity";
import HeartRateTable from "./HeartRateTable";
import { Athlete } from "@/app/types/athlete";
import { Activities } from "@/app/types/activities";

export default function HeartRate({
    heartRate,
    athlete,
    type,
    activity,
}: {
    heartRate: number[];
    athlete: Athlete;
    type: string;
    activity: Activities;
}) {
    const HRmax = 220 - getAge(process.env.NEXT_PUBLIC_BIRTHDATE!);
    const zoneCounts = getHeartRateDistribution(heartRate, HRmax);

    return (
        <section className="p-4 md:p-6 lg:p-8">
            <div className="bg-gray-200 border mb-4 rounded-lg shadow-sm">
                <Header
                    athlete={`${athlete.firstname} ${athlete.lastname}`}
                    workout={type}
                />
            </div>

            <div className="border bg-gray-100 p-4 md:p-6 font-semibold rounded-lg shadow-sm">
                <StatsThisActivity
                    activity={activity}
                    relativeEffort={activity.suffer_score}
                />
            </div>

            <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-4 text-gray-800">
                Heart Rate Analysis
            </h2>

            <div className="w-full overflow-x-auto rounded-lg shadow-sm">
                <HeartRateTable zoneCounts={zoneCounts} />
            </div>
        </section>
    );
}
