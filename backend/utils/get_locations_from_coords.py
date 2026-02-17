import json, os, requests
from dotenv import load_dotenv

load_dotenv()
CACHE_FILE = "data/location_cache.json"
LOCATIONIQ_API_KEY = os.environ.get("LOCATIONIQ_API_KEY")


def get_location_from_coords(lat, lon):
    if lat is None or lon is None:
        return None
    key = f"{round(lat, 2)},{round(lon, 2)}"
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, "r") as f:
            cache = json.load(f)
    else:
        cache = {}

    if key in cache:
        return cache[key]

    url = "https://us1.locationiq.com/v1/reverse"
    params = {
        "key": LOCATIONIQ_API_KEY,
        "lat": lat,
        "lon": lon,
        "format": "json",
        "zoom": 10,
        "accept-language": "en",
    }

    try:
        res = requests.get(url, params=params, timeout=10)
        res.raise_for_status()
        data = res.json()
    except Exception as e:

        return None

    address = data.get("address", {})
    location = {
        "city": (
            address.get("city")
            or address.get("town")
            or address.get("village")
            or address.get("municipality")
            or address.get("county")
        ),
        "province": (address.get("state") or address.get("region")),
        "country": (address.get("country")),
        "country_code": (address.get("country_code")),
    }
    if not any(location.values()):
        location = None

    cache[key] = location
    with open(CACHE_FILE, "w") as f:
        json.dump(cache, f, indent=2)

    return location
