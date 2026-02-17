import { ActivityType } from "@/types/activititiesStats";

const ThisWeek = ({
    totalDistanceKm,
    formattedTime,
    type,
}: {
    totalDistanceKm: number | undefined;
    formattedTime: string | undefined;
    type: ActivityType;
}) => {
    return (
        <div className="text-center my-4 mt-8 mb-8">
            <h2 className="text-md font-semibold mb-2">THIS YEAR</h2>
            {totalDistanceKm && type !== "Workout" && (
                <p className="text-2xl font-medium">{totalDistanceKm} km</p>
            )}
            {type === "Workout" && (
                <p className="text-2xl font-medium">{formattedTime}</p>
            )}
        </div>
    );
};
export default ThisWeek;
