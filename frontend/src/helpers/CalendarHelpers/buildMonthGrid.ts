import { ActivitiesCurrentMonth } from "@/types/activitiesCurrentMonth";

export function buildMonthGrid(
    monthData: ActivitiesCurrentMonth[],
    month: number,
    year: number,
) {
    const firstDayOfMonth = new Date(year, month, 1);
    const startDayIndex = (firstDayOfMonth.getDay() + 6) % 7; // Monday = 0

    const totalCells = 42; // 6 weeks * 7 days

    const grid: (ActivitiesCurrentMonth | null)[] = [];

    // Padding voor begin
    for (let i = 0; i < startDayIndex; i++) {
        grid.push(null);
    }

    // Maanddagen
    grid.push(...monthData);

    // Padding tot 42 cells
    while (grid.length < totalCells) {
        grid.push(null);
    }

    // Opsplitsen in weken
    const weeks = [];
    for (let i = 0; i < grid.length; i += 7) {
        weeks.push(grid.slice(i, i + 7));
    }

    return weeks;
}
