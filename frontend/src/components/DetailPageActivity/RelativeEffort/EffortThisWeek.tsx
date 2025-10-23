import { getEffortLabel } from "@/helpers/getEffortLabel";
import { getEffortText } from "@/helpers/getEffortText";

const EffortThisWeek = ({
    sufferscore,
    zoneStatus,
}: {
    sufferscore: number;
    zoneStatus: string;
}) => {
    const zoneColor =
        zoneStatus === "above"
            ? "#ef4444"
            : zoneStatus === "below"
            ? "#ee82ee"
            : "#a855f7";
    return (
        <div className=" overflow-hidden p-8">
            <p className="text-2xl font-semibold">Relative Effort</p>
            <div className="flex items-end gap-2">
                <h2
                    className="text-8xl font-semibold leading-none"
                    style={{ color: zoneColor }}
                >
                    {sufferscore}
                </h2>
                <p
                    className="text-lg font-bold mb-1"
                    style={{ color: zoneColor }}
                >
                    {getEffortLabel(sufferscore)}{" "}
                </p>
            </div>

            <p className="text-m font-semibold">{getEffortText(zoneStatus)}</p>
        </div>
    );
};
export default EffortThisWeek;
