import os
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
ROUTE_DIR = os.path.join(DATA_DIR, "routes")


def update_my_route(id, data):
    os.makedirs(ROUTE_DIR, exist_ok=True)
    path = os.path.join(ROUTE_DIR, f"{id}.json")
    if not os.path.exists(path):
        return {"error": f"Route met id {id} niet gevonden."}
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    return data
