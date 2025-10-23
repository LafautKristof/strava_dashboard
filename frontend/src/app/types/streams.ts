export type Streams = {
    altitude: Stream;
    grade_adjusted_speed: Stream;
    velocity_smooth: Stream;
    time: Stream;
    heartrate: Stream;
    distance: Stream;
};

export type Stream = {
    data: number[];
    original_size: number;
    resolution: string;
};
