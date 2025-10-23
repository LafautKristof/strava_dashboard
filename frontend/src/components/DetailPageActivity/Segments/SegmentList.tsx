"use client";
import { SegmentEffort } from "@/app/types/activities";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { calculatePaceAndGap } from "@/helpers/calculatePaceAndGap";

import { getTimeInHoursMinutes } from "@/helpers/getHours";
const SegmentList = ({
    segment,
    onHoverSegment,
}: {
    segment: SegmentEffort[];
    onHoverSegment?: (seg: SegmentEffort | null) => void;
}) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]"></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead>Pace</TableHead>
                    <TableHead>GAP</TableHead>
                    <TableHead>Elev Diff</TableHead>
                    <TableHead>HR</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {segment.map((seg) => {
                    const elevationDiff =
                        seg.segment.elevation_high - seg.segment.elevation_low;

                    const { pace, gap } = calculatePaceAndGap({
                        distance: seg.distance,
                        moving_time: seg.elapsed_time,
                        average_grade: seg.segment.average_grade,
                    });

                    return (
                        <TableRow
                            key={seg.id}
                            onMouseEnter={() => onHoverSegment?.(seg)}
                            onMouseLeave={() => onHoverSegment?.(null)}
                        >
                            <TableCell className="text-center"></TableCell>
                            <TableCell>{seg.name}</TableCell>
                            <TableCell>
                                {getTimeInHoursMinutes(seg.elapsed_time)}
                            </TableCell>
                            <TableCell>
                                {(seg.distance / 1000).toFixed(2)} km
                            </TableCell>
                            <TableCell>{pace}</TableCell>
                            <TableCell>{gap}</TableCell>
                            <TableCell>{Math.round(elevationDiff)} m</TableCell>
                            <TableCell>
                                {seg.average_heartrate
                                    ? `${seg.average_heartrate.toFixed(0)} bpm`
                                    : "—"}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};
export default SegmentList;
