
// ==========================================
// AQUA SMART WATER MANAGEMENT DASHBOARD
// ==========================================

const TANK_CAPACITY_LITRES = 2000;

let waterLevelPercent = 68;
let autoMode = true;
let pumpOn = true;

const $ = (id) => document.getElementById(id);


// ==========================================
// DEMO HISTORY DATA
// Replace with actual database records later
// ==========================================

function getLocalDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

const historyData = [
    { time: "06:00", level: 54, pump: "ON", mode: "AUTO", date: getLocalDate() },
    { time: "08:00", level: 59, pump: "ON", mode: "AUTO", date: getLocalDate() },
    { time: "10:00", level: 65, pump: "OFF", mode: "AUTO", date: getLocalDate() },
    { time: "12:00", level: 62, pump: "OFF", mode: "AUTO", date: getLocalDate() },
    { time: "14:00", level: 68, pump: "ON", mode: "MANUAL", date: getLocalDate() },
    { time: "16:00", level: 68, pump: "ON", mode: "MANUAL", date: getLocalDate() }
];


// ==========================================
// DASHBOARD UPDATE
// ==========================================

function updateDashboard(percent, pumpStatus = pumpOn) {

    waterLevelPercent = Math.max(0, Math.min(100, Number(percent)));

    pumpOn = Boolean(pumpStatus);

    const litres = Math.round(
        TANK_CAPACITY_LITRES * waterLevelPercent / 100
    );

    $("levelPercent").textContent =
        `${waterLevelPercent.toFixed(0)}%`;

    $("levelLitres").textContent =
        litres.toLocaleString();

    $("levelBar").style.width =
        `${waterLevelPercent}%`;

    $("tankWater").style.height =
        `${waterLevelPercent}%`;

    const filledBands = Math.ceil(waterLevelPercent / 20);

    document.querySelectorAll(".tank-segment").forEach((band, index) => {
        band.style.opacity = index < filledBands ? "1" : ".13";
    });

    // UPDATE ACTUAL PUMP STATE

const pumpStateElement = $("pumpState");

if (pumpStateElement) {

    if (pumpOn === true) {

        pumpStateElement.textContent = "PUMP ON";

        pumpStateElement.classList.remove("is-off");
        pumpStateElement.classList.add("is-on");

    } else {

        pumpStateElement.textContent = "PUMP OFF";

        pumpStateElement.classList.remove("is-on");
        pumpStateElement.classList.add("is-off");

    }
}

// UPDATE PUMP BUTTON TEXT

$("pumpSwitchText").textContent = pumpOn ? "ON" : "OFF";

$("pumpSwitch").classList.toggle("off", !pumpOn);
// Update pump switch

$("pumpSwitchText").textContent = pumpOn ? "ON" : "OFF";

$("pumpSwitch").classList.toggle("off", !pumpOn);

    $("sensorTime").textContent = new Date().toLocaleTimeString();

    $("lastUpdated").textContent =
        `Updated ${new Date().toLocaleTimeString()}`;
}


// ==========================================
// AUTOMATIC PUMP CONTROL
// ==========================================

function applyAutomaticPumpRule() {

    if (!autoMode) return;

    if (waterLevelPercent <= 30) {
        pumpOn = true;
    }

    if (waterLevelPercent >= 80) {
        pumpOn = false;
    }

    updateDashboard(waterLevelPercent, pumpOn);
}


function setMode(isAuto) {

    autoMode = isAuto;

    $("modeSwitch").classList.toggle("auto", autoMode);

    $("modeSwitch").setAttribute(
        "aria-checked",
        String(autoMode)
    );

    $("modeSwitchText").textContent =
        autoMode ? "AUTO" : "MANUAL";

    $("modeTitle").textContent =
        autoMode ? "AUTO MODE" : "MANUAL MODE";

    $("modeDescription").textContent = autoMode
        ? "Pump is controlled automatically by sensor readings."
        : "You are in control. Switch the pump ON or OFF manually.";

    // IMPORTANT: Enable pump button in MANUAL mode

    $("pumpSwitch").disabled = autoMode;

    $("controlNote").textContent = autoMode
        ? "AUTO: Pump ON at 30% or below · Pump OFF at 80% or above."
        : "MANUAL: Use the Pump State switch to control the pump.";

    if (autoMode) {
        applyAutomaticPumpRule();
    }

    updateDashboard(waterLevelPercent, pumpOn);
}

// ==========================================
// BUTTON EVENTS
// ==========================================

$("modeSwitch").addEventListener("click", () => {
    setMode(!autoMode);
});


