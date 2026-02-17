def calculate_suffer_score(activity):
    if activity.get("suffer_score"):
        return activity["suffer_score"]

    time_min = (activity.get("elapsed_time") or 0) / 60
    distance = (activity.get("distance") or 0) / 1000
    elevation = activity.get("total_elevation_gain") or 0

    return round(time_min * 1.2 + distance * 3 + elevation / 50)
