from utils.read_json_file import read_json_file
from utils.enrich_activity_with_location import enrich_activity_with_location
from utils.calculate_suffer_score import calculate_suffer_score


def get_activity_by_id(id: str):
    data = read_json_file("activities_cache.json")

    for act in data:
        if str(act["id"]) == str(id):
            activity_with_location = enrich_activity_with_location(act)
            suffer_score = calculate_suffer_score(activity_with_location)
            activity_with_location["suffer_score"] = suffer_score
            return activity_with_location

    return {"error": f"Activiteit met id {id} niet gevonden."}
