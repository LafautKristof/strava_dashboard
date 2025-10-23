export type Activities12Weeks = {
    week: string;
    total_effort: number;
    activities: Activities[];
    start: string;
    end: string;
    weekIndex?: number;
    minZone?: number;
    maxZone?: number;
};
export type Activities8Weeks = {
    week: string;
    total_effort: number;
    activities: Activities[];
};
export type Activities = {
    id: number;
    name: string;
    start_date_local: Date;
    suffer_score: number;
    type: string;
    moving_time: number;
    distance: number;
    max_heartrate: number;

    min_heartrate: number;
};
