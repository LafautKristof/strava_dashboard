import { Separator } from "@/components/ui/separator";
import { formatPace } from "@/helpers/formatPace";
import { getTimeInHoursMinutes } from "@/helpers/getHours";

const DistElevTimeAch = ({
    distance,
    elevation,
    time,
    description,
    pace,
}: {
    distance: number;
    elevation: number;
    time: number;
    description: string | null;
    pace: number;
}) => {
    return (
        <div className="mt-6 flex justify-between items-start w-full">
            <div className="flex flex-col flex-grow">
                {description && (
                    <p className="font-semibold text-lg mb-2">{description}</p>
                )}
                <div className="flex gap-4 items-start flex-wrap">
                    {distance > 0 && (
                        <div>
                            <h4 className="font-semibold">Distance</h4>
                            <p className="text-2xl">
                                {(distance / 1000).toFixed(2)} km
                            </p>
                        </div>
                    )}
                    {elevation > 0 && distance > 0 && (
                        <>
                            <Separator
                                orientation="vertical"
                                className="h-12"
                            />
                            <div>
                                <h4 className="font-semibold">Elevation</h4>
                                <p className="text-2xl">{elevation} m</p>
                            </div>
                        </>
                    )}
                    <Separator orientation="vertical" className="h-12" />
                    <div>
                        <h4 className="font-semibold">Time</h4>
                        <p className="text-2xl">
                            {getTimeInHoursMinutes(time)}
                        </p>
                    </div>
                    {pace > 0 && (
                        <>
                            <Separator
                                orientation="vertical"
                                className="h-12"
                            />
                            <div>
                                <h4 className="font-semibold">Pace</h4>
                                <p className="text-2xl">{formatPace(pace)}</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DistElevTimeAch;
