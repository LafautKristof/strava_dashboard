export type GearData = {
    activities: Activities[];
    distance_km: number;
    id: string;
    name: string;
    nickname: string;
    primary: boolean;
    warning: boolean;
    retired: boolean;
};

export type Activities = {
    distance_km: number;
    id: number;
    name: string;
    start_date: string;
    type: string;
    map: Map;
};

export type Map = {
    polyline: string;
    resource_state: number;
    summary_polyline: string;
    id: string;
};
