const axios = require('axios');

async function simulateESP32() {
  const url = 'http://localhost:5000/api/iot/data';
  const data = {
    active_users: 25,
    latency: 45.5,
    throughput: 120.2
  };

  try {
    console.log('Sending data to server:', data);
    const response = await axios.post(url, data);
    console.log('Server Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

simulateESP32();
