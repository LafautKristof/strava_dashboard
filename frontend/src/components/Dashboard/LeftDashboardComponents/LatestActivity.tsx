import { Activities } from "@/app/types/activities";
import { Separator } from "@/components/ui/separator";
import getDateWithoutTime from "@/helpers/getDate";
import Link from "next/link";

const LatestActivity = ({ activitie }: { activitie: Activities }) => {
    const date = getDateWithoutTime(new Date(activitie.start_date_local));

    return (
        <>
            <div className="my-6 sm:my-8">
                <h2 className="text-base sm:text-lg font-semibold text-muted-foreground mb-3">
                    Laatste activiteit
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
