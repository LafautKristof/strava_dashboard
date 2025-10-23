import os
import time
import requests
from dotenv import load_dotenv

load_dotenv()

CLIENT_ID = os.getenv("STRAVA_CLIENT_ID")
CLIENT_SECRET = os.getenv("STRAVA_CLIENT_SECRET")
REFRESH_TOKEN = os.getenv("STRAVA_REFRESH_TOKEN")

ACCESS_TOKEN = None
EXPIRES_AT = 0


def get_access_token():

    global ACCESS_TOKEN, EXPIRES_AT

    if ACCESS_TOKEN and time.time() < EXPIRES_AT:
        return ACCESS_TOKEN

    print("🔑 Getting new access token...")

    response = requests.post(
        "https://www.strava.com/api/v3/oauth/token",
        data={
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "grant_type": "refresh_token",
            "refresh_token": REFRESH_TOKEN,
        },
    )

    if response.status_code != 200:
        raise Exception(f"❌ Failed to refresh token: {response.text}")

    data = response.json()
    ACCESS_TOKEN = data["access_token"]
 
    EXPIRES_AT = data["expires_at"]

    print(f"✅ Token valid until {time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(EXPIRES_AT))}")
    return ACCESS_TOKEN
