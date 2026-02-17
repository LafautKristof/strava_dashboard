import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
ROUTE_DIR = os.path.join(DATA_DIR, "routes")


def delete_route_by_id(id):
    path = os.path.join(ROUTE_DIR, f"{id}.json")
    if os.path.exists(path):
        os.remove(path)
        return {"message": f"Route met id {id} verwijderd."}
    return {"error": f"Route met id {id} niet gevonden."}
