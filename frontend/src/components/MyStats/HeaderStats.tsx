"use client";
import { Athlete } from "@/src/types/athlete";
import Picture from "./Picture";
import Name from "./Name";
import { ActivitiesCurrentMonth } from "@/src/types/activitiesCurrentMonth";
import MonthlyCalendar from "./MonthlyCalendar";
import MonthlyPieChart from "./MonthlyPieChart";
import { useState } from "react";

const HeaderStats = ({ athlete }: { athlete: Athlete }) => {
    const [monthData, setMonthData] = useState<ActivitiesCurrentMonth[]>([]);
    const [loading, setLoading] = useState(false);

    return (
        <div className="w-full max-w-7xl mx-auto px-4 space-y-8 mt-20">
            {/* TOP SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                {/* Profile */}
                <div className="flex flex-col justify-center items-center text-center lg:items-start lg:text-left">
                    <Picture picture={athlete.profile} />
                    <Name name={`${athlete.firstname} ${athlete.lastname}`} />
                </div>

                {/* Stats */}
                <div className="lg:col-span-2 text-center lg:text-left">
                    <p className="font-bold text-gray-500 uppercase tracking-wide text-sm">
                        This Month
                    </p>

                    <h2 className="text-6xl font-bold text-orange-500">
                        {loading
                            ? "--"
                            : monthData.reduce(
                                  (acc, day) => acc + day.activities.length,
                                  0,
                              )}
                    </h2>

                    <p className="font-bold text-gray-500 uppercase tracking-wide text-sm mt-6">
                        Total Activities
                    </p>

                    <h2 className="text-6xl font-bold text-orange-500">
                        {athlete.total_activities}
                    </h2>
                </div>
            </div>

            {/* BOTTOM SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Calendar */}
                <div className="lg:col-span-2">
                    <MonthlyCalendar
                        monthData={monthData}
                        setMonthData={setMonthData}
                        setLoading={setLoading}
                        loading={loading}
                    />
                </div>

                {/* Pie Chart */}
                <div className="h-64 flex items-center justify-center">
                    {!loading && monthData.length > 0 && (
                        <MonthlyPieChart activitiesCurrentMonth={monthData} />
                    )}
                </div>
            </div>
        </div>
    );
};
export default HeaderStats;
