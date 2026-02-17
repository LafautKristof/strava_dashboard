import os
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
ROUTE_DIR = os.path.join(DATA_DIR, "routes")


def get_all_routes():
    os.makedirs(ROUTE_DIR, exist_ok=True)
    routes = []
    for f in os.listdir(ROUTE_DIR):
        if f.endswith(".json"):
            with open(os.path.join(ROUTE_DIR, f), "r", encoding="utf-8") as file:
                routes.append(json.load(file))

    routes.sort(key=lambda x: x["date"], reverse=True)
    return routes
