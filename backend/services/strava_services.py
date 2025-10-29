from collections import defaultdict
import os
import json
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from utils.token_manager import get_access_token
from utils.get_location_from_coords import get_location_from_coords

# =========================================================
# 🌍 CONFIG
# =========================================================
load_dotenv()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
STREAM_DIR = os.path.join(DATA_DIR, "streams")
ROUTE_DIR = os.path.join(DATA_DIR, "routes")


# =========================================================
# 🧩 HELPER FUNCTIES
# =========================================================
def read_json_file(filename: str):
    """Lees JSON-bestand uit data-map"""
    path = os.path.join(DATA_DIR, filename)
    print(f"📦 Reading {path}")
    if not os.path.exists(path):
        raise FileNotFoundError(f"Kan het bestand {path} niet vinden.")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def enrich_activity_with_location(activity: dict) -> dict:
    """Voeg locatie toe aan activiteit als die ontbreekt."""
    latlng = activity.get("start_latlng")
    if latlng and len(latlng) == 2:
        lat, lon = latlng
        city_name = get_location_from_coords(lat, lon)
        activity.setdefault("location_city", city_name)
        activity.setdefault("location_state", "")
        activity.setdefault("location_country", "Belgium")
    return activity


def format_time(seconds: float) -> str:
    """Formateer seconden naar m:ss of h:mm:ss."""
    if not seconds or seconds <= 0:
        return "-"
    h, m, s = int(seconds // 3600), int((seconds % 3600) // 60), int(seconds % 60)
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m}:{s:02d}"


