
console.log("📡 Frontend script loaded");

const API_URL = "http://localhost:5000/metrics";

// Simulated data for charts — looks realistic
let buildHistory = [20, 21, 23, 22, 24, 25];
let failHistory = [1, 1, 2, 2, 2, 2];
let codeCoverage = [70, 73, 75, 78, 80, 82];

let lineChart, doughnutChart, barChart;

async function loadMetrics() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        console.log("✅ Data:", data);

        document.getElementById("buildsCount").textContent = data.totalBuilds;
        document.getElementById("successRate").textContent =
            ((data.successBuilds / data.totalBuilds) * 100).toFixed(1) + "%";
        document.getElementById("failedBuilds").textContent = data.failedBuilds;
        document.getElementById("avgBuildTime").textContent = data.avgBuildDuration;

       const depElem = document.getElementById("deploymentStatus");

        if (data.failedBuilds === 0) {
            depElem.textContent = "Deployment Successful";
            depElem.classList.add("status-success");
            depElem.classList.remove("status-failed");
        } else {
            depElem.textContent = "Deployment Failed";
            depElem.classList.add("status-failed");
            depElem.classList.remove("status-success");
        }

        updateCharts(data);

    } catch (error) {
        console.error("❌ Backend unreachable:", error);
        document.getElementById("deploymentStatus").textContent = "❌ Server Down";
    }
}


// ✅ DARK MODE TOGGLE
const darkToggle = document.getElementById("darkModeToggle");

darkToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode");

    // Save preference
    localStorage.setItem("theme",
        document.body.classList.contains("dark-mode") ? "dark" : "light"
    );
});

// ✅ Load saved mode on refresh
window.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        darkToggle.checked = true;
    }
    loadMetrics(); // also call metrics loader
});
document.getElementById("refreshBtn").addEventListener("click", loadMetrics);


function updateCharts(data) {
    const labels = ["Day1", "Day2", "Day3", "Day4", "Day5", "Day6"];

    buildHistory.push(data.totalBuilds);
    failHistory.push(data.failedBuilds);
    codeCoverage.push(Math.floor(Math.random() * 10) + 75);

    if (buildHistory.length > 6) buildHistory.shift();
    if (failHistory.length > 6) failHistory.shift();
    if (codeCoverage.length > 6) codeCoverage.shift();

    if (!lineChart) {
        lineChart = new Chart(document.getElementById("lineChart"), {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: "Total Builds",
                    data: buildHistory,
                    borderWidth: 2
                }]
            }
        });
    } else {
        lineChart.data.datasets[0].data = buildHistory;
        lineChart.update();
    }

    if (!doughnutChart) {
        doughnutChart = new Chart(document.getElementById("doughnutChart"), {
            type: "doughnut",
            data: {
                labels: ["Success", "Fail"],
                datasets: [{
                    data: [data.successBuilds, data.failedBuilds]
                }]
            }
        });
    } else {
        doughnutChart.data.datasets[0].data = [data.successBuilds, data.failedBuilds];
        doughnutChart.update();
    }

    if (!barChart) {
        barChart = new Chart(document.getElementById("barChart"), {
            type: "bar",
            data: {
                labels,
                datasets: [{
                    label: "Coverage %",
                    data: codeCoverage,
                    borderWidth: 1
                }]
            }
        });
    } else {
        barChart.data.datasets[0].data = codeCoverage;
        barChart.update();
    }
}

window.addEventListener("DOMContentLoaded", loadMetrics);
setInterval(loadMetrics, 10000);