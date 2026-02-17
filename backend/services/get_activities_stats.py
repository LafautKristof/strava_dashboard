from utils.read_json_file import read_json_file
from datetime import datetime, timezone
from collections import defaultdict

FIELDS = [
    "distance",
    "moving_time",
    "elapsed_time",
    "total_elevation_gain",
    "achievement_count",
]

WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
ACTIVITY_TYPES = ["Ride", "Run", "Walk", "Workout"]


def get_activities_stats():
    activities = read_json_file("activities_cache.json") or []

    now = datetime.now(timezone.utc)
    this_year = now.year
    y, w, _ = now.isocalendar()

    # ─────────────────────────
    # totals & streak
    # ─────────────────────────
    total_activities = len(activities)

    weeks = set()
    for act in activities:
        date = act.get("start_date_local")
        if not date:
            continue
        dt = datetime.fromisoformat(date.replace("Z", "+00:00"))
        weeks.add(dt.isocalendar()[:2])  # (year, week)

    weeks_sorted = sorted(weeks, reverse=True)
    streak = 0
    last_year = last_week = None

    for year, week in weeks_sorted:
        if last_year is None:
            streak += 1
        elif (year == last_year and week == last_week - 1) or (
            last_week == 1 and year == last_year - 1 and week == 52
        ):
            streak += 1
        else:
            break
        last_year, last_week = year, week

    # ─────────────────────────
    # days this week
    # ─────────────────────────
    days_this_week = {d: False for d in WEEKDAYS}

    # ─────────────────────────
    # yearly stats per activity
    # ─────────────────────────
    activities_this_year_by_activity = {
        t: {"count": 0, **{f: 0 for f in FIELDS}} for t in ACTIVITY_TYPES
    }

    for act in activities:
        date = act.get("start_date_local")
        if not date:
            continue

        dt = datetime.fromisoformat(date.replace("Z", "+00:00")).astimezone(
            timezone.utc
        )
        yy, ww, weekday = dt.isocalendar()

        # mark active day this week
        if yy == y and ww == w:
            days_this_week[WEEKDAYS[weekday - 1]] = True

        # only count current year
        if yy != this_year:
            continue

        act_type = act.get("type", "other")
        stats = activities_this_year_by_activity[act_type]
        stats["count"] += 1

        for field in FIELDS:
            stats[field] += act.get(field, 0)

    return {
        "total_activities": total_activities,
        "last_activity": activities[0] if activities else None,
        "weekly_streak": streak,
        "days_this_week": days_this_week,
        "activities_this_year_by_activity": dict(activities_this_year_by_activity),
    }

    # ─────────────────────────
