from utils.read_json_file import read_json_file


def get_gear_activities(gear_id, page=1, per_page=10):
    all_activities = read_json_file("activities_cache.json") or []

    gear_activities = [
        {
            "id": act.get("id"),
            "name": act.get("name"),
            "distance": act.get("distance"),
            "type": act.get("type"),
            "start_date_local": act.get("start_date_local"),
            "moving_time": act.get("moving_time"),
            "map": act.get("map", {}),
        }
        for act in all_activities
        if act.get("gear_id") == gear_id
    ]
    total = len(gear_activities)
    start = (page - 1) * per_page
    end = start + per_page
    return {
        "data": gear_activities[start:end],
        "pagination": {
            "total": total,
            "page": page,
            "per_page": per_page,
            "total_pages": (total + per_page - 1) // per_page,
        },
    }
