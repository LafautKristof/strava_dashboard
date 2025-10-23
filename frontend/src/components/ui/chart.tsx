"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function ChartContainer({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) {
    return (
        <div
            className={cn(
                "flex w-full items-center justify-center rounded-xl bg-muted/50 p-4",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function ChartTooltip({ content }: { content: React.ReactNode }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent>{content}</TooltipContent>
        </Tooltip>
    );
}

/**
 * Standaard tooltip-inhoud
 */
export function ChartTooltipContent({
    label,
    value,
}: {
    label?: string;
    value?: string | number;
}) {
    if (!label && !value) return null;

    return (
        <div className="text-sm">
            <div className="font-medium">{label}</div>
            <div className="text-muted-foreground">{value}</div>
        </div>
    );
}
