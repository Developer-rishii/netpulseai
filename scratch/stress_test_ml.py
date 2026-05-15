import requests
import json
import time

URL = "http://localhost:8000/predict"

print("Starting Deep Verification (3 rounds to stabilize rolling means)...\n")

critical_data = {
    "active_users": 600,
    "latency": 500.0,
    "throughput": 1.5,
    "packet_loss": 18.0,
    "signal_strength": -65.0
}

for i in range(3):
    print(f"Round {i+1} - Sending Extreme Congestion Data...")
    try:
        response = requests.post(URL, json=critical_data)
        if response.status_code == 200:
            result = response.json()
            level = result['congestion_level']
            status = "Normal" if level == 0 else "Moderate" if level == 1 else "Critical"
            print(f"Prediction: {level} ({status})")
        else:
            print(f"Error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Request failed: {e}")
    time.sleep(0.5)

print("\nFinal Assurance Test Complete.")
