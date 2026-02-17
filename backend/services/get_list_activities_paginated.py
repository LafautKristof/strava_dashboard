from utils.read_json_file import read_json_file
from utils.get_locations_from_coords import get_location_from_coords


def get_list_activities_paginated(
    page_number,
    per_page,
    name=None,
    from_date=None,
    to_date=None,
    type=None,
    min_distance=None,
    max_distance=None,
    min_time=None,
    max_time=None,
    gear=None,
):
    data = read_json_file("activities_cache.json") or []
    all_activities = data if isinstance(data, list) else []
    filtered = all_activities
    if not filtered:
        return []

    if name:
        name_lower = name.lower()
        filtered = [a for a in filtered if name_lower in a.get("name", "").lower()]
    if from_date and to_date:
        filtered = [
            a for a in filtered if from_date <= a["start_date_local"][:10] <= to_date
        ]
    if type != "All" and type:

        filtered = [a for a in filtered if a["type"].lower() == type.lower()]

    if min_distance:
        filtered = [a for a in filtered if a["distance"] >= min_distance]
    if max_distance:
        filtered = [a for a in filtered if a["distance"] <= max_distance]
    if min_time:
        filtered = [a for a in filtered if a["moving_time"] >= min_time]
    if max_time:
        filtered = [a for a in filtered if a["moving_time"] <= max_time]
    if gear:
        filtered = [a for a in filtered if a["gear_id"] == gear]

    start = (page_number - 1) * per_page
    end = page_number * per_page

    paginated_activities = filtered[start:end]

    activities = []

    for act in paginated_activities:
        start_latlng = act.get("start_latlng")

        # Alleen locatie bepalen als coords bestaan
        location = {}
        if isinstance(start_latlng, list) and len(start_latlng) == 2:
            location = get_location_from_coords(
                start_latlng[0],
                start_latlng[1],
            )
        activities.append(
            {
                "id": act["id"],
                "name": act["name"],
                "type": act["type"],
                "start_date_local": act["start_date_local"],
                "distance": act["distance"] or 0,
                "total_elevation_gain": act["total_elevation_gain"] or 0,
                "moving_time": act["moving_time"] or 0,
                "elapsed_time": act["elapsed_time"] or 0,
                "average_speed": act["average_speed"] or 0,
                "average_heartrate": act["average_heartrate"] or 0,
                "map": act["map"] or {},
                "location": location,
            }
        )

    return activities
