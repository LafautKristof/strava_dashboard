from utils.format_time import format_time


def get_best_efforts(type_: str, all_activities: list):
    """Berekent best efforts en extra statistieken per sporttype."""

    type_ = type_.capitalize()

    filtered = [
        a
        for a in all_activities
        if a.get("type") == type_
        and 100 <= a.get("distance", 0) <= 400_000
        and a.get("moving_time", 0) > 60
    ]

    if not filtered:
        return {
            "best_efforts": [],
            "longest_distance": None,
            "biggest_climb": None,
            "total_elevation": None,
        }

    # 🔹 Targets per type
    TARGETS = {
        "Ride": {
            "5 mile": 8046.7,
            "10K": 10000,
            "20K": 20000,
            "40K": 40000,
            "50K": 50000,
        },
        "Run": {
            "400 m": 400,
            "1 K": 1000,
            "1 mile": 1609.34,
            "5 K": 5000,
            "10 K": 10000,
        },
        "Walk": {
            "1 K": 1000,
            "5 K": 5000,
            "10 K": 10000,
            "Half Marathon": 21097,
        },
    }

    targets = TARGETS.get(type_, {})

    # 🔹 Best efforts berekenen
    best_efforts = []

    for label, dist in targets.items():
        best_time = None

        for act in filtered:
            distance = act.get("distance", 0)
            time = act.get("moving_time", 0)

            if distance <= 0 or time <= 0:
                continue

            projected_time = (time / distance) * dist

            if best_time is None or projected_time < best_time:
                best_time = projected_time

        if best_time:
            best_efforts.append({"label": label, "time": format_time(best_time)})

    # 🔹 Extra stats (voor alle types eigenlijk interessant)
    longest_distance = max(a.get("distance", 0) for a in filtered) / 1000
    biggest_climb = max(a.get("total_elevation_gain", 0) or 0 for a in filtered)
    total_elevation = max(a.get("total_elevation_gain", 0) or 0 for a in filtered)

    return {
        "best_efforts": best_efforts,
        "longest_distance_km": round(longest_distance, 1),
        "longest_time": format_time(max(a.get("moving_time", 0) for a in filtered)),
        "biggest_climb_m": round(biggest_climb),
        "most_elevation_m": round(total_elevation),
    }
