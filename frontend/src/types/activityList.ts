export type ActivityList = {
    id: number;
    name: string;
    average_heartrate: number;
    average_speed?: number;
    distance: number;
    elapsed_time: number;
    map: { summary_polyline: string; id: string; polyline: string };
    moving_time: number;
    total_elevation_gain: number;
    start_date_local: string;
    type: string;
    location: {
        city: string;
        country: string;
        country_code: string;
        province: string;
    };
};
