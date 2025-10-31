let totalBuilds = 25;
let successBuilds = 23;

app.get('/metrics', (req, res) => {

    // ✅ Simulating CI/CD pipeline behavior
    const newBuilds = Math.floor(Math.random() * 3); // 0-2 new builds
    const fails = Math.random() < 0.3 ? 1 : 0; // 30% chance a build fails

    totalBuilds += newBuilds;
    successBuilds += (newBuilds - fails);

    if (successBuilds < 0) successBuilds = 0;

    const failedBuilds = totalBuilds - successBuilds;
    const avgBuildTime = `${(Math.random() * 3 + 2).toFixed(1)} mins`;

    res.json({
        totalBuilds,
        successBuilds,
        failedBuilds,
        avgBuildDuration: avgBuildTime
    });
});

