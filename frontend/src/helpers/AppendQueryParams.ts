import { DateRange } from "react-day-picker";

export function AppendQueryParams({
    pageNumber,
    perPage,
    filterName,
    filterDateRange,
    filterType,
    minDistance,
    maxDistance,
    minTime,
    maxTime,
    gear,
}: {
    pageNumber: number;
    perPage: number;
    filterName: string;
    filterDateRange: DateRange | undefined;
    filterType: string;
    minDistance: number;
    maxDistance: number;
    minTime: number;
    maxTime: number;
    gear: string;
}) {
    const params = new URLSearchParams();
    params.append("page", pageNumber.toString());
    params.append("per_page", perPage.toString());
    if (filterName) params.append("name", filterName);
    if (filterDateRange?.from)
        params.append("from", filterDateRange.from.toLocaleDateString("sv-SE"));

    if (filterDateRange?.to)
        params.append("to", filterDateRange.to.toLocaleDateString("sv-SE"));
    if (filterType && filterType !== "All") params.append("type", filterType);
    if (minDistance) params.append("min_distance", minDistance.toString());
    if (maxDistance) params.append("max_distance", maxDistance.toString());
    if (minTime) params.append("min_time", minTime.toString());
    if (maxTime) params.append("max_time", maxTime.toString());
    if (gear !== "") params.append("gear", gear);
    return params;
}
