from flask import Flask, jsonify
from flask_cors import CORS
from services.strava_services import get_activities, get_activity


app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return jsonify({"message": "Flask is running!"})
@app.route("/activities")
def activities():
    data= get_activities()
    return jsonify(data)

@app.route("/activity/<id>")
def get_activity_by_id(id):
    data= get_activity(id)
    return jsonify(data)
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)