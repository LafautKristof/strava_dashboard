import os
from dotenv import load_dotenv
import time
import requests
load_dotenv()

CLIENT_ID = os.getenv("STRAVA_CLIENT_ID")
CLIENT_SECRET = os.getenv("STRAVA_CLIENT_SECRET")
REFRESH_TOKEN = os.getenv("STRAVA_REFRESH_TOKEN")

ACCESS_TOKEN= None
EXPIRES_AT = 0
def get_access_token():
    #Gives a valid access token, refresh token if expired
    global ACCESS_TOKEN, EXPIRES_AT
    if ACCESS_TOKEN and time.time() < EXPIRES_AT:
        return ACCESS_TOKEN
    print("Getting new access token")
    response = requests.post(
        "https://www.strava.com/oauth/token",
        data={
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "grant_type": "refresh_token",
            "refresh_token": REFRESH_TOKEN
        },
    ).json()
    ACCESS_TOKEN = response["access_token"]
    EXPIRES_AT = response["expires_in"]
    return ACCESS_TOKEN
