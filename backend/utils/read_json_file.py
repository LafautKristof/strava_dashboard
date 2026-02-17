import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")


def read_json_file(filename: str):
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path):
        return FileNotFoundError(f"{filename} not found in {DATA_DIR}")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)
