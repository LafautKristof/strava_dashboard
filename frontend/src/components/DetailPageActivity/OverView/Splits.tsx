"use client";
import { Activities, Splits as SplitsType } from "@/app/types/activities";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatPace } from "@/helpers/getAveragePace";
import { getGapPace } from "@/helpers/getGapPace";
import { getSplitLabel } from "@/helpers/getSplitLabel";
import { ScrollArea } from "@/components/ui/scroll-area";
import dynamic from "next/dynamic";

const SplitsMap = dynamic(() => import("./SplitsMap"), { ssr: false });

export default function Splits({
    splits = [],
    activity,
    hoverKm,
    selectedSplit,
    onSelectedSplit,
}: {
    splits: SplitsType[];
    activity: Activities;
    hoverKm?: number | null;
    selectedSplit?: number | null;
    onSelectedSplit?: (index: number | null) => void;
}) {
    const handleRowClick = (index: number) => {
        onSelectedSplit?.(selectedSplit === index ? null : index);
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="w-full md:w-[35%] border rounded-md overflow-hidden bg-white shadow-sm">
                <div className="bg-gray-500 text-white text-center py-3 text-lg font-semibold">
                    Splits
                </div>

                <ScrollArea className="max-h-[400px] w-full">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>KM</TableHead>
                                <TableHead>Pace</TableHead>
                                <TableHead>GAP</TableHead>
                                <TableHead>Elev</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {splits && splits.length > 0 ? (
                                splits.map((split, index) => (
                                    <TableRow
                                        key={split.split}
                                        onClick={() => handleRowClick(index)}
                                        onTouchStart={() =>
                                            handleRowClick(index)
                                        }
                                        className={`cursor-pointer transition-colors ${
                                            selectedSplit === index
                                                ? "bg-blue-100"
                                                : "hover:bg-gray-100"
                                        }`}
                                    >
                                        <TableCell>
                                            {getSplitLabel(
                                                index,
                                                splits.length,
                                                split.distance
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {formatPace(split.average_speed)}
                                        </TableCell>
                                        <TableCell>
                                            {getGapPace(
                                                split.average_grade_adjusted_speed
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {split.elevation_difference?.toFixed(
                                                1
                                            )}
                                            m
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-center py-4 text-muted-foreground"
                                    >
                                        Geen splits beschikbaar
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>

            <div className="flex-1 border rounded-md shadow-sm overflow-hidden bg-white">
                <div className="h-[300px] md:h-[400px] relative">
                    <SplitsMap
                        activity={activity}
                        selectedSplit={selectedSplit ?? null}
                        hoverKm={hoverKm}
                    />
                </div>
            </div>
        </div>
    );
}
