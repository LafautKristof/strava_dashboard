import { Best_efforts } from "./best_effort";

export type Activity = {
    achievement_count: number;
    athlete: {
        id: number;
        resource_state: number;
    };
    athlete_count: number;
    available_zones: [];
    average_cadence: number;
    average_heartrate: number;
    average_speed: number;
    best_efforts: Best_efforts[];
    calories: number;
    comment_count: number;
    commute: boolean;
    description: string;
    device_name: string;
    display_hide_heartrate_option: boolean;
    distance: number;
    elapsed_time: number;
    elev_high: number;
    elev_low: number;
    embed_token: string;
    end_latlng: number[];
    external_id: string;
    flagged: boolean;
    from_accepted_tag: boolean;
    gear: Gear;
    gear_id: string;
    has_heartrate: boolean;
    has_kudoed: boolean;
    heartrate_opt_out: boolean;
    hide_from_home: boolean;
    id: number;
    kudos_count: number;
    laps: [];
    location: {
        city: string;
        province: string;
        country: string;
        country_code: string;
    };
    manual: boolean;
    map: {
        id: string;
        summary_polyline: string;
        polyline: string;
        resource_state: number;
    };
    max_heartrate: number;
    max_speed: number;
    moving_time: number;
    name: string;
    perceived_exertion: number;
    photo_count: number;
    photos: [];
    pr_count: number;
    prefered_perceived_exertion: boolean;
    private: boolean;
    resource_state: number;
    segment_efforts: SegmentEffort[];
    similaer_activities: [];
    splits_metric: SplitsMetric[];
    splits_standard: [];
    sport_type: string;
    start_date: string;
    start_date_local: string;
    start_latlng: number[];
    stats_visibility: [];
    timezone: string;
    total_elevation_gain: number;
    total_photo_count: number;
    trainer: boolean;
    type: string;
    upload_id: number;
    upload_id_str: string;
    utc_offset: number;
    visibility: string;
    suffer_score: number;
    weather: Weather;
};

export type SegmentEffort = {
    achievements: [];
    activity: {
        id: number;
        resource_state: number;
        visibility: string;
    };
    athlete: {
        id: number;
        resource_state: number;
    };
    average_heartrate: number;
    device_watts: boolean;
    distance: number;
    elapsed_time: number;
    end_index: number;
    hidden: boolean;
    id: number;
    max_heartrate: number;
    moving_time: number;
    name: string;
    pr_rank: number;
    resource_state: number;
    segment: {
        activity_type: string;
        average_grade: number;
        city: string;
        climb_category: number;
        country: string;
        distance: number;
        elevation_high: number;
        elevation_low: number;
        elevation_profile: [];
        elevation_profiles: [];
        end_latlng: number[];
        id: number;
        maximum_grade: number;
        name: string;
        private: boolean;
        resource_state: number;
        starred: boolean;
        start_latlng: number[];
        state: string;
    };
    start_date: string;
    start_date_local: string;
    start_index: number;
    visibility: string;
};

export type Weather = {
    cloud_cover: number;
    condition: string;
    feels_like: number;
    humidity: number;
    temperature: number;
    wind_dir: string;
    wind_speed: number;
};

export type Gear = {
    converted_distance: number;
    distance: number;
    id: string;
    name: string;
    primary: boolean;
    retired: boolean;
    warning: boolean;
};

export type SplitsMetric = {
    average_grade_adjusted_speed: number;
    average_heartrate: number;
    average_speed: number;
    distance: number;
    elapsed_time: number;
    elevation_difference: number;
    moving_time: number;
    pace_zone: number;
    split: number;
};
