from utils.read_json_file import read_json_file

from datetime import datetime, timezone
from flask import jsonify
import calendar


def get_activities_grouped_by_month(year, month):
    activities = read_json_file("activities_cache.json") or []
    _, days_in_month = calendar.monthrange(year, month)

    month_days = {}

    for day in range(1, days_in_month + 1):
        date_str = f"{year}-{month:02d}-{day:02d}"

        month_days[date_str] = []

    for act in activities:
        start_date = act.get("start_date_local")
        if not start_date:
            continue

        dt = datetime.fromisoformat(start_date.replace("Z", "+00:00"))
        if dt.year == year and dt.month == month:
            date_key = dt.strftime("%Y-%m-%d")
            month_days[date_key].append(
                {
                    "id": act["id"],
                    "name": act["name"],
                    "type": act["type"],
                    "moving_time": act["moving_time"] or 0,
                    "distance": act["distance"] or 0,
                }
            )
    response = [
        {"date": date, "activities": activities}
        for date, activities in sorted(month_days.items())
    ]

    return response
