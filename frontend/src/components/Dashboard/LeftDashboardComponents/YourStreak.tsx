import { PiFireSimpleFill } from "react-icons/pi";
import WeekDays from "./WeekDays";
import { DaysThisWeek } from "@/app/types/streak";

const YourStreak = ({
    streak,
    days,
}: {
    streak: number;
    days: DaysThisWeek;
}) => {
    return (
        <div className="mt-8 sm:mt-10">
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">
                Jouw streak
            </h2>

            <div className="flex flex-col items-center justify-center gap-6 sm:gap-8">
                {/* 🔥 Streak Icon */}
                <div className="relative flex items-center justify-center">
                    <PiFireSimpleFill className="text-orange-500 text-6xl sm:text-7xl md:text-8xl drop-shadow-md" />
                    <p className="absolute inset-0 flex items-center justify-center text-2xl sm:text-3xl font-bold text-white">
                        {streak}
                    </p>
                </div>

                {/* 📅 Weekdagen */}
                <WeekDays daysThisWeek={days} />
            </div>
        </div>
    );
};

export default YourStreak;
