from utils.read_json_file import read_json_file


def get_my_gear():

    athlete = read_json_file("athlete_cache.json")
    shoes = athlete.get("shoes", [])

    if not shoes:
        return {"data": []}

    gear = [
        {
            "id": s["id"],
            "name": s["name"],
            "distance": round(s.get("distance", 0) / 1000, 1),
            "retired": s.get("retired", False),
            "primary": s.get("primary", False),
            "warning": round(s.get("distance", 0) / 1000) >= 800,
        }
        for s in shoes
    ]

    return {"data": gear}
