export type Activities4Weeks = {
    activities: Activities[];
    end: string;
    start: string;
    total_efffort: number;
    week: string;
};

export type Activities = {
    distance: number;
    id: string;
    max_heartrate: number;
    min_heartrate: number;
    moving_time: number;
    name: string;
    start_date_local: string;
    suffer_score: number;
    type: string;
};
