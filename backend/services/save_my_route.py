import os
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
ROUTE_DIR = os.path.join(DATA_DIR, "routes")


def save_my_route(data):
    os.makedirs(ROUTE_DIR, exist_ok=True)
    path = os.path.join(ROUTE_DIR, f"{data['id']}.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    return data
