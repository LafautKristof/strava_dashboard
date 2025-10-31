export type DataActivity = {
    activities: Activities[];
    summary: Summary;
    total_count: number;
    weekly_streak: number;
    days_this_week: DaysThisWeek;
};

export type Activities = {
    resource_state: number;
    athlete: Athlete;
    name: string;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    total_elevation_gain: number;
    type: string;
    sport_type: string;
    workout_type: null;
    id: number;
    start_date: Date;
    start_date_local: Date;
    timezone: string;
    utc_offset: number;
    location_city: string;
    location_state: string;
    location_country: string;
    achievement_count: number;
    kudos_count: number;
    comment_count: number;
    athlete_count: number;
    photo_count: number;
    map: Map;
    trainer: boolean;
    commute: boolean;
    manual: boolean;
    private: boolean;
    visibility: Visibility;
    flagged: boolean;
    gear: Gear;
    gear_id: null;
    start_latlng: number[];
    end_latlng: number[];
    average_speed: number;
    max_speed: number;
    average_cadence: number;
    has_heartrate: boolean;
    average_heartrate: number;
    max_heartrate: number;
    heartrate_opt_out: boolean;
    display_hide_heartrate_option: boolean;
    elev_high: number;
    elev_low: number;
    upload_id: number;
    upload_id_str: string;
    external_id: string;
    from_accepted_tag: boolean;
    pr_count: number;
    total_photo_count: number;
    has_kudoed: boolean;
    suffer_score: number;
    description: string | null;
    calories: number;
    perceived_exertion: null;
    prefer_perceived_exertion: null;
    segment_efforts: SegmentEffort[];
    splits_metric: Splits[];
    splits_standard: Splits[];
    laps: Lap[];
    best_efforts: BestEffort[];
    photos: Photos;
    stats_visibility: StatsVisibility[];
    hide_from_home: boolean;
    device_name: string;
    embed_token: string;
    similar_activities: SimilarActivities;
    available_zones: string[];
    weather: Weather;
};

export type Athlete = {
    id: number;
    resource_state: number;
};

export type BestEffort = {
    id: number;
    resource_state: number;
    name: string;
    activity: Activity;
    athlete: Athlete;
    elapsed_time: number;
    moving_time: number;
    start_date: Date;
    start_date_local: Date;
    distance: number;
    pr_rank: null;
    achievements: [];
    start_index: number;
    end_index: number;
};

export type Activity = {
    id: number;
    visibility: Visibility;
    resource_state: number;
};

export enum Visibility {
    Everyone = "everyone",
}

export type Lap = {
    id: number;
    resource_state: number;
    name: string;
    activity: Activity;
    athlete: Athlete;
    elapsed_time: number;
    moving_time: number;
    start_date: Date;
    start_date_local: Date;
    distance: number;
    average_speed: number;
    max_speed: number;
    lap_index: number;
    split: number;
    start_index: number;
    end_index: number;
    total_elevation_gain: number;
    average_cadence: number;
    device_watts: boolean;
    average_heartrate: number;
    max_heartrate: number;
    pace_zone: number;
};

export type Map = {
    id: string;
    polyline: string;
    resource_state: number;
    summary_polyline: string;
};

export type Photos = {
    primary: null;
    count: number;
};

export type SimilarActivities = {
    effort_count: number;
    average_speed: number;
    min_average_speed: number;
    mid_average_speed: number;
    max_average_speed: number;
    pr_rank: null;
    frequency_milestone: null;
    trend: Trend;
    resource_state: number;
};

export type Trend = {
    speeds: number[];
    current_activity_index: number;
    min_speed: number;
    mid_speed: number;
    max_speed: number;
    direction: number;
};

export type Splits = {
    distance: number;
    elapsed_time: number;
    elevation_difference: number;
    moving_time: number;
    split: number;
    average_speed: number;
    average_grade_adjusted_speed: number;
    average_heartrate: number;
    pace_zone: number;
};

export type StatsVisibility = {
    type: string;
    visibility: Visibility;
};

export type DaysThisWeek = {
    Mon: boolean;
    Tue: boolean;
    Wed: boolean;
    Thu: boolean;
    Fri: boolean;
    Sat: boolean;
    Sun: boolean;
};
export type Summary = {
    Ride: { count: number; distance: number };
    Run: { count: number; distance: number };
    Walk: { count: number; distance: number };
    Workout: { count: number; distance: number };
};

export type SegmentEffort = {
    achievements: [];
    activity: Activity;
    athlete: Athlete;
    average_cadence: number;
    average_heartrate: number;
    device_watts: boolean;
    distance: number;
    elapsed_time: number;
    end_index: number;
    hidden: boolean;
    id: number;
    kom_rank: null;
    max_heartrate: number;
    moving_time: number;
    name: string;
    pr_rank: null;
    resource_state: number;
    segment: Segment;
    start_date: Date;
    start_data_local: Date;
    start_index: number;
    visibility: Visibility;
};

export type Segment = {
    activity_type: string;
    average_grade: number;
    city: string;
    climb_category: number;
    country: string;
    distance: number;
    elevation_high: number;
    elevation_low: number;
    elevation_profile: number[];
    elevation_profiles: number[];
    end_latlng: number[];
    hazardous: boolean;
    id: number;
    maximum_grade: number;
    name: string;
    private: boolean;
    resource_state: number;
    starred: boolean;
    start_latlng: number[];
    state: string;
};

export type Gear = {
    converted_distance: number;
    distance: number;
    id: string;
    name: string;
    nickname: string;
    primary: boolean;
    resource_state: number;
    retired: boolean;
};

export type Weather = {
    condition: string;
    temperature: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    wind_dir: string;
    cloud_cover: number;
};
