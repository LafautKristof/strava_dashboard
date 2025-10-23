import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatDuration } from "@/helpers/getHeartZone";

export type ZoneCounts = {
    zone: string;
    name: string;
    min: number;
    max: number;
    seconds: number;
    percentage: number;
};

const HeartRateTable = ({ zoneCounts }: { zoneCounts: ZoneCounts[] }) => {
    const colors = ["#FFE4E1", "#FA8072", "#DC143C", "#FF0000", "#8B0000"];

    return (
        <Table className="min-w-[600px] w-full text-sm md:text-base lg:text-lg">
            <TableBody>
                {zoneCounts.map((zone, index) => (
                    <TableRow
                        key={zone.zone}
                        className="bg-gray-50 hover:bg-gray-100 transition rounded-lg"
                    >
                        <TableCell className="font-semibold text-gray-700 p-3 rounded-l-lg">
                            {zone.zone}
                        </TableCell>

                        <TableCell className="p-3">{zone.name}</TableCell>

                        <TableCell className="p-3">
                            {index === 0
                                ? `< ${Math.round(zone.max)}`
                                : index === zoneCounts.length - 1
                                ? `> ${Math.round(zone.min)}`
                                : `${Math.round(zone.min)} - ${Math.round(
                                      zone.max
                                  )}`}
                        </TableCell>

                        <TableCell className="p-3 text-right text-gray-600">
                            {formatDuration(zone.seconds)}
                        </TableCell>

                        <TableCell className="p-3 text-right font-medium rounded-r-lg text-gray-800">
                            {zone.percentage.toFixed(1)}%
                        </TableCell>

                        <TableCell className="p-0 w-full relative h-10 md:h-12">
                            <div className="w-full h-full relative bg-gray-200 overflow-hidden rounded-md">
                                <div
                                    className="absolute left-0 top-0 h-full transition-all duration-700 ease-out"
                                    style={{
                                        width: `${zone.percentage}%`,
                                        backgroundColor: colors[index],
                                    }}
                                />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default HeartRateTable;
