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

@app.post("/predict")
async def predict(data: NetworkData):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    # Update history
    history["active_users"].append(data.active_users)
    history["latency"].append(data.latency)
    history["throughput"].append(data.throughput)

    # Calculate rolling means
    users_roll = np.mean(history["active_users"])
    latency_roll = np.mean(history["latency"])
    throughput_roll = np.mean(history["throughput"])

    # Prepare input for model
    # Note: Ensure the order of columns matches the training data
    input_data = pd.DataFrame([{
        "active_users": data.active_users,
        "latency": data.latency,
        "throughput": data.throughput,
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
