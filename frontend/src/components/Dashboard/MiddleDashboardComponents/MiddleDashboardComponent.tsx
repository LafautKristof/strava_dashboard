"use client";

import { ActivityList } from "@/app/types/activityList";
import { Athlete } from "@/app/types/athlete";
import { useCallback, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import FilterForm from "./FilterForm";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { AppendQueryParams } from "@/helpers/AppendQueryParams";
import ActivitieCard from "@/components/ActivitieCard";
import { getTimeInHoursMinutes2 } from "@/helpers/formatDateAndTime";
import FilterBadges from "./FilterBadges";

const DEFAULT_MIN_DISTANCE = 0;
const DEFAULT_MAX_DISTANCE = 100000;
const DEFAULT_MIN_TIME = 0;
const DEFAULT_MAX_TIME = 28800;
const MiddleDashboardComponent = ({ athlete }: { athlete: Athlete }) => {
    const [loading, setLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [hasMore, setHasMore] = useState(true);
    const [activities, setActivities] = useState<ActivityList[]>([]);

    const [filterName, setFilterName] = useState("");
    const [filterDateRange, setFilterDateRange] = useState<
        DateRange | undefined
    >();
    const [filterType, setFilterType] = useState("All");
    const [minDistance, setMinDistance] = useState(0);
    const [maxDistance, setMaxDistance] = useState(100000);
    const [minTime, setMinTime] = useState(0);
    const [maxTime, setMaxTime] = useState(28800);
    const [gear, setGear] = useState<{ id: string; name: string } | null>(null);

    const isFetchingRef = useRef(false);

    const activeFilterCount = [
        filterName,
        filterDateRange?.from,
        filterType !== "All" ? filterType : null,
        minDistance !== DEFAULT_MIN_DISTANCE ||
        maxDistance !== DEFAULT_MAX_DISTANCE
            ? true
            : null,
        minTime !== DEFAULT_MIN_TIME || maxTime !== DEFAULT_MAX_TIME
            ? true
            : null,
        gear?.id,
    ].filter(Boolean).length;
    const fetchActivities = useCallback(
        async (pageNumber: number, signal: AbortSignal) => {
            if (isFetchingRef.current) return;

            isFetchingRef.current = true;
            setLoading(true);
            const params = AppendQueryParams({
                pageNumber,
                perPage,
                filterName,
                filterDateRange,
                filterType,
                minDistance,
                maxDistance,
                minTime,
                maxTime,
                gear: gear?.id ?? "",
            });
            console.log("before", params);
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/activities?${params.toString()}`,
                    {
                        cache: "no-store",
                        signal,
                    },
                );

                const activities: ActivityList[] = await res.json();
                if (activities.length < perPage) {
                    setHasMore(false);
                }

                setActivities((prev) =>
                    pageNumber === 1 ? activities : [...prev, ...activities],
                );
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
                isFetchingRef.current = false;
            }
        },
        [
            filterName,
            filterDateRange,
            filterType,
            minDistance,
            maxDistance,
            minTime,
            maxTime,
            perPage,
            gear,
        ],
    );

    const loaderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    setPageNumber((prev) => prev + 1);
                }
            },
            { threshold: 1 },
        );
        const current = loaderRef.current;
        if (current) {
            observer.observe(current);
        }

        return () => {
            if (current) observer.unobserve(current);
        };
    }, [hasMore, loading]);

    useEffect(() => {
        const controller = new AbortController();
        fetchActivities(pageNumber, controller.signal);
        return () => controller.abort();
    }, [pageNumber, fetchActivities]);

    useEffect(() => {
        setActivities([]);
        setHasMore(true);
        setPageNumber(1);
    }, [
        filterName,
        filterDateRange,
        filterType,
        minDistance,
        maxDistance,
        minTime,
        maxTime,
        gear,
    ]);

    function handleFilterName(name: string) {
        setFilterName(name);
    }
    function handleFilterDateRange(range: DateRange | undefined) {
        setFilterDateRange(range);
    }
    function handleFilterType(type: string) {
        setFilterType(type);
    }
    function handleFilterDistance(range: { min: number; max: number }) {
        setMinDistance(range.min);
        setMaxDistance(range.max);
    }
    function handleFilterTime(range: { min: number; max: number }) {
        setMinTime(range.min);
        setMaxTime(range.max);
    }

    function handleFilterGear(id: string, name: string) {
        setGear({ id, name });
    }

    function onReset() {
        setFilterName("");
        setFilterDateRange(undefined);
        setFilterType("All");
        setMinDistance(0);
        setMaxDistance(100000);
        setMinTime(0);
        setMaxTime(28800);
        setGear(null);
        activeFilterCount;
    }
    return (
        <div className="mb-6 space-y-4">
            {/* Top row: Filter button + Clear button */}
            <div className="flex items-center justify-between mt-4">
                <FilterForm
                    onFilterName={handleFilterName}
                    name={filterName}
                    onFilterDateRange={handleFilterDateRange}
                    dateRange={
                        filterDateRange ?? { from: undefined, to: undefined }
                    }
                    onFilterType={handleFilterType}
                    type={filterType}
                    onReset={onReset}
                    onFilterDistance={handleFilterDistance}
                    onFilterTime={handleFilterTime}
                    minDistance={minDistance}
                    maxDistance={maxDistance}
                    minTime={minTime}
                    maxTime={maxTime}
                    activeFilterCount={activeFilterCount}
                    gear={gear}
                    onFilterGear={handleFilterGear}
                />
                {(filterName ||
                    filterType !== "All" ||
                    minDistance !== DEFAULT_MIN_DISTANCE ||
                    maxDistance !== DEFAULT_MAX_DISTANCE ||
                    minTime !== DEFAULT_MIN_TIME ||
                    maxTime !== DEFAULT_MAX_TIME ||
                    gear ||
                    filterDateRange?.from) && (
                    <Button
                        variant="ghost"
                        onClick={onReset}
                        className="text-sm text-muted-foreground hover:text-red-500"
                    >
                        Clear all
                    </Button>
                )}
            </div>
            <div className="flex flex-wrap gap-2 ">
                {filterName && (
                    <FilterBadges onClear={() => setFilterName("")}>
                        {filterName}
                    </FilterBadges>
                )}

                {filterDateRange?.from && filterDateRange.to && (
                    <FilterBadges onClear={() => setFilterDateRange(undefined)}>
                        {format(filterDateRange.from, "dd MMM yyyy")} –{" "}
                        {format(filterDateRange.to, "dd MMM yyyy")}
                    </FilterBadges>
                )}

                {filterType !== "All" && (
                    <FilterBadges onClear={() => setFilterType("All")}>
                        {filterType}
                    </FilterBadges>
                )}

                {(minDistance !== DEFAULT_MIN_DISTANCE ||
                    maxDistance !== DEFAULT_MAX_DISTANCE) && (
                    <FilterBadges
                        onClear={() => {
                            setMinDistance(DEFAULT_MIN_DISTANCE);
                            setMaxDistance(DEFAULT_MAX_DISTANCE);
                        }}
                    >
                        {minDistance / 1000} – {maxDistance / 1000} km
                    </FilterBadges>
                )}

                {(minTime !== DEFAULT_MIN_TIME ||
                    maxTime !== DEFAULT_MAX_TIME) && (
                    <FilterBadges
                        onClear={() => {
                            setMinTime(DEFAULT_MIN_TIME);
                            setMaxTime(DEFAULT_MAX_TIME);
                        }}
                    >
                        {getTimeInHoursMinutes2(minTime)} –{" "}
                        {getTimeInHoursMinutes2(maxTime)}
                    </FilterBadges>
                )}

                {gear && (
                    <FilterBadges onClear={() => setGear(null)}>
                        {gear.name}
                    </FilterBadges>
                )}
            </div>

            {activities &&
                activities.map((activity) => (
                    <ActivitieCard
                        key={activity.id}
                        activity={activity}
                        map={true}
                    />
                ))}
            <div ref={loaderRef} className="h-10" />
        </div>
    );
};

export default MiddleDashboardComponent;
