from utils.read_json_file import read_json_file
from utils.get_after_date_from_range import get_after_date_from_range
from utils.calculate_suffer_score import calculate_suffer_score
from datetime import datetime, timezone, timedelta
from collections import defaultdict
import os
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
STREAM_DIR = os.path.join(DATA_DIR, "streams")
ROUTE_DIR = os.path.join(DATA_DIR, "routes")


def get_activities_grouped_by_week(range_weeks: int = 8):
    activities = read_json_file("activities_cache.json") or []
    all_activities = activities if isinstance(activities, list) else []

    after_date = get_after_date_from_range(range_weeks)

    # 1️⃣ bepaal alle ISO-weken in range (oud → nieuw)
    now = datetime.now(timezone.utc)
    start_of_current_week = datetime.fromisocalendar(
        now.year, now.isocalendar().week, 1
    ).replace(tzinfo=timezone.utc)

    weeks = []
    for i in range(range_weeks):
        start = start_of_current_week - timedelta(weeks=(range_weeks - 1 - i))
        y, w, _ = start.isocalendar()
        key = f"{y}-W{w:02d}"

        weeks.append(
            {
                "week": key,
                "start": start.isoformat(),
                "end": (start + timedelta(days=6)).isoformat(),
                "total_effort": 0,
                "activities": [],
            }
        )

    week_map = {w["week"]: w for w in weeks}

    # 2️⃣ filter + plaats activities in juiste week
    for activity in all_activities:
        start_str = activity.get("start_date_local")
        if not start_str:
            continue

        dt = datetime.fromisoformat(start_str.replace("Z", "+00:00")).astimezone(
            timezone.utc
        )

        if dt < after_date:
            continue

        y, w, _ = dt.isocalendar()
        key = f"{y}-W{w:02d}"

        if key in week_map:
            entry = week_map[key]
            suffer_score = calculate_suffer_score(activity)
            stream_path = os.path.join(STREAM_DIR, f"{activity['id']}.json")
            if os.path.exists(stream_path):
                try:
                    with open(stream_path, "r", encoding="utf-8") as f:
                        stream = json.load(f)
                    hr_data = stream.get("heartrate", {}).get("data", [])
                    if hr_data:
                        min_hr, max_hr = min(hr_data), max(hr_data)
                except Exception as e:
                    print(f"⚠️ Could not read stream for {activity['id']}: {e}")
            entry["activities"].append(
                {
                    "id": str(activity.get("id")),
                    "name": activity.get("name"),
                    "start_date_local": start_str,
                    "suffer_score": suffer_score,
                    "type": activity.get("type"),
                    "moving_time": activity.get("moving_time"),
                    "distance": activity.get("distance"),
                    "min_heartrate": min_hr,
                    "max_heartrate": max_hr,
                    "elevation": activity.get("total_elevation_gain"),
                }
            )
            entry["total_effort"] += suffer_score

    return weeks
