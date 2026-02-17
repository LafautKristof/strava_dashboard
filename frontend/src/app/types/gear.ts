export type GearData = {
    activities: Activities[];
    distance: number;
    id: string;
    name: string;
    primary: boolean;
    retired: boolean;
    warning: boolean;
};

export type Activities = {
    distance: number;
    id: number;
    name: string;
    start_date: string;
    type: string;
    map: Map;
    moving_time: number;
};

export type Map = {
    polyline: string;
    resource_state: number;
    summary_polyline: string;
    id: string;
};

export type GearResponse = {
    data: GearData[];
    pagination: {
        page: number;
        per_page: number;
        total: number;
        total_pages: number;
    };
};
