import { ActivityType } from "@/types/activititiesStats";
import { Separator } from "@/components/ui/separator";

const TimeElevation = ({
    formattedTime,
    totalElevationGain,
    type,
}: {
    formattedTime: string;
    totalElevationGain?: number;
    type: ActivityType;
}) => {
    return (
        <div className="flex justify-center items-center gap-4 my-4 text-lg font-medium">
            {formattedTime === "0 min" ? "--:--" : formattedTime}{" "}
            <Separator orientation="vertical" />
            {totalElevationGain === null || type === "Workout"
                ? ""
                : `${totalElevationGain} m`}
        </div>
    );
};
export default TimeElevation;
