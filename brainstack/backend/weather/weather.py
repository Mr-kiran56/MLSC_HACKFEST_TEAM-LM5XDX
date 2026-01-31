import requests

def get_lat_lon(state, district):
    url = "https://geocoding-api.open-meteo.com/v1/search"
    params = {
        "name": district,
        "country": "IN",
        "count": 1,
        "language": "en",
        "format": "json"
    }

    res = requests.get(url, params=params).json()

    if "results" not in res:
        raise ValueError("District not found")

    lat = res["results"][0]["latitude"]
    lon = res["results"][0]["longitude"]

    return lat, lon



import pandas as pd
from datetime import date

def past_5_years_weather(lat, lon):
    url = "https://archive-api.open-meteo.com/v1/archive"

    params = {
        "latitude": lat,
        "longitude": lon,
        "start_date": "2021-01-01",
        "end_date": date.today().strftime("%Y-%m-%d"),
        "hourly": [
            "temperature_2m",
            "apparent_temperature",
            "relative_humidity_2m",
            "dew_point_2m",
            "precipitation",
            "rain",
            "wind_speed_10m",
            "cloud_cover",
            "surface_pressure",
            "soil_moisture_0_1cm"
        ],
        "timezone": "Asia/Kolkata"
    }

    data = requests.get(url, params=params).json()
    return pd.DataFrame(data["hourly"])


def future_weather(lat, lon):
    url = "https://api.open-meteo.com/v1/forecast"

    params = {
        "latitude": lat,
        "longitude": lon,
        "hourly": [
            "temperature_2m",
            "apparent_temperature",
            "relative_humidity_2m",
            "precipitation_probability",
            "rain",
            "wind_speed_10m",
            "cloud_cover",
            "shortwave_radiation"
        ],
        "daily": [
            "temperature_2m_max",
            "temperature_2m_min",
            "apparent_temperature_max",
            "precipitation_sum",
            "rain_sum",
            "wind_speed_10m_max",
            "uv_index_max"
        ],
        "forecast_days": 10,
        "timezone": "Asia/Kolkata"
    }

    return requests.get(url, params=params).json()


state = "Andhra Pradesh"
district = "Guntur"

lat, lon = get_lat_lon(state, district)
print(f"Location: {district}, {state}")
print("Latitude:", lat, "Longitude:", lon)

# Past data
past_df = past_5_years_weather(lat, lon)
past_df.to_csv("past_5_years_weather.csv", index=False)

# Future data
future = future_weather(lat, lon)

print("\nNEXT 1 HOUR WEATHER:")
print(pd.DataFrame(future["hourly"]).head(1))

print("\nNEXT 10 DAYS WEATHER:")
print(pd.DataFrame(future["daily"]))