# =========================================================
# 🚴 ACTIVITEITEN
# =========================================================
def get_activities():
    """Haalt alle activiteiten op + paginatie + samenvatting"""
    from flask import request

    data = read_json_file("activities_cache.json")
    all_activities = data if isinstance(data, list) else data.get("activities", [])

    # 🔹 Pagination
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", len(all_activities)))
    total_count = len(all_activities)
    start, end = (page - 1) * per_page, page * per_page
    paginated_activities = all_activities[start:end]

    # 🔹 Samenvatting per type
    summary = defaultdict(lambda: {"count": 0, "distance": 0})
    for a in all_activities:
        t = a.get("type", "Unknown")
        summary[t]["count"] += 1
        summary[t]["distance"] += a.get("distance", 0)
    for t in summary:
        summary[t]["distance"] = round(summary[t]["distance"] / 1000, 2)

    # 🔹 Weekly streak
    weeks = set()
    for act in all_activities:
        if date := act.get("start_date"):
            dt = datetime.fromisoformat(date.replace("Z", "+00:00"))
            weeks.add(dt.isocalendar()[:2])

    weeks_sorted = sorted(weeks, reverse=True)
    streak, last_year, last_week = 0, None, None
    for y, w in weeks_sorted:
        if last_year is None:
            streak, last_year, last_week = 1, y, w
            continue
        if (y == last_year and last_week - w == 1) or (y - last_year == 1 and last_week == 1 and w >= 52):
            streak += 1
            last_year, last_week = y, w
        else:
            break

    # 🔹 Dagen actief deze week
    today = datetime.utcnow()
    y, w, _ = today.isocalendar()
    days_this_week = {d: False for d in ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
    for act in all_activities:
        if date := act.get("start_date"):
            dt = datetime.fromisoformat(date.replace("Z", "+00:00"))
            yy, ww, weekday = dt.isocalendar()
            if yy == y and ww == w:
                days_this_week[["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][weekday - 1]] = True

    # 🔹 Locaties aanvullen
    for act in paginated_activities:
        enrich_activity_with_location(act)

    return {
        "activities": paginated_activities,
        "summary": summary,
        "total_count": total_count,
        "page": page,
        "per_page": per_page,
        "weekly_streak": streak,
        "current_week_active": any(days_this_week.values()),
        "days_this_week": days_this_week,
        "has_more": end < total_count,
    }


def get_activity(id):
    data = read_json_file("activities_cache.json")
    all_activities = data if isinstance(data, list) else data.get("activities", [])
    for act in all_activities:
        if str(act.get("id")) == str(id):
            return enrich_activity_with_location(act)
    return {"error": f"Activiteit met id {id} niet gevonden."}


def get_athlete():
    return read_json_file("athlete_cache.json") or {"error": "No athlete data found."}


def get_athlete_stats():
    return read_json_file("stats_cache.json") or {"error": "No athlete stats found."}


# =========================================================
# 💓 STREAMS
# =========================================================
def get_stream_by_id(id):
    path = os.path.join(STREAM_DIR, f"{id}.json")
    if not os.path.exists(path):
        return {"error": f"Stream data for activity {id} not found."}
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


# =========================================================
# 🗺️ ROUTES
# =========================================================
def save_my_route(data):
    os.makedirs(ROUTE_DIR, exist_ok=True)
    path = os.path.join(ROUTE_DIR, f"{data['id']}.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"✅ Route opgeslagen als {path}")
    return data


def get_all_routes():
    os.makedirs(ROUTE_DIR, exist_ok=True)
    routes = []
    for f in os.listdir(ROUTE_DIR):
        if f.endswith(".json"):
            with open(os.path.join(ROUTE_DIR, f), "r", encoding="utf-8") as file:
                routes.append(json.load(file))
    return routes


def delete_route_by_id(id):
    path = os.path.join(ROUTE_DIR, f"{id}.json")
    if os.path.exists(path):
        os.remove(path)
        return {"message": f"Route met id {id} verwijderd."}
    return {"error": f"Route met id {id} niet gevonden."}


def update_my_route(id, data):
    os.makedirs(ROUTE_DIR, exist_ok=True)
    path = os.path.join(ROUTE_DIR, f"{id}.json")
    if not os.path.exists(path):
        return {"error": f"Route met id {id} niet gevonden."}
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"✅ Route met id {id} bijgewerkt.")
    return data


def delete_routes():
    if not os.path.exists(ROUTE_DIR):
        return {"message": "Geen routes gevonden."}
    for f in os.listdir(ROUTE_DIR):
        if f.endswith(".json"):
            os.remove(os.path.join(ROUTE_DIR, f))
    return {"message": "Alle routes verwijderd."}


# =========================================================
# 📆 FILTERS / PERIODE / STATS
# =========================================================
def get_activities_by_date(date):
    data = read_json_file("activities_cache.json")
    all_activities = data if isinstance(data, list) else data.get("activities", [])
    matched = []
    for act in all_activities:
        start_str = act.get("start_date_local") or act.get("start_date")
        if not start_str:
            continue
        dt = datetime.fromisoformat(start_str.replace("Z", "+00:00"))
        if dt.strftime("%Y-%m-%d") == date:
            matched.append(act)
    print(f"✅ {len(matched)} activiteit(en) gevonden op {date}")
    return matched


def get_activities_after_date(date):
    """Activiteiten na bepaalde datum + min/max HR + weekgroepering"""
    data = read_json_file("activities_cache.json")
    all_activities = data if isinstance(data, list) else data.get("activities", [])
    filtered = []

    for act in all_activities:
        start_str = act.get("start_date_local") or act.get("start_date")
        if not start_str:
            continue
        dt = datetime.fromisoformat(start_str.replace("Z", "+00:00"))
        if dt <= date:
            continue

        act_id = str(act.get("id"))
        stream_path = os.path.join(STREAM_DIR, f"{act_id}.json")
        min_hr, max_hr = None, None
        if os.path.exists(stream_path):
            try:
                with open(stream_path, "r", encoding="utf-8") as f:
                    stream = json.load(f)
                hr_data = stream.get("heartrate", {}).get("data", [])
                if hr_data:
                    min_hr, max_hr = min(hr_data), max(hr_data)
            except Exception:
                pass

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

    # Groepering per week
    grouped = defaultdict(list)
    for a in filtered:
        dt = datetime.fromisoformat(a["start_date_local"].replace("Z", "+00:00"))
        year, week, _ = dt.isocalendar()
        grouped[f"{year}-W{week:02d}"].append(a)

    result = []
    for week, acts in grouped.items():
        year, week_num = map(int, week.split("-W"))
        start = datetime.fromisocalendar(year, week_num, 1)
        end = start + timedelta(days=6)
        total_effort = sum(a["suffer_score"] or 0 for a in acts)
        result.append({
            "week": week,
            "start": start.isoformat(),
            "end": end.isoformat(),
            "total_effort": total_effort,
            "activities": acts,
        })

    result.sort(key=lambda x: x["week"])
    return result

# =========================================================
# 🏆 BEST EFFORTS & STATS HULPFUNCTIE
# =========================================================
def get_best_efforts(type_: str, all_activities: list):
    """Berekent best efforts en extra statistieken voor fiets of run."""
    filtered = [
        a for a in all_activities
        if a.get("type") == type_
        and 100 <= a.get("distance", 0) <= 400_000
        and a.get("moving_time", 0) > 60
    ]

    if not filtered:
        return {
            "best_efforts": [],
            "longestRide": None,
            "biggestClimb": None,
            "totalElevation": None
        }

    # 🔹 Doelen per type
    if type_.lower() == "ride":
        targets = {
            "5 mile": 1609.34 * 5,
            "10K": 10000,
            "10 mile": 16093.4,
            "20K": 20000,
            "30K": 30000,
            "40K": 40000,
            "50K": 50000,
        }
    else:
        targets = {
            "400 m": 400,
            "½ mile": 804.67,
            "1 K": 1000,
            "1 mile": 1609.34,
            "2 mile": 3218.68,
            "5 K": 5000,
            "10 K": 10000,
        }

    # 🔹 Bereken best efforts
    best_efforts = []
    for label, dist in targets.items():
        best_time = None
        for act in filtered:
            distance = act.get("distance", 0)
            time = act.get("moving_time", 0)
            if distance <= 0 or time <= 0:
                continue
            projected_time = (time / distance) * dist
            if best_time is None or projected_time < best_time:
                best_time = projected_time
        best_efforts.append({"label": label, "time": format_time(best_time)})

    # 🔹 Extra fietsstatistieken
    if type_.lower() == "ride":
        longest_ride = max(a.get("distance", 0) for a in filtered) / 1000
        biggest_climb = max(a.get("total_elevation_gain", 0) or 0 for a in filtered)
        total_elevation = sum(a.get("total_elevation_gain", 0) or 0 for a in filtered)

        return {
            "best_efforts": best_efforts,
            "longestRide": f"{round(longest_ride, 1)} km",
            "biggestClimb": f"{round(biggest_climb)} m",
            "totalElevation": f"{round(total_elevation)} m",
        }

    return {"best_efforts": best_efforts}
def get_activities_for_stats(year: int, type_: str):
    """Statistieken per jaar + laatste 4 weken + best efforts"""
    data = read_json_file("activities_cache.json")
    all_activities = data if isinstance(data, list) else data.get("activities", [])
    filtered_year = [a for a in all_activities if a.get("type") == type_ and a.get("start_date", "").startswith(str(year))]

    def compute_stats(acts, label):
        if not acts:
            return {
                "label": label,
                "weeks": 0,
                "activities_per_week": 0,
                "avg_distance_per_week_km": 0,
                "avg_time_per_week": "0h 0m",
                "avg_elev_gain_per_week_m": 0,
                "total_activities": 0,
                "total_distance_km": 0,
                "total_time": "0h 0m",
            }

        total_dist = sum(a.get("distance", 0) for a in acts)
        total_time = sum(a.get("moving_time", 0) for a in acts)
        total_elev = sum(a.get("total_elevation_gain", 0) for a in acts)
        total_acts = len(acts)

        weeks = len({
            datetime.fromisoformat(a["start_date"].replace("Z", "+00:00")).isocalendar()[1]
            for a in acts if a.get("start_date")
        }) or 1

        avg_dist_week = (total_dist / 1000) / weeks
        avg_elev_week = total_elev / weeks
        avg_time_week = total_time / weeks

        return {
            "label": label,
            "weeks": weeks,
            "activities_per_week": round(total_acts / weeks, 1),
            "avg_distance_per_week_km": round(avg_dist_week, 1),
            "avg_time_per_week": f"{int(avg_time_week // 3600)}h {int((avg_time_week % 3600) // 60)}m",
            "avg_elev_gain_per_week_m": round(avg_elev_week, 1),
            "total_activities": total_acts,
            "total_distance_km": round(total_dist / 1000, 1),
            "total_time": f"{total_time // 3600}h {(total_time % 3600) // 60}m",
        }

    now = datetime.now(timezone.utc)
    four_weeks_ago = now - timedelta(weeks=4)
    filtered_4weeks = [
        a for a in all_activities
        if a.get("type") == type_ and datetime.fromisoformat((a.get("start_date_local") or a.get("start_date")).replace("Z", "+00:00")) >= four_weeks_ago
    ]

    stats_year = compute_stats(filtered_year, "year")
    stats_4weeks = compute_stats(filtered_4weeks, "last_4_weeks")

    all_time_filtered = [a for a in all_activities if a.get("type") == type_]
    total_distance_all = sum(a.get("distance", 0) for a in all_time_filtered)
    total_time_all = sum(a.get("moving_time", 0) for a in all_time_filtered)
    total_elev_all = sum(a.get("total_elevation_gain", 0) for a in all_time_filtered)
    extra_stats = get_best_efforts(type_, all_activities)

    return {
        "year": year,
        "type": type_,
        "yearly": stats_year,
        "last_4_weeks": stats_4weeks,
        "all_time": {
            "total_activities": len(all_time_filtered),
            "total_distance_km": round(total_distance_all / 1000, 1),
            "total_time": f"{total_time_all // 3600}h {(total_time_all % 3600) // 60}m",
            "total_elev_gain_m": round(total_elev_all, 1),
        },
        **extra_stats,
    }


# =========================================================
# 📊 CHARTS
# =========================================================
def get_activities_for_chart():
    """Returnt totalen per week en maand"""
    data = read_json_file("activities_cache.json")
    weekly = defaultdict(lambda: {"totalDistance": 0, "totalTime": 0, "totalElev": 0, "year": 0})
    monthly = defaultdict(lambda: {"totalDistance": 0, "totalTime": 0, "totalElev": 0, "year": 0})

    for a in data:
        start = datetime.fromisoformat(a["start_date_local"])
        year, week = start.year, start.isocalendar().week
        month = start.strftime("%b")

        dist = a.get("distance", 0) / 1000
        time = a.get("moving_time", 0) / 3600
        elev = a.get("total_elevation_gain", 0)

        weekly[(year, week)]["year"] = year
        weekly[(year, week)]["totalDistance"] += dist
        weekly[(year, week)]["totalTime"] += time
        weekly[(year, week)]["totalElev"] += elev

        monthly[(year, month)]["year"] = year
        monthly[(year, month)]["totalDistance"] += dist
        monthly[(year, month)]["totalTime"] += time
        monthly[(year, month)]["totalElev"] += elev

    weekly_list = [{"label": f"Week {w}", "year": y, **v} for (y, w), v in weekly.items()]
    monthly_list = [{"label": m, "year": y, **v} for (y, m), v in monthly.items()]
    return {"weekly": weekly_list, "monthly": monthly_list}


def get_activities_for_period(label, period, year):
    """Filter activiteiten op specifieke week of maand"""
    data = read_json_file("activities_cache.json")
    filtered = []
    for a in data:
        start = datetime.fromisoformat(a["start_date_local"])
        if start.year != year:
            continue
        if (period == "weekly" and f"Week {start.isocalendar().week}" == label) or (
            period == "monthly" and start.strftime("%b") == label
        ):
            filtered.append(a)
    return filtered


# =========================================================
# 👟 GEAR SAMENVATTING
# =========================================================
def build_gear_summary(athlete: dict, activities_data: dict | list) -> list:
    shoes = athlete.get("shoes", [])
    if not shoes:
        return []

    all_activities = activities_data if isinstance(activities_data, list) else activities_data.get("activities", [])
    gear_summary = {
        s["id"]: {
            "id": s["id"],
            "name": s["name"],
            "distance_km": round(s.get("distance", 0) / 1000, 1),
            "retired": s.get("retired", False),
            "primary": s.get("primary", False),
            "activities": [],
        }
        for s in shoes
    }

    for act in all_activities:
        gid= act.get("gear_id")
        if gid in gear_summary:
            gear_summary[gid]["activities"].append({
                "id": act.get("id"),
                "name": act.get("name"),
                "distance_km": round(act.get("distance", 0) / 1000, 1),
                "type": act.get("type"),
                "start_date": act.get("start_date"),
                "map": act.get("map", {}),
            })

    # Voeg waarschuwing toe als schoen meer dan 800 km heeft
    for g in gear_summary.values():
        g["warning"] = g["distance_km"] >= 800

    return list(gear_summary.values())
