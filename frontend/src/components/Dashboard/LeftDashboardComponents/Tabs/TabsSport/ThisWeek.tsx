import { ActivityType } from "@/src/types/activititiesStats";

const ThisWeek = ({
    totalDistanceKm,
    totalTime,
    type,
}: {
    totalDistanceKm?: number;
    totalTime?: string;
    type: ActivityType;
}) => {
    return (
        <div className="text-center my-4 mt-8 mb-8">
            <h2 className="text-md font-semibold mb-2">THIS WEEK</h2>
            {type !== "Workout" && (
                <p className="text-2xl font-medium">{totalDistanceKm} km</p>
            )}
            {totalTime && <p className="text-2xl font-medium">{totalTime}</p>}
        </div>
    );
};
export default ThisWeek;
