import requests
import json
import time

URL = "http://localhost:8000/predict"

scenarios = [
    {
        "name": "Normal (Low Traffic)",
        "data": {
            "active_users": 50,
            "latency": 35.0,
            "throughput": 85.0,
            "packet_loss": 0.2,
            "signal_strength": -45.0
        }
    },
    {
        "name": "Moderate (Average Traffic)",
        "data": {
            "active_users": 200,
            "latency": 110.0,
            "throughput": 40.0,
            "packet_loss": 2.1,
            "signal_strength": -52.0
        }
    },
    {
        "name": "Critical (High Congestion)",
        "data": {
            "active_users": 450,
            "latency": 250.0,
            "throughput": 12.0,
            "packet_loss": 7.5,
            "signal_strength": -58.0
        }
    }
]

print("Starting ML Model Verification Tests...\n")

for scenario in scenarios:
    print(f"Testing Scenario: {scenario['name']}")
    print(f"Data: {json.dumps(scenario['data'], indent=2)}")
    
    try:
        response = requests.post(URL, json=scenario['data'])
        if response.status_code == 200:
            result = response.json()
            level = result['congestion_level']
            status = "Normal" if level == 0 else "Moderate" if level == 1 else "Critical"
            print(f"Prediction: {level} ({status}) [SUCCESS]")
        else:
            print(f"Error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Request failed: {e}")
    
    print("-" * 30)
    time.sleep(1)
