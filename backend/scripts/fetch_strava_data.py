import json, os, requests, time, sys
from dotenv import load_dotenv
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from utils.token_manager import get_access_token

load_dotenv()
TOKEN = get_access_token()
HEADERS = {"Authorization": f"Bearer {TOKEN}"}

if not TOKEN:
    raise ValueError("❌ STRAVA_ACCESS_TOKEN missing from .env")

DATA_DIR = "data"
os.makedirs(DATA_DIR, exist_ok=True)

STREAM_DIR = os.path.join(DATA_DIR, "streams")
os.makedirs(STREAM_DIR, exist_ok=True)

def save_json(filename, data):
    path = os.path.join(DATA_DIR, filename)
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"✅ Saved {filename} ({len(data) if isinstance(data, list) else 'object'})")


def fetch_json(url, params=None, sleep=1):
    res = requests.get(url, headers=HEADERS, params=params)
    if res.status_code != 200:
        print(f"⚠️ {url} failed: {res.status_code} {res.text}")
        return None
    time.sleep(sleep)
    return res.json()


def fetch_athlete():
    print("🏃 Fetching athlete profile...")
    data = fetch_json("https://www.strava.com/api/v3/athlete")
    if data:
        save_json("athlete_cache.json", data)
    return data


def fetch_stats(athlete_id):
    print("📊 Fetching athlete stats...")
    data = fetch_json(f"https://www.strava.com/api/v3/athletes/{athlete_id}/stats")
    if data:
        save_json("stats_cache.json", data)
    return data


def fetch_all_activities():
    print("🚴 Fetching all activities (summary only)...")
    all_acts, page = [], 1
    while True:
        data = fetch_json(
            "https://www.strava.com/api/v3/athlete/activities",
            params={"per_page": 200, "page": page},
            sleep=1,
        )
        if not data:
            break
        all_acts.extend(data)
        print(f"  → Page {page} ({len(all_acts)} total)")
        page += 1
    return all_acts


def fetch_activity_detail(act_id):
    """Fetch full detail including map & location."""
    return fetch_json(f"https://www.strava.com/api/v3/activities/{act_id}")


def fetch_activity_streams(act_id):
    """Fetch detailed streams (heartrate, pace, gap, elevation) for one activity."""
    stream_path = os.path.join(STREAM_DIR, f"{act_id}.json")


    if os.path.exists(stream_path):
        print(f"🟢 Streams cache exists for {act_id}")
        return None

    url = f"https://www.strava.com/api/v3/activities/{act_id}/streams"
    params = {
        "keys": "time,velocity_smooth,grade_adjusted_speed,heartrate,altitude",
        "key_by_type": "true",
    }

    res = requests.get(url, headers=HEADERS, params=params)
    if res.status_code != 200:
        print(f"⚠️ Streams for {act_id} failed: {res.status_code}")
  
        with open(stream_path, "w") as f:
            json.dump({}, f)
        return None

    data = res.json()

    if not data or (isinstance(data, dict) and all(len(v.get("data", [])) == 0 for v in data.values())):
        print(f"⚠️ No stream data for {act_id} — creating empty file")
        with open(stream_path, "w") as f:
            json.dump({}, f)
        return None

    with open(stream_path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"✅ Saved streams/{act_id}.json ({len(data)} keys)")
    time.sleep(1)
    return data


def fetch_all_streams(activities):
    """Loop through all activities and download streams safely."""
    total = len(activities)
    print(f"🩵 Fetching streams for {total} activities...")
    count = 0

    for i, act in enumerate(activities, 1):
        act_id = act["id"]
        fetch_activity_streams(act_id)
        count += 1

        if count % 100 == 0:
            print("⏸️ 100 requests done — sleeping 15 minutes to respect Strava rate limits...")
            time.sleep(15 * 60)



def main():
    print("🚀 Starting Strava data fetch...\n")

    athlete = fetch_athlete()
    if not athlete:
        print("❌ Could not fetch athlete data — aborting.")
        return

    athlete_id = athlete["id"]

    if athlete.get("resource_state", 2) < 3:
        print("🔁 Fetching detailed athlete profile (resource_state < 3)...")
        athlete_detail = fetch_json(f"https://www.strava.com/api/v3/athletes/{athlete_id}")
        if athlete_detail:
            athlete = athlete_detail
            save_json("athlete_cache.json", athlete)

    fetch_stats(athlete_id)

    all_acts = fetch_all_activities()
    print(f"📦 Found {len(all_acts)} activities")

    cache_path = os.path.join(DATA_DIR, "activities_cache.json")
    existing_ids = set()
    if os.path.exists(cache_path):
        with open(cache_path, "r") as f:
            existing = json.load(f)
            existing_ids = {a["id"] for a in existing}
    else:
        existing = []

    new_acts = []
    for a in all_acts:
        match = next((x for x in existing if x["id"] == a["id"]), None)
        if not match:
            new_acts.append(a)
        elif match.get("resource_state", 2) < 3:
            print(f"🔁 Updating activity {a['id']} (was resource_state={match.get('resource_state')})")
            new_acts.append(a)

    print(f"🆕 {len([a for a in new_acts if a['id'] not in existing_ids])} new + "
          f"🔁 {len([a for a in new_acts if a['id'] in existing_ids])} updated activities")

    for i, act in enumerate(new_acts, 1):
        print(f"  → ({i}/{len(new_acts)}) Fetching detail for ID {act['id']}")
        detail = fetch_activity_detail(act["id"])
        if detail:
            detail["resource_state"] = 3
            detail["map"] = detail.get("map", {})
            detail["location_city"] = detail.get("location_city")
            detail["location_country"] = detail.get("location_country")

            existing = [x for x in existing if x["id"] != act["id"]]
            existing.append(detail)
            existing.sort(key=lambda x: x.get("start_date", ""), reverse=True)
            save_json("activities_cache.json", existing)

        if i % 100 == 0:
            print("⏸️ Pausing 15 minutes to respect Strava rate limits...")
            time.sleep(15 * 60)

    if existing:
        print("🧭 Sorting all existing activities by start_date (newest first)...")
        existing.sort(key=lambda x: x.get("start_date", ""), reverse=True)
        save_json("activities_cache.json", existing)

    fetch_all_streams(existing)

    print("\n🏁 All done! Local cache is up to date.")

if __name__ == "__main__":
    main()
