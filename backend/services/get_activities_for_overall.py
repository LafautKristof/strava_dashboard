from utils.read_json_file import read_json_file
from datetime import datetime
from collections import defaultdict
import calendar


def get_activities_for_chart():
    data = read_json_file("activities_cache.json") or []

    weekly = defaultdict(
        lambda: {"totalDistance": 0, "totalTime": 0, "totalElev": 0, "year": 0}
    )
    monthly = defaultdict(
        lambda: {"totalDistance": 0, "totalTime": 0, "totalElev": 0, "year": 0}
    )

    years_in_data = set()

    for a in data:
        start = datetime.fromisoformat(a["start_date_local"])

        # 🔥 FIX: ISO year gebruiken
        iso_year, iso_week, _ = start.isocalendar()
        month = start.month
        calendar_year = start.year

        years_in_data.add(iso_year)

        dist = a.get("distance", 0) / 1000
        time = a.get("moving_time", 0) / 3600
        elev = a.get("total_elevation_gain", 0)

        weekly[(iso_year, iso_week)]["year"] = iso_year
        weekly[(iso_year, iso_week)]["totalDistance"] += dist
        weekly[(iso_year, iso_week)]["totalTime"] += time
        weekly[(iso_year, iso_week)]["totalElev"] += elev

        monthly[(calendar_year, month)]["year"] = calendar_year
        monthly[(calendar_year, month)]["totalDistance"] += dist
        monthly[(calendar_year, month)]["totalTime"] += time
        monthly[(calendar_year, month)]["totalElev"] += elev

    # --------------------
    # LEGE WEKEN TOEVOEGEN
    # --------------------

    current_year, current_week, _ = datetime.now().isocalendar()

    for year in years_in_data:
        if year == current_year:
            max_week = current_week
        else:
            max_week = datetime(year, 12, 28).isocalendar().week

        for week in range(1, max_week + 1):
            if (year, week) not in weekly:
                weekly[(year, week)] = {
                    "year": year,
                    "totalDistance": 0,
                    "totalTime": 0,
                    "totalElev": 0,
                }

    # --------------------
    # LEGE MAANDEN TOEVOEGEN
    # --------------------

    current_calendar_year = datetime.now().year
    current_month = datetime.now().month

    for year in set(v["year"] for v in monthly.values()):
        if year == current_calendar_year:
            max_month = current_month
        else:
            max_month = 12

        for month in range(1, max_month + 1):
            if (year, month) not in monthly:
                monthly[(year, month)] = {
                    "year": year,
                    "totalDistance": 0,
                    "totalTime": 0,
                    "totalElev": 0,
                }

    # --------------------
    # SORTERING
    # --------------------

    weekly_list = [
        {"label": f"Week {w}", "year": y, **weekly[(y, w)]}
        for (y, w) in sorted(weekly.keys())
    ]

    monthly_list = [
        {"label": calendar.month_abbr[m], "year": y, **monthly[(y, m)]}
        for (y, m) in sorted(monthly.keys())
    ]

    return {"weekly": weekly_list, "monthly": monthly_list}
