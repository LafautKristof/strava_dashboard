const PercentageBar = ({ pct, hue }: { pct: number; hue: number }) => {
    return (
        <div className="w-40 h-3 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
            <div
                className="h-3 rounded-full transition-all"
                style={{
                    width: `${pct}%`,
                    backgroundColor: `hsl(${hue}, 100%, 45%)`,
                }}
            />
        </div>
    );
};
export default PercentageBar;
