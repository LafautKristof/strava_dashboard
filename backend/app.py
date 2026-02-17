from flask import Flask, jsonify, request
from flask_cors import CORS
from services.get_athlete import get_athlete
from services.get_activities_grouped_by_weeks import get_activities_grouped_by_week
from services.get_activities_stats import get_activities_stats
from services.get_list_activities_paginated import get_list_activities_paginated
from services.get_activity_by_id import get_activity_by_id
from services.get_stream import get_stream
from services.get_activities_grouped_by_month import get_activities_grouped_by_month
from services.get_activities_for_overall import get_activities_for_chart
from services.get_activities_for_period import get_activities_for_period
from services.get_activities_for_stats import get_activities_for_stats
from services.get_my_gear import get_my_gear
from services.get_gear_activities import get_gear_activities
from services.delete_route_by_id import delete_route_by_id
from services.update_my_route import update_my_route
from services.delete_routes import delete_routes
from services.get_all_routes import get_all_routes
from services.save_my_route import save_my_route

app = Flask(__name__)
CORS(app)


@app.route("/api/athlete")
def athlete():
    return jsonify(get_athlete())


@app.route("/api/activities")
def activities():
    page_number = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 10))
    name = request.args.get("name")
    from_date = request.args.get("from")
    to_date = request.args.get("to")
    type = request.args.get("type", "All")
    min_distance = int(request.args.get("min_distance", 0))
    max_distance = int(request.args.get("max_distance", 100000))
    min_time = int(request.args.get("min_time", 0))
    max_time = int(request.args.get("max_time", 28800))
    gear = request.args.get("gear")

    return jsonify(
        get_list_activities_paginated(
            page_number,
            per_page,
            name,
            from_date,
            to_date,
            type,
            min_distance,
            max_distance,
            min_time,
            max_time,
            gear,
        )
    )


@app.route("/api/activities/<id>")
def activity(id):
    return jsonify(get_activity_by_id(id))


@app.route("/api/activities/stats")
def activities_stats():

    return jsonify(get_activities_stats())


@app.route("/api/activities/weeks")
def activities_grouped_by_week():
    range_week = int(request.args.get("range", 8))
    return jsonify(get_activities_grouped_by_week(range_week))


@app.route("/api/activities/month/")
def activities_grouped_by_month():
    year = int(request.args.get("year"))
    month = int(request.args.get("month"))
    return jsonify(get_activities_grouped_by_month(year, month))


@app.route("/api/streams/<id>")
def stream(id):
    return jsonify(get_stream(id))


@app.route("/api/overall_chart")
def overall():
    return jsonify(get_activities_for_chart())


@app.route("/api/my_stats")
def my_stats():
    year = request.args.get("date", type=int)
    type_ = (request.args.get("type") or "").capitalize()

    return jsonify(get_activities_for_stats(year, type_))


@app.route("/api/activities_by_period")
def activities_by_period():
    label = request.args.get("label")
    period = request.args.get("type")
    year = int(request.args.get("year"))

    return jsonify(get_activities_for_period(label, period, year))


@app.route("/api/my_gear")
def my_gear():

    return jsonify(get_my_gear())


@app.route("/api/gear/<gear_id>/activities")
def gear_activities(gear_id):

    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 10))

    return jsonify(
        get_gear_activities(
            gear_id=gear_id,
            page=page,
            per_page=per_page,
        )
    )


@app.route("/api/my_routes", methods=["GET"])
def routes():
    return jsonify(get_all_routes())


@app.route("/api/save_route", methods=["POST"])
def save_route():
    data = request.get_json()
    return jsonify(save_my_route(data))


@app.route("/api/my_routes/<id>", methods=["DELETE"])
def delete_route(id):
    return jsonify(delete_route_by_id(id))


@app.route("/api/my_routes", methods=["DELETE"])
def delete_all_routes():
    return jsonify(delete_routes())


@app.route("/api/update_route/<id>", methods=["PUT"])
def update_route(id):
    return jsonify(update_my_route(id, request.get_json()))


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
