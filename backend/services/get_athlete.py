from utils.read_json_file import read_json_file

ALLOWED_KEYS = {
    "bikes",
    "bio",
    "city",
    "country",
    "created_at",
    "firstname",
    "follower_count",
    "friend_count",
    "id",
    "lastname",
    "profile",
    "shoes",
    "state",
}


def get_athlete():
    raw = read_json_file("athlete_cache.json") or {"error": "No athlete data found"}
    activities = read_json_file("activities_cache.json")
    total_activities = len(activities)
    result = {key: raw.get(key) for key in ALLOWED_KEYS}
    result["total_activities"] = total_activities
    return result
