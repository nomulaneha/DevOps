const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

let totalBuilds = 25;
let successBuilds = 23;

// Metrics API
app.get("/metrics", (req, res) => {
    const newBuilds = Math.floor(Math.random() * 3); // 0-2 new builds
    const fails = Math.random() < 0.3 ? 1 : 0; // 30% fail chance

    totalBuilds += newBuilds;
    successBuilds += Math.max(0, newBuilds - fails);

    const failedBuilds = totalBuilds - successBuilds;
    const avgBuildTime = `${(Math.random() * 3 + 2).toFixed(1)} mins`;

    res.json({
        totalBuilds,
        successBuilds,
        failedBuilds,
        avgBuildDuration: avgBuildTime
    });
});

// Default route (optional)
app.get("/", (req, res) => {
    res.send("✅ DevOps Backend is running!");
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
