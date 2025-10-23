"use client";

import { TooltipProps } from "recharts";
import { ChartTooltip } from "./ChartTooltip";

interface WrapperProps {
    visibleMetrics?: string[];
}

export function ChartTooltipWrapper({ visibleMetrics = [] }: WrapperProps) {
    return function RenderTooltip(props: TooltipProps<number, string>) {
        return <ChartTooltip {...props} visibleMetrics={visibleMetrics} />;
    };
}
