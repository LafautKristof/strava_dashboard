import json, os, requests, time

CACHE_FILE = "data/location_cache.json"

def get_location_from_coords(lat, lon):
    key = f"{round(lat, 2)},{round(lon, 2)}"

    cache = {}
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, "r") as f:
            cache = json.load(f)

    if key in cache:
        return cache[key]

 
    url = "https://nominatim.openstreetmap.org/reverse"
    params = {"lat": lat, "lon": lon, "format": "json"}
    headers = {"User-Agent": "StravaDashboard/1.0 (your_email@example.com)"}
    response = requests.get(url, params=params, headers=headers)
    time.sleep(1) 
    data = response.json()

    place = (
        data.get("address", {}).get("city")
        or data.get("address", {}).get("town")
        or data.get("address", {}).get("village")
        or "Unknown"
    )
    cache[key] = place
    with open(CACHE_FILE, "w") as f:
        json.dump(cache, f, indent=2)

    return place