$("pumpSwitch").addEventListener("click", () => {

    if (autoMode) return;

    pumpOn = !pumpOn;

    updateDashboard(waterLevelPercent, pumpOn);

});


// Logout button is optional.
// Do not crash if the dashboard has no logout button.

if ($("logoutBtn")) {

    $("logoutBtn").addEventListener("click", () => {

        sessionStorage.removeItem("aquaDemoLoggedIn");
        sessionStorage.removeItem("aquaUserEmail");

        window.location.href = "login.html";

    });

}


// ==========================================
// WATER LEVEL HISTORY GRAPH
// ==========================================

function createWaterChart() {

    const canvas = $("waterChart");

    if (!canvas) {
        console.error("Water chart canvas not found!");
        return;
    }

    if (typeof Chart === "undefined") {
        console.error("Chart.js library is not loaded!");
        return;
    }

    // Prevent duplicate charts
    const existingChart = Chart.getChart(canvas);

    if (existingChart) {
        existingChart.destroy();
    }

    new Chart(canvas, {

        type: "line",

        data: {

            labels: historyData.map(item => item.time),

            datasets: [{

                label: "Water Level",

                data: historyData.map(item => item.level),

                borderColor: "#269dbb",

                backgroundColor: "rgba(38,157,187,0.15)",

                fill: true,

                tension: 0.35,

                borderWidth: 3,

                pointRadius: 5,

                pointBackgroundColor: "#269dbb"

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    display: true,
                    position: "top"
                },

                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Water Level: ${context.parsed.y}%`;
                        }
                    }
                }

            },

            scales: {

                y: {

                    min: 0,

                    max: 100,

                    title: {
                        display: true,
                        text: "Water Level (%)"
                    },

                    ticks: {
                        callback: value => value + "%"
                    }

                },

                x: {

                    title: {
                        display: true,
                        text: "Time"
                    }

                }

            }

        }

    });

}


// ==========================================
// PDF REPORT MODAL
// ==========================================

const modal = $("reportModal");


function formatLocalDate(date) {

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


function openReport() {

    const today = new Date();

    const prior = new Date();

    prior.setDate(today.getDate() - 7);

    $("startDate").value = formatLocalDate(prior);

    $("endDate").value = formatLocalDate(today);

    $("reportError").textContent = "";

    modal.classList.add("open");

    modal.setAttribute("aria-hidden", "false");

}


function closeReport() {

    modal.classList.remove("open");

    modal.setAttribute("aria-hidden", "true");

}


$("openReport").addEventListener("click", openReport);

$("closeReport").addEventListener("click", closeReport);


modal.addEventListener("click", event => {

    if (event.target === modal) {
        closeReport();
    }

});


// ==========================================
// CALCULATE PUMP RUNNING TIME
// ==========================================

function calculatePumpDuration(records) {

    let onMinutes = 0;

    let offMinutes = 0;

    for (let i = 0; i < records.length - 1; i++) {

        const current = records[i];

        const next = records[i + 1];

        const start = new Date(`${current.date}T${current.time}:00`);

        const end = new Date(`${next.date}T${next.time}:00`);

        const minutes = Math.max(
            0,
            (end - start) / 60000
        );

        if (current.pump === "ON") {
            onMinutes += minutes;
        } else {
            offMinutes += minutes;
        }

    }

    return { onMinutes, offMinutes };

}


function formatDuration(minutes) {

    const hours = Math.floor(minutes / 60);

    const remainingMinutes = Math.round(minutes % 60);

    return `${hours}h ${remainingMinutes}m`;

}


// ==========================================
// GENERATE PDF REPORT
// ==========================================

function generatePDFReport(startDate, endDate) {

    try {

        if (!window.jspdf || !window.jspdf.jsPDF) {
            throw new Error("jsPDF library is not loaded.");
        }

        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF("landscape", "mm", "a4");

        // Filter selected dates
        const filteredData = historyData
            .filter(item =>
                item.date >= startDate &&
                item.date <= endDate
            )
            .sort((a, b) =>
                (a.date + a.time).localeCompare(b.date + b.time)
            );

        if (filteredData.length === 0) {

            $("reportError").textContent =
                "No records found for the selected dates.";

            return;

        }

        // Check AutoTable plugin
        if (typeof pdf.autoTable !== "function") {
            throw new Error("PDF AutoTable plugin is not loaded.");
        }

        $("reportError").textContent = "";

        // REPORT HEADING
        pdf.setFontSize(23);

        pdf.setTextColor(0, 115, 175);

        pdf.text("AQUA SMART", 148, 16, {
            align: "center"
        });

        pdf.setFontSize(15);

        pdf.setTextColor(30, 50, 65);

        pdf.text("WATER MANAGEMENT REPORT", 148, 25, {
            align: "center"
        });

        pdf.setFontSize(10);

        pdf.text(
            `Report Period: ${startDate} to ${endDate}`,
            14,
            34
        );

        pdf.text(
            `Total Records: ${filteredData.length}`,
            280,
            34,
            { align: "right" }
        );


        // TABLE ROWS
        const tableRows = filteredData.map((item, index) => [

            index + 1,

            item.date,

            item.mode,

            item.pump === "ON" ? item.time : "-",

            item.pump === "OFF" ? item.time : "-",

            item.pump === "ON" ? `${item.level}%` : "-",

            item.pump === "OFF" ? `${item.level}%` : "-"

        ]);


        // GENERATE TABLE
        pdf.autoTable({

            startY: 40,

            head: [[

                "Number",

                "Date",

                "Mode",

                "Pump ON time",

                "Pump OFF time",

                "Water level Pump ON",

                "Water level Pump OFF"

            ]],

            body: tableRows,

            theme: "grid",

            styles: {

                fontSize: 9,

                halign: "center",

                cellPadding: 4

            },

            headStyles: {

                fillColor: [0, 105, 160],

                textColor: 255,

                fontStyle: "bold"

            },

            alternateRowStyles: {

                fillColor: [235, 245, 250]

            }

        });


        // PUMP DURATION ANALYSIS
        const duration = calculatePumpDuration(filteredData);

        const totalOn = duration.onMinutes;

        const totalOff = duration.offMinutes;

        let chartY = pdf.lastAutoTable.finalY + 15;


        if (chartY + 105 > 190) {

            pdf.addPage();

            chartY = 20;

        }


        pdf.setFontSize(15);

        pdf.setTextColor(0, 80, 120);

        pdf.text(
            "Pump Operating Time Analysis",
            148,
            chartY,
            { align: "center" }
        );


        pdf.setFontSize(10);

        pdf.setTextColor(40, 40, 40);

        pdf.text(
            `Pump ON: ${formatDuration(totalOn)}`,
            80,
            chartY + 12
        );

        pdf.text(
            `Pump OFF: ${formatDuration(totalOff)}`,
            165,
            chartY + 12
        );


        // CREATE PIE CHART
        const chartCanvas = document.createElement("canvas");

        chartCanvas.width = 600;

        chartCanvas.height = 350;

        const ctx = chartCanvas.getContext("2d");

        const pieChart = new Chart(ctx, {

            type: "pie",

            data: {

                labels: ["Pump ON", "Pump OFF"],

                datasets: [{

                    data: [totalOn, totalOff],

                    backgroundColor: [
                        "#16A085",
                        "#3498DB"
                    ],

                    borderColor: "#ffffff",

                    borderWidth: 3

                }]

            },

            options: {

                responsive: false,

                animation: false,

                plugins: {

                    legend: {
                        position: "bottom"
                    },

                    title: {
                        display: true,
                        text: "Pump ON vs Pump OFF Duration"
                    }

                }

            }

        });


        pieChart.update("none");

        const chartImage = chartCanvas.toDataURL("image/png");

        pdf.addImage(
            chartImage,
            "PNG",
            88,
            chartY + 15,
            120,
            70
        );

        pieChart.destroy();


        // SAVE PDF
        pdf.save("AQUA_Water_Management_Report.pdf");

        closeReport();

    }

    catch (error) {

        console.error("PDF Report Error:", error);

        $("reportError").textContent =
            "Report generation failed: " + error.message;

    }

}


// ==========================================
// GENERATE BUTTON EVENT
// IMPORTANT: HTML ID IS generatePdf
// ==========================================

$("generatePdf").addEventListener("click", function() {

    const startDate = $("startDate").value;

    const endDate = $("endDate").value;

    if (!startDate || !endDate) {

        $("reportError").textContent =
            "Please select both dates.";

        return;

    }

    if (startDate > endDate) {

        $("reportError").textContent =
            "Start date cannot be after end date.";

        return;

    }

    generatePDFReport(startDate, endDate);

});


// ==========================================
// INITIALIZE DASHBOARD
// ==========================================

document.addEventListener("DOMContentLoaded", function() {

    setMode(true);

    updateDashboard(waterLevelPercent, pumpOn);

    createWaterChart();

    console.log("AQUA Dashboard initialized successfully.");

});
