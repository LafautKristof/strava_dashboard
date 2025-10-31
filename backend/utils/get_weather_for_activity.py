import requests
from datetime import datetime, timezone

def get_weather_for_activity(lat, lon, date_local):
    """Haalt weerinfo op voor één activiteit."""
    try:
        dt = datetime.fromisoformat(date_local.replace("Z", "+00:00"))
        dt = dt.astimezone(timezone.utc)  # zorg dat het altijd UTC-aware is
    except Exception:
        print(f"⚠️ [Weather] Kon datum niet parsen: {date_local}")
        return None

    date_str = dt.strftime("%Y-%m-%d")

    url = (
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude={lat}&longitude={lon}"
        f"&start_date={date_str}&end_date={date_str}"
        f"&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,"
        f"windspeed_10m,winddirection_10m,cloudcover"
        f"&timezone=Europe/Brussels"
    )

    print(f"🌍 [Weather] Request for {date_local} @ ({lat}, {lon})")
    print(f"🌐 [Weather] Fetching: {url}")

    res = requests.get(url, timeout=10)
    if res.status_code != 200:
        print(f"⚠️ [Weather] Fetch failed ({res.status_code}) voor {lat},{lon}")
        return None

    data = res.json().get("hourly", {})
    if not data or "time" not in data:
        print("⚠️ [Weather] Geen hourly data gevonden.")
        return None

    times = data["time"]
    values = list(zip(
        data["temperature_2m"],
        data["apparent_temperature"],
        data["relative_humidity_2m"],
        data["windspeed_10m"],
        data["winddirection_10m"],
        data["cloudcover"],
    ))

    from math import fabs

    # ✅ Maak ook Open-Meteo tijden UTC-aware
    try:
        dt_list = [datetime.fromisoformat(t).replace(tzinfo=timezone.utc) for t in times]
        idx = min(range(len(dt_list)), key=lambda i: fabs((dt_list[i] - dt).total_seconds()))
    except Exception as e:
        print(f"⚠️ [Weather] Time match failed: {e}")
        return None

    temp, feels_like, humidity, windspeed, winddir, clouds = values[idx]

    directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
    wind_index = int((winddir + 22.5) // 45) % 8
    wind_cardinal = directions[wind_index]

    condition = (
        "Cloudy" if clouds > 60 else
        "Partly Cloudy" if clouds > 30 else
        "Clear"
    )

    return {
        "condition": condition,
        "temperature": round(temp, 1),
        "feels_like": round(feels_like, 1),
        "humidity": int(humidity),
        "wind_speed": round(windspeed, 1),
        "wind_dir": wind_cardinal,
        "cloud_cover": int(clouds),
    }
