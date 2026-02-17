import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
ROUTE_DIR = os.path.join(DATA_DIR, "routes")


def delete_routes():
    if not os.path.exists(ROUTE_DIR):
        return {"message": "Geen routes gevonden."}
    for f in os.listdir(ROUTE_DIR):
        if f.endswith(".json"):
            os.remove(os.path.join(ROUTE_DIR, f))
    return {"message": "Alle routes verwijderd."}
