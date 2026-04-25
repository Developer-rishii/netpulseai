const https = require("https");

exports.runSpeedTest = async (req, res) => {
  try {
    // Switching to GitHub as it is more permissive for server-side downloads
    const testFileUrl = "https://raw.githubusercontent.com/microsoft/vscode/main/package.json"; // 1MB+ roughly
    // For more accurate results, we'll use a larger archive but only download a portion
    const targetUrl = "https://github.com/microsoft/vscode/archive/refs/tags/1.90.0.tar.gz"; 
    
    const startTime = Date.now();
    let downloadedBytes = 0;
    const MAX_BYTES = 10 * 1024 * 1024; // 10MB limit for the test

    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };

    const request = https.get(targetUrl, options, (response) => {
      // Handle redirects (GitHub often redirects to objects.githubusercontent.com)
      if (response.statusCode === 301 || response.statusCode === 302) {
        return https.get(response.headers.location, options, (res2) => {
           handleResponse(res2);
        }).on('error', handleError);
      }

      handleResponse(response);
    });

    const handleResponse = (response) => {
      if (response.statusCode !== 200) {
        console.error(`Speed test failed with status ${response.statusCode}`);
        if (!res.headersSent) {
          res.status(500).json({ message: "Speed test provider error", code: response.statusCode });
        }
        return;
      }

      response.on("data", (chunk) => {
        downloadedBytes += chunk.length;
        // Stop after 10MB to keep test quick
        if (downloadedBytes >= MAX_BYTES) {
          response.destroy();
          calculateAndSend();
        }
      });

      response.on("end", () => {
        calculateAndSend();
      });
    };

    const calculateAndSend = () => {
      if (res.headersSent) return;

      const endTime = Date.now();
      const durationInSeconds = (endTime - startTime) / 1000;
      
      if (durationInSeconds === 0) {
        res.status(200).json({ speed: "0.00", unit: "Mbps" });
        return;
      }

      const bitsLoaded = downloadedBytes * 8;
      const bps = bitsLoaded / durationInSeconds;
      const speedMbps = bps / 1000000;

      res.status(200).json({
        speed: speedMbps.toFixed(2),
        unit: "Mbps",
        method: "NetPulse Edge Measurement",
        timestamp: new Date().toISOString()
      });
    };

    const handleError = (error) => {
      console.error("Speed test request error:", error);
      if (!res.headersSent) {
        res.status(500).json({ message: "Network error during speed test", error: error.message });
      }
    };

    request.on("error", handleError);

    request.setTimeout(30000, () => {
      request.destroy();
      if (!res.headersSent) {
        res.status(504).json({ message: "Speed test timed out" });
      }
    });

  } catch (error) {
    console.error("Speed test controller error:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to perform speed test", error: error.message });
    }
  }
};
