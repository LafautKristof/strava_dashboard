from collections import defaultdict
import os,json
from dotenv import load_dotenv
from utils.token_manager import get_access_token
from datetime import datetime, timedelta
from utils.get_location_from_coords import get_location_from_coords
load_dotenv()

_cached_athlete_id= None
import json
import os
from datetime import datetime
from utils.get_location_from_coords import get_location_from_coords
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
STREAM_DIR = os.path.join(DATA_DIR, "streams")
def read_json_file(filename):
    print(f"📦 Reading {filename}")
    path = os.path.join(DATA_DIR, filename)
    print(f"📦 Reading {path}")
    if not os.path.exists(path):
        raise FileNotFoundError(f"Kan het bestand {path} niet vinden.")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)
    

def get_activities():
    print("🚴 Fetching all activities (summary only)...")
    data=read_json_file("activities_cache.json")

    if isinstance(data, list):
        all_activities = data
    else:
        all_activities = data.get("activities", [])

    # -----------------------------
    # Get count per type
    # -----------------------------
    summary = {}
    for a in all_activities:
        t = a.get("type", "Unknown")
        if t not in summary:
            summary[t] = {"count": 0, "distance": 0}
        summary[t]["count"] += 1
        summary[t]["distance"] += a.get("distance", 0)
    for t in summary:
        summary[t]["distance"] = round(summary[t]["distance"] / 1000, 2)


    weeks_with_activity = set()
    for act in all_activities:
        date = act.get("start_date")
        if not date:
            continue
        dt = datetime.fromisoformat(date.replace("Z", "+00:00"))
        year, week, _ = dt.isocalendar()
        weeks_with_activity.add((year, week))

    weeks_sorted = sorted(list(weeks_with_activity), reverse=True)
    streak = 0
    if weeks_sorted:
        streak = 1
        last_year, last_week = weeks_sorted[0]
        for year, week in weeks_sorted[1:]:
            if year == last_year and last_week - week == 1:
                streak += 1
            elif year - last_year == 1 and last_week == 1 and week >= 52:
                streak += 1
            else:
                break
            last_year, last_week = year, week


    today = datetime.utcnow()
    current_year, current_week, _ = today.isocalendar()
    days_this_week = {d: False for d in ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
    current_week_active = False

    for act in all_activities:
        date = act.get("start_date")
        if not date:
            continue
        dt = datetime.fromisoformat(date.replace("Z", "+00:00"))
        y, w, weekday = dt.isocalendar()
        if y == current_year and w == current_week:
            day_name = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][weekday - 1]
            days_this_week[day_name] = True
            current_week_active = True


    for act in all_activities:
        latlng = act.get("start_latlng")
        if latlng and len(latlng) == 2:
            lat, lon = latlng
            city_name = get_location_from_coords(lat, lon)
            if act.get("location_city") is None:
                act["location_city"] = city_name
            if act.get("location_state") is None:
                act["location_state"] = ""
            if act.get("location_country") is None:
                act["location_country"] = "Belgium"


    return {
        "activities": all_activities,
        "summary": summary,
        "total_count": len(all_activities),
        "weekly_streak": streak,
        "current_week_active": current_week_active,
        "days_this_week": days_this_week,
    }

def get_activity(id):
    data=read_json_file("activities_cache.json")

    if isinstance(data, list):
        all_activities = data
    else:
        all_activities = data.get("activities", [])


    for act in all_activities:

        if str(act.get("id")) == str(id):
            return act

    return {"error": f"Activiteit met id {id} niet gevonden."}



def get_athlete():
    data=read_json_file("athlete_cache.json")
    if data:
        return data
    return {"error": "No athlete data found."}

def get_athlete_stats():
    data=read_json_file("stats_cache.json")
    if data:
        return data
    return {"error": "No athlete stats found."}



def get_stream_by_id(id):
    path = os.path.join(STREAM_DIR, f"{id}.json")
    if not os.path.exists(path):
        return {"error": f"Stream data for activity {id} not found."}
    with open(path, "r") as f:
        data = json.load(f)
    return data

def get_activities_after_date(date):
    data = read_json_file("activities_cache.json")
    all_activities = data if isinstance(data, list) else data.get("activities", [])

    filtered = []
    total_found = 0

    for act in all_activities:
        start_str = act.get("start_date_local") or act.get("start_date")
        if not start_str:
            continue

        try:
            start_time = datetime.fromisoformat(start_str.replace("Z", "+00:00"))
        except Exception:
            continue

        if start_time > date:
            total_found += 1
            act_id = str(act.get("id"))
            stream_path = os.path.join(STREAM_DIR, f"{act_id}.json")

            min_hr, max_hr = None, None

            if os.path.exists(stream_path):
                try:
                    with open(stream_path, "r", encoding="utf-8") as f:
                        stream = json.load(f)
                    heartrate_data = stream.get("heartrate", {}).get("data", [])

                    if heartrate_data:
                        min_hr = min(heartrate_data)
                        max_hr = max(heartrate_data)
                except Exception as e:
                    print(f"⚠️ Fout bij lezen van {stream_path}: {e}")

            filtered.append({
                "id": act_id,
                "name": act.get("name"),
                "start_date_local": start_str,
                "suffer_score": act.get("suffer_score", 0),
                "type": act.get("type"),
                "moving_time": act.get("moving_time"),
                "distance": act.get("distance"),
                "min_heartrate": min_hr,
                "max_heartrate": max_hr,
            })

    grouped = defaultdict(list)
    for act in filtered:
        dt = datetime.fromisoformat(act["start_date_local"].replace("Z", "+00:00"))
        year, week, _ = dt.isocalendar()
        grouped[f"{year}-W{week:02d}"].append(act)

    result = []
    for week, acts in grouped.items():
        try:
            year_str, week_str = week.split("-W")
            year = int(year_str)
            week_num = int(week_str)

            start_date = datetime.fromisocalendar(year, week_num, 1)
            end_date = start_date + timedelta(days=6)
        except Exception as e:
            print(f"⚠️ Fout bij berekenen van week {week}: {e}")
            start_date = end_date = None

        total_effort = sum(a["suffer_score"] or 0 for a in acts)

        result.append({
            "week": week,
            "start": start_date.isoformat() if start_date else None,
            "end": end_date.isoformat() if end_date else None,
            "total_effort": total_effort,
            "activities": acts,
        })
        result.sort(key=lambda x: x["week"])

    print(f"✅ {len(result)} weken gevonden, totaal {total_found} activiteiten gefilterd")

    return result