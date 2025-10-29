import { Athlete } from "@/app/types/athlete";
import Picture from "./Picture";
import Name from "./Name";

import TotalActivities4Weeks from "./TotalActivities4Weeks";
import { Activities4Weeks } from "@/app/types/activities4Weeks";
import { Activities } from "@/app/types/activities";

const Last4Weeks = ({
    athlete,
    activities4Weeks,
}: {
    athlete: Athlete;
    activities4Weeks: Activities4Weeks[];
}) => {
    return (
        <div className="flex flex-col w-full gap-4">
            <TotalActivities4Weeks
                athlete={athlete}
                activities4Weeks={activities4Weeks}
            />
        </div>
    );
};
export default Last4Weeks;
