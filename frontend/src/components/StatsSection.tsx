import { Activity } from "@/app/types/strava";

const StatsSection = ({ activities }: { activities: Activity[] }) => {
    const totalDistance =
        activities.reduce((acc, a) => acc + a.distance, 0) / 1000;
    const totalTime = activities.reduce((acc, a) => acc + a.moving_time, 0);
    const totalElevation = activities.reduce(
        (acc, a) => acc + (a.total_elevation_gain || 0),
        0
    );

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    };

    return (
        <section className="grid sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
                <p className="text-sm text-gray-500">Total Distance</p>
                <h2 className="text-2xl font-bold">
                    {totalDistance.toFixed(1)} km
                </h2>
            </div>
            <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
                <p className="text-sm text-gray-500">Total Time</p>
                <h2 className="text-2xl font-bold">{formatTime(totalTime)}</h2>
            </div>
            <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
                <p className="text-sm text-gray-500">Elevation Gain</p>
                <h2 className="text-2xl font-bold">
                    {totalElevation.toFixed(0)} m
                </h2>
            </div>
        </section>
    );
};

export default StatsSection;
