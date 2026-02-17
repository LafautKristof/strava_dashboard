import { getZoneColor } from "@/helpers/ChartHelpers/getZoneColor";
type CustomDotProps = {
    cx?: number;
    cy?: number;
    payload?: {
        total_effort: number;
        minZone: number;
        maxZone: number;
    };
};

type CustomActiveDotProps = CustomDotProps & {
    viewBox?: { width?: number; height?: number };
};
export const CustomDot = ({ cx, cy, payload }: CustomDotProps) => {
    if (typeof cx !== "number" || typeof cy !== "number" || !payload)
        return <g />;

    const { total_effort, minZone, maxZone } = payload;
    const color = getZoneColor(total_effort, minZone, maxZone);

    return (
        <g key={`${cx}-${cy}`}>
            <circle
                cx={cx}
                cy={cy}
                r={6}
                fill={color}
                stroke="#fff"
                strokeWidth={2}
                style={{ transition: "all 0.2s ease" }}
            />
        </g>
    );
};

export const CustomActiveDot = ({ cx, cy, viewBox }: CustomActiveDotProps) => {
    if (typeof cx !== "number" || typeof cy !== "number") return <g />;

    return (
        <g>
            <line
                x1={cx}
                x2={cx}
                y1={cy}
                y2={viewBox?.height || 320}
                stroke="#9ca3af"
                strokeDasharray="4 2"
                strokeWidth={1.5}
            />
            <circle
                cx={cx}
                cy={cy}
                r={8}
                fill="#2563eb"
                stroke="#fff"
                strokeWidth={2}
            />
        </g>
    );
};
