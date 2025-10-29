export type OverallChart = {
    label: string;

    totalDistance: number;
    totalElev: number;
    totalTime: number;
    year: number;
};

export type OverallChartData = {
    weekly: OverallChart[];
    monthly: OverallChart[];
};
