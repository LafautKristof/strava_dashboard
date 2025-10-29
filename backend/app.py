from flask import Flask, jsonify, Response, request
from flask_cors import CORS
import json
from datetime import datetime, timezone
from services.strava_services import (
    get_activities,
    get_activity,
    get_athlete,
    get_athlete_stats,
    get_stream_by_id,
    get_activities_after_date,
    save_my_route,
    get_all_routes,
    delete_route_by_id,
    delete_routes,
    update_my_route,
    get_activities_by_date,
    get_activities_for_stats,
    get_activities_for_chart,
    get_activities_for_period,
    build_gear_summary,
)

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return jsonify({"message": "Flask is running!"})


@app.route("/activities")
def activities():
    after_str = request.args.get("after")
    try:
        if after_str:
            after_date = datetime.fromisoformat(after_str).replace(tzinfo=timezone.utc)
            data = get_activities_after_date(after_date)
        else:
            data = get_activities()
        return Response(json.dumps(data, default=str, ensure_ascii=False), mimetype="application/json")
    except ValueError:
        return jsonify({"error": "Invalid date format, expected YYYY-MM-DD"}), 400


@app.route("/activity/<id>")
def activity_by_id(id):
    return jsonify(get_activity(id))


@app.route("/athlete")
def athlete():
    return jsonify(get_athlete())


@app.route("/stats")
def athlete_stats():
    return jsonify(get_athlete_stats())


@app.route("/streams/<id>")
def stream(id):
    return jsonify(get_stream_by_id(id))


@app.route("/save_route", methods=["POST"])
def save_route():
    data = request.get_json()
    return jsonify(save_my_route(data))


@app.route("/my_routes", methods=["GET"])
def routes():
    return jsonify(get_all_routes())


@app.route("/my_routes/<id>", methods=["DELETE"])
def delete_route(id):
    return jsonify(delete_route_by_id(id))


@app.route("/my_routes", methods=["DELETE"])
def delete_all_routes():
    return jsonify(delete_routes())


@app.route("/update_route/<id>", methods=["PUT"])
def update_route(id):
    return jsonify(update_my_route(id, request.get_json()))


@app.route("/activities/day/<date>")
def activities_day(date):
    return jsonify(get_activities_by_date(date))


@app.route("/my_stats")
def my_stats():
    year = request.args.get("date", type=int)
    type_ = (request.args.get("type") or "").capitalize()
    return jsonify(get_activities_for_stats(year, type_))


@app.route("/overall_chart")
def overall_chart():
    return jsonify(get_activities_for_chart())


@app.route("/activities_by_period")
def activities_by_period():
    label = request.args.get("label")
    period = request.args.get("type")
    year = int(request.args.get("year"))
    return jsonify(get_activities_for_period(label, period, year))


@app.route("/my_gear")
def gear_summary():
    athlete = get_athlete()
    activities_data = get_activities()
    return Response(
        json.dumps(build_gear_summary(athlete, activities_data), default=str, ensure_ascii=False),
        mimetype="application/json"
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
