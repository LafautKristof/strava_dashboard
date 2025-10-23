import { Separator } from "@/components/ui/separator";

type Details = {
    distance: string;
    movingTime: string;
    pace: string;
    relativeEffort: number;
    elevation: number;
    elapsedTime: string;
    calories: number;
};
const Details = ({ details }: { details: Details[] }) => {
    return (
        <>
            <div className="flex gap-6 mb-4">
                <div>
                    <div className="flex items-baseline gap-1">
                        <h2 className="text-2xl">{details[0].distance} </h2>
                        <p className="text-lg">km</p>
                    </div>
                    <p className="text-xs text-gray-700   ">Distance</p>
                </div>{" "}
                <div>
                    <h2 className="text-2xl">{details[0].movingTime}</h2>
                    <p className="text-xs text-gray-700   ">Moving Time</p>
                </div>{" "}
                <div>
                    <div className="flex items-baseline gap-1">
                        <h2 className="text-2xl">{details[0].pace}</h2>
                        <p className="text-lg"> /km</p>
                    </div>{" "}
                    <p className="text-xs text-gray-700   ">Pace</p>
                </div>
                <div>
                    <h2 className="text-2xl">{details[0].relativeEffort}</h2>
                    <p className="text-xs text-gray-700   ">Relative Effort</p>
                </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 text-sm mt-4 mb-4 ">
                <div className="grid grid-cols-2">
                    <p>Elevation</p>
                    <p className="font-bold ">{details[0].elevation}</p>{" "}
                    <p>Calories</p>
                    <p className="font-bold">{details[0].calories}</p>
                </div>

                <div className="grid grid-cols-2">
                    <p>Elapsed Time</p>
                    <p className="font-bold">{details[0].elapsedTime}</p>
                </div>
            </div>
            <Separator />
        </>
    );
};
export default Details;
