export type Stats = {
    last_4_weeks: StatsData;
    type: string;
    year: number;
    yearly: StatsData;
    all_time: StatsDataAllTime;
    best_efforts: BestEfforts[];
    biggestClimb: string;
    longestRide: string;
    totalElevation: string;
};

export type StatsData = {
    activities_per_week: number;
    avg_distance_per_week_km: number;
    avg_elev_gain_per_week_m: number;
    avg_time_per_week: string;
    label: string;
    total_activities: number;
    total_distance_km: number;
    weeks: number;
    total_time: string;
};

export type StatsDataAllTime = {
    total_activities: number;
    total_distance_km: number;
    total_elev_gain_m: number;
    total_time: string;
};

export type BestEfforts = { label: string; time: number };
