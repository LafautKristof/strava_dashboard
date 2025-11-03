import json, os, requests, time, sys
from dotenv import load_dotenv
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from utils.token_manager import get_access_token
from utils.get_weather_for_activity import get_weather_for_activity
from datetime import datetime, timezone, timedelta
load_dotenv()
TOKEN = get_access_token()
HEADERS = {"Authorization": f"Bearer {TOKEN}"}

if not TOKEN:
    raise ValueError("❌ STRAVA_ACCESS_TOKEN missing from .env")

DATA_DIR = "data"
os.makedirs(DATA_DIR, exist_ok=True)

STREAM_DIR = os.path.join(DATA_DIR, "streams")
os.makedirs(STREAM_DIR, exist_ok=True)

SYNC_FILE = os.path.join(DATA_DIR, "last_sync.txt")
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


def fetch_all_activities(since_timestamp=None):
    print("🚴 Fetching all activities (summary only)...")
    all_acts, page = [], 1
    params = {"per_page": 200, "page": page}
    if since_timestamp:
        params["after"] = since_timestamp

    while True:
        data = fetch_json(
            "https://www.strava.com/api/v3/athlete/activities",
            params=params,
            sleep=1,
        )
        if not data:
            break
        all_acts.extend(data)
        print(f"  → Page {page} ({len(all_acts)} total)")
        if len(data) < 200:
            break
        page += 1
        params["page"] = page

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
    new_count = 0
    for act in activities:
        act_id = act["id"]
        stream_path = os.path.join(STREAM_DIR, f"{act_id}.json")
        if os.path.exists(stream_path):
            continue  # cache bestaat → skip
        fetch_activity_streams(act_id)
        new_count += 1
        if new_count % 100 == 0:
            print("⏸️ 100 new streams fetched — sleeping 15 minutes...")
            time.sleep(15 * 60)
    print(f"✅ Streams done — {new_count} new, rest skipped.")


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


    print("📅 Fetching activities from last 60 days...")
    since_dt = datetime.now(timezone.utc) - timedelta(days=60)
    since_timestamp = int(since_dt.timestamp())
    all_acts = fetch_all_activities(since_timestamp=since_timestamp)
    print(f"📦 Found {len(all_acts)} activities (last 60 days)")

    cache_path = os.path.join(DATA_DIR, "activities_cache.json")
    if os.path.exists(cache_path):
        with open(cache_path, "r") as f:
            existing = json.load(f)
    else:
        existing = []

    existing_ids = {a["id"] for a in existing}

  
    new_acts = []
    for a in all_acts:
        match = next((x for x in existing if x["id"] == a["id"]), None)
        if not match or match.get("resource_state", 2) < 3:
            new_acts.append(a)


    if not new_acts:
        print("ℹ️ No new Strava activities — checking last 60 days for missing weather...")
        new_acts = all_acts

    print(f"🔎 {len(new_acts)} activities to check for weather updates...\n")

    MAX_AGE = timedelta(days=60)
    ONE_YEAR = timedelta(days=365)

    for i, act in enumerate(new_acts, 1):
        print(f"🟠 ({i}/{len(new_acts)}) Checking ID {act['id']}")

        detail = fetch_activity_detail(act["id"])
        if not detail:
            print(f"⚠️ Skipping {act['id']} (no detail)")
            continue

        try:
            activity_dt = datetime.fromisoformat(detail["start_date"].replace("Z", "+00:00"))
            if datetime.now(timezone.utc) - activity_dt > ONE_YEAR:
                print(f"🧊 Skipping {act['id']} — too old (>1y)")
                continue
        except Exception:
            print(f"⚠️ Invalid date for {act['id']} — skipping age check")

        existing_act = next((x for x in existing if x["id"] == act["id"]), None)
        latlng = detail.get("start_latlng")
        date_local = detail.get("start_date_local")

        if existing_act and existing_act.get("weather"):
            detail["weather"] = existing_act["weather"]
            print(f"🟢 Keeping existing weather for {act['id']}")
        elif latlng and len(latlng) == 2 and date_local:
            try:
                dt_local = datetime.fromisoformat(date_local.replace("Z", "+00:00"))
            except Exception:
                dt_local = None

            if dt_local and (datetime.now(timezone.utc) - dt_local < MAX_AGE):
                print(f"🌍 Fetching weather for {date_local} at ({latlng[0]}, {latlng[1]})")
                weather = get_weather_for_activity(latlng[0], latlng[1], date_local)
                if weather:
                    detail["weather"] = weather
                    print(f"🌤️ Weather added → {weather['condition']} ({weather['temperature']}°C)")
                else:
                    print(f"⚠️ No weather data returned for {act['id']}")
            else:
                print(f"⏳ Skipping weather for {act['id']} (too old or invalid date)")
        else:
            print(f"⚠️ Missing lat/lon or date for {act['id']} — cannot fetch weather")

    
        existing = [x for x in existing if x["id"] != act["id"]]
        existing.append(detail)
        existing.sort(key=lambda x: x.get("start_date", ""), reverse=True)
        save_json("activities_cache.json", existing)

        if i % 25 == 0:
            print(f"💤 Processed {i}/{len(new_acts)} — pausing briefly to avoid rate limits")
            time.sleep(3)

    print("\n✅ Done adding weather for last 60 days.")
    now_str = datetime.now(timezone.utc).isoformat()
    with open(SYNC_FILE, "w") as f:
        f.write(now_str)
    print(f"✅ Updated last_sync.txt → {now_str}\n🏁 All done!")


if __name__ == "__main__":
    main()
