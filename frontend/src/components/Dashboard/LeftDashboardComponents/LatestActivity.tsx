import { Activity } from "@/app/types/activity";
import { Separator } from "@/components/ui/separator";
import formatDateAndTime from "@/helpers/formatDateAndTime";

import Link from "next/link";

const LatestActivity = ({ activitie }: { activitie: Activity }) => {
    const date = formatDateAndTime(activitie.start_date_local, 1);
    return (
        <>
            <div className="my-6 sm:my-8">
                <h2 className="text-base sm:text-lg font-semibold text-muted-foreground mb-3">
                    Latest activity
                </h2>

                <Link
                    href={`/activities/${activitie.id}`}
                    className="block group"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 bg-gray-50 hover:bg-orange-50 transition rounded-md p-3 cursor-pointer">
                        <h3 className="font-bold text-lg sm:text-xl group-hover:text-orange-500">
                            {activitie.name}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-500 font-medium group-hover:text-orange-400">
                            {date}
                        </p>
                    </div>
                </Link>
            </div>

            <Separator />
        </>
    );
};

export default LatestActivity;
