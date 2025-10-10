import requests
import os
from dotenv import load_dotenv
from utils.token_manager import get_access_token
load_dotenv()

def get_activities():
    # Get recent activities from Strava
    access_token = get_access_token()
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get("https://www.strava.com/api/v3/athlete/activities", headers=headers)
    return response.json()

def get_activity(id):
    access_token = get_access_token()
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(f"https://www.strava.com/api/v3/activities/{id}", headers=headers)
    return response.json()