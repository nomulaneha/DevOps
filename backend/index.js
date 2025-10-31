
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 5000;

// Replace with your GitHub repo details
const owner = "your-username";
const repo = "your-repo";

app.get('/metrics', async (req, res) => {
    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/runs`);
        const data = await response.json();

        const runs = data.workflow_runs || [];
        const total = runs.length;
        const success = runs.filter(r => r.conclusion === "success").length;
        const failure = runs.filter(r => r.conclusion === "failure").length;

        let durations = [];
        runs.forEach(r => {
            if (r.run_started_at && r.updated_at) {
                const d1 = new Date(r.run_started_at);
                const d2 = new Date(r.updated_at);
                durations.push((d2 - d1) / 1000 / 60); // minutes
            }
        });

        const avgDuration = durations.length ? (durations.reduce((a,b)=>a+b,0) / durations.length).toFixed(2) : 0;

        res.json({ total, success, failure, avgDuration });
    } catch(err) {
        res.status(500).json({ message: "Error fetching metrics", error: err.toString() });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
