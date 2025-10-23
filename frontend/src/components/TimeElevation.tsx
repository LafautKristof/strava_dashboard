import { Separator } from "@/components/ui/separator";

const TimeElevation = ({
    formattedTime,
    totalElevationGain,
}: {
    formattedTime: string;
    totalElevationGain?: number | null;
}) => {
    return (
        <div className="flex justify-center items-center gap-4 my-4 text-lg font-medium">
            {formattedTime === "0m" ? "--:--" : formattedTime}{" "}
            <Separator orientation="vertical" />
            {totalElevationGain === null ? "" : `${totalElevationGain} m`}
        </div>
    );
};
export default TimeElevation;
