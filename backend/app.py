from flask import Flask, jsonify
from flask_cors import CORS
import os, requests
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return jsonify({"message": "Flask is running!"})
