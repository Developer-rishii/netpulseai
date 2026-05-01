from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
from collections import deque

app = FastAPI()

# Load the trained model
try:
    model = joblib.load("model.pkl")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Cache for rolling features (last 5 readings)
history = {
    "active_users": deque(maxlen=5),
    "latency": deque(maxlen=5),
    "throughput": deque(maxlen=5)
}

class NetworkData(BaseModel):
    active_users: int
    latency: float
    throughput: float
    packet_loss: float
    signal_strength: float

@app.post("/predict")
async def predict(data: NetworkData):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    # Get current hour (matching training feature 'hour')
    from datetime import datetime
    current_hour = datetime.now().hour

    # Update history for rolling features
    history["active_users"].append(data.active_users)
    history["latency"].append(data.latency)
    history["throughput"].append(data.throughput)

    # Calculate rolling means (default to current value if not enough history)
    users_roll = np.mean(history["active_users"]) if history["active_users"] else data.active_users
    latency_roll = np.mean(history["latency"]) if history["latency"] else data.latency
    throughput_roll = np.mean(history["throughput"]) if history["throughput"] else data.throughput

    # Prepare input for model in the EXACT order of training columns:
    # ['hour', 'active_users', 'latency', 'packet_loss', 'throughput', 'signal_strength', 'users_roll', 'latency_roll', 'throughput_roll']
    input_data = pd.DataFrame([{
        "hour": current_hour,
        "active_users": data.active_users,
        "latency": data.latency,
        "packet_loss": data.packet_loss,
        "throughput": data.throughput,
        "signal_strength": data.signal_strength,
        "users_roll": users_roll,
        "latency_roll": latency_roll,
        "throughput_roll": throughput_roll
    }])

    try:
        prediction = model.predict(input_data)
        return {"congestion_level": int(prediction[0])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
