from datetime import datetime
from utils.read_json_file import read_json_file


def get_activities_for_period(label, period, year):
    """Filter activiteiten op specifieke week of maand"""
    data = read_json_file("activities_cache.json")
    filtered = []
    for a in data:
        start = datetime.fromisoformat(a["start_date_local"])
        if start.year != year:
            continue
        if (period == "weekly" and f"Week {start.isocalendar().week}" == label) or (
            period == "monthly" and start.strftime("%b") == label
        ):
            filtered.append(a)
    return filtered
