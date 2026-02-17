from datetime import datetime, timezone, timedelta
from utils.read_json_file import read_json_file
from utils.get_best_efforts import get_best_efforts


def get_activities_for_stats(year: int, type_: str):
    """Statistieken per jaar + laatste 4 weken + best efforts"""

    data = read_json_file("activities_cache.json")
    all_activities = data if isinstance(data, list) else data.get("activities", [])
    filtered_year = [
        a
        for a in all_activities
        if a.get("type") == type_ and a.get("start_date", "").startswith(str(year))
    ]

    def compute_stats(acts, label):
        if not acts:
            return {
                "label": label,
                "weeks": 0,
                "activities_per_week": 0,
                "avg_distance_per_week_km": 0,
                "avg_time_per_week": "0h 0m",
                "avg_elev_gain_per_week_m": 0,
                "total_activities": 0,
                "total_distance_km": 0,
                "total_time": "0h 0m",
            }

        total_dist = sum(a.get("distance", 0) for a in acts)
        total_time = sum(a.get("moving_time", 0) for a in acts)
        total_elev = sum(a.get("total_elevation_gain", 0) for a in acts)
        total_acts = len(acts)

        weeks = (
            len(
                {
                    datetime.fromisoformat(
                        a["start_date"].replace("Z", "+00:00")
                    ).isocalendar()[1]
                    for a in acts
                    if a.get("start_date")
                }
            )
            or 1
        )

        avg_dist_week = (total_dist / 1000) / weeks
        avg_elev_week = total_elev / weeks
        avg_time_week = total_time / weeks

        return {
            "label": label,
            "weeks": weeks,
            "activities_per_week": round(total_acts / weeks, 1),
            "avg_distance_per_week_km": round(avg_dist_week, 1),
            "avg_time_per_week": f"{int(avg_time_week // 3600)} h {int((avg_time_week % 3600) // 60)}m",
            "avg_elev_gain_per_week_m": round(avg_elev_week, 1),
            "total_activities": total_acts,
            "total_distance_km": round(total_dist / 1000, 1),
            "total_time": f"{total_time // 3600}h {(total_time % 3600) // 60}m",
        }

    now = datetime.now(timezone.utc)
    four_weeks_ago = now - timedelta(weeks=4)
    filtered_4weeks = [
        a
        for a in all_activities
        if a.get("type") == type_
        and datetime.fromisoformat(
            (a.get("start_date_local") or a.get("start_date")).replace("Z", "+00:00")
        )
        >= four_weeks_ago
    ]

    stats_year = compute_stats(filtered_year, "year")
    stats_4weeks = compute_stats(filtered_4weeks, "last_4_weeks")

    all_time_filtered = [a for a in all_activities if a.get("type") == type_]
    total_distance_all = sum(a.get("distance", 0) for a in all_time_filtered)
    total_time_all = sum(a.get("moving_time", 0) for a in all_time_filtered)
    total_elev_all = sum(a.get("total_elevation_gain", 0) for a in all_time_filtered)
    extra_stats = get_best_efforts(type_, all_activities)

    return {
        "year": year,
        "type": type_,
        "yearly": stats_year,
        "last_4_weeks": stats_4weeks,
        "all_time": {
            "total_activities": len(all_time_filtered),
            "total_distance_km": round(total_distance_all / 1000, 1),
            "total_time": f"{total_time_all // 3600}h {(total_time_all % 3600) // 60}m",
            "total_elev_gain_m": round(total_elev_all, 1),
        },
        **extra_stats,
    }
