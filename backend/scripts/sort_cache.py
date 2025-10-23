import json, os

path = "data/activities_cache.json"

with open(path, "r", encoding="utf-8") as f:
    data = json.load(f)

if isinstance(data, dict) and "activities" in data:
    acts = data["activities"]
else:
    acts = data

acts.sort(key=lambda a: a.get("start_date", ""), reverse=True)

with open(path, "w", encoding="utf-8") as f:
    json.dump(acts, f, indent=2, ensure_ascii=False)

print(f"✅ Gesorteerd {len(acts)} activiteiten (nieuwste eerst) en opgeslagen!")
