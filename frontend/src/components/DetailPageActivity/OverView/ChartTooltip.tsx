import { TooltipProps } from "recharts";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/src/components/ui/card";

interface CustomTooltipProps extends TooltipProps<number, string> {
    visibleMetrics: string[];
}

export function ChartTooltip({
    active,
    payload,
    visibleMetrics,
}: CustomTooltipProps) {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload;

    return (
        <Card className="p-0 bg-white text-black">
            <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm font-semibold">
                    🏃‍♂️ {data.km?.toFixed(1)} km
                </CardTitle>
            </CardHeader>

            <CardContent className="p-2 pt-0 space-y-1 text-xs">
                {visibleMetrics.includes("heartrate") && data.heartrate && (
                    <p>❤️ {Math.round(data.heartrate)} bpm</p>
                )}
                {visibleMetrics.includes("pace") && data.pace && (
                    <p>⏱️ {data.pace.toFixed(1)} min/km</p>
                )}
                {visibleMetrics.includes("gap") && data.gap && (
                    <p>⚖️ {data.gap.toFixed(1)} min/km (GAP)</p>
                )}
                {visibleMetrics.includes("elevation") && data.elevation && (
                    <p>🏔️ {data.elevation.toFixed(1)} m</p>
                )}
            </CardContent>
        </Card>
    );
}
