from utils.get_locations_from_coords import get_location_from_coords


def enrich_activity_with_location(activity: dict) -> dict:
    """Voeg locatie toe aan activiteit als die ontbreekt."""
    latlng = activity.get("start_latlng")
    if latlng and len(latlng) == 2:
        lat, lon = latlng

        location = get_location_from_coords(lat, lon)
    activity["location"] = location
    activity.pop("location_city", None)
    activity.pop("location_country", None)
    activity.pop("location_state", None)
    return activity
