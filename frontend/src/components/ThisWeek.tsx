const ThisWeek = ({ totalDistanceKm }: { totalDistanceKm?: number }) => {
    return (
        <div className="text-center my-4 mt-8 mb-8">
            <h2 className="text-md font-semibold mb-2">THIS WEEK</h2>
            {totalDistanceKm && (
                <p className="text-2xl font-medium">{totalDistanceKm} km</p>
            )}
        </div>
    );
};
export default ThisWeek;
