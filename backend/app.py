from flask import Flask, jsonify, Response, request
import json
from datetime import datetime, timezone
from flask_cors import CORS
from services.strava_services import (
    get_activities,
    get_activity,
    get_athlete,
    get_athlete_stats,
    get_stream_by_id,
    get_activities_after_date
)

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return jsonify({"message": "Flask is running!"})

@app.route("/activities")
def activities():
    after_str = request.args.get("after")

    if after_str:
        try:
            after_date = datetime.fromisoformat(after_str)
            after_date = after_date.replace(tzinfo=timezone.utc)
            data = get_activities_after_date(after_date)

            
        except ValueError:
            return jsonify({"error": "Invalid date format, expected YYYY-MM-DD"}), 400
    else:
        data = get_activities()


  
    json_str = json.dumps(data, default=str, ensure_ascii=False)
    return Response(json_str, mimetype="application/json")

@app.route("/activity/<id>")
def get_activity_by_id(id):
    data = get_activity(id)
    return jsonify(data)

@app.route("/athlete")
def athlete():
    data=get_athlete()
    return jsonify(data)

@app.route("/stats")
def athlete_stats():
    data=get_athlete_stats
    return jsonify(data)

@app.route("/streams/<id>")
def get_stream(id):
    data=get_stream_by_id(id)
    return jsonify(data)



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
