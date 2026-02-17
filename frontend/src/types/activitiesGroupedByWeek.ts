export type ActivitiesGroupedByWeek = {
    activities: ActivityShort[];
    end: string;
    start: string;
    total_effort: number;
    week: string;
    minZone?: number;
    maxZone?: number;
    weekIndex: number;
};

export type ActivityShort = {
    distance: number;
    id: string;
    max_heartrate: number;
    min_heartrate: number;
    moving_time: number;
    name: string;
    start_date_local: string;
    suffer_score: number;
    type: string;
    elevation: number;
};
