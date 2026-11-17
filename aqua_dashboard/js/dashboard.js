// Demo data. Replace this array/API with your real sensor and pump history.
const TANK_CAPACITY_LITRES = 2000;
let waterLevelPercent = 68;
let autoMode = true;
let pumpOn = true;

const historyData = [
  { time: "06:00", level: 54, pump: "ON" },
  { time: "08:00", level: 59, pump: "ON" },
  { time: "10:00", level: 65, pump: "OFF" },
  { time: "12:00", level: 62, pump: "OFF" },
  { time: "14:00", level: 68, pump: "ON" },
  { time: "16:00", level: 68, pump: "ON" }
];

const $ = (id) => document.getElementById(id);

function updateDashboard(percent, pumpStatus = pumpOn) {
  waterLevelPercent = Math.max(0, Math.min(100, Number(percent)));
  pumpOn = Boolean(pumpStatus);
  const litres = Math.round(TANK_CAPACITY_LITRES * waterLevelPercent / 100);

  $("levelPercent").textContent = `${waterLevelPercent.toFixed(0)}%`;
  $("levelLitres").textContent = litres.toLocaleString();
  $("levelBar").style.width = `${waterLevelPercent}%`;
  $("tankWater").style.height = `${waterLevelPercent}%`;

  // Five equal bands. Green = upper two, orange = middle, red = bottom two.
  // Hide bands that are above the current water level.
  const filledBands = Math.ceil(waterLevelPercent / 20);
  document.querySelectorAll(".tank-segment").forEach((band, index) => {
    band.style.opacity = index < filledBands ? "1" : ".13";
  });

  $("pumpState").textContent = pumpOn ? "ON" : "OFF";
  $("pumpSwitchText").textContent = pumpOn ? "ON" : "OFF";
  $("pumpSwitch").classList.toggle("off", !pumpOn);
  $("sensorTime").textContent = new Date().toLocaleTimeString();
  $("lastUpdated").textContent = `Updated ${new Date().toLocaleTimeString()}`;
}

function applyAutomaticPumpRule() {
  if (!autoMode) return;
  if (waterLevelPercent <= 30) pumpOn = true;
  if (waterLevelPercent >= 80) pumpOn = false;
  updateDashboard(waterLevelPercent, pumpOn);
}

function setMode(isAuto) {
  autoMode = isAuto;
  $("modeSwitch").classList.toggle("auto", autoMode);
  $("modeSwitch").setAttribute("aria-checked", String(autoMode));
  $("modeSwitchText").textContent = autoMode ? "AUTO" : "MANUAL";
  $("modeTitle").textContent = autoMode ? "AUTO MODE" : "MANUAL MODE";
  $("modeDescription").textContent = autoMode
    ? "Pump is controlled automatically by sensor readings."
    : "You are in control. Switch the pump ON or OFF manually.";
  $("pumpSwitch").disabled = autoMode;
  $("controlNote").textContent = autoMode
    ? "AUTO: Pump ON at 30% or below · Pump OFF at 80% or above."
    : "MANUAL: Use the Pump State switch to control the pump.";
  if (autoMode) applyAutomaticPumpRule();
  updateDashboard(waterLevelPercent, pumpOn);
}

$("modeSwitch").addEventListener("click", () => setMode(!autoMode));

$("pumpSwitch").addEventListener("click", () => {
  if (autoMode) return;
  pumpOn = !pumpOn;
  updateDashboard(waterLevelPercent, pumpOn);
});

$("logoutBtn").addEventListener("click", () => {
  // Replace with your actual logout/session-clearing route.
  window.location.href = "login.html";
});

// Water level trend chart
const waterCtx = $("waterChart").getContext("2d");
new Chart(waterCtx, {
  type: "line",
  data: {
    labels: historyData.map(item => item.time),
    datasets: [{
      label: "Water level",
      data: historyData.map(item => item.level),
      borderColor: "#329bb5",
      backgroundColor: "rgba(50,155,181,.12)",
      fill: true,
      tension: .35,
      pointRadius: 3,
      pointBackgroundColor: "#329bb5"
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { min: 0, max: 100, ticks: { callback: value => `${value}%` }, grid: { color: "#edf2f4" } },
      x: { grid: { display: false } }
    }
  }
});

// PDF report date-range modal
const modal = $("reportModal");
function openReport() {
  const today = new Date();
  const prior = new Date();
  prior.setDate(today.getDate() - 7);
  $("startDate").value = prior.toISOString().slice(0, 10);
  $("endDate").value = today.toISOString().slice(0, 10);
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
modal.addEventListener("click", event => { if (event.target === modal) closeReport(); });

function makePumpPie(onCount, offCount) {
  const canvas = $("pumpPieChart");
  const existing = Chart.getChart(canvas);
  if (existing) existing.destroy();
  return new Chart(canvas, {
    type: "pie",
    data: {
      labels: ["Pump ON", "Pump OFF"],
      datasets: [{ data: [onCount, offCount], backgroundColor: ["#48a878", "#d9a14f"], borderColor: "#ffffff", borderWidth: 2 }]
    },
    options: { animation: false, responsive: false, plugins: { legend: { position: "bottom" } } }
  });
}

$("generatePdf").addEventListener("click", async () => {
  const start = $("startDate").value;
  const end = $("endDate").value;
  if (!start || !end || start > end) {
    $("reportError").textContent = "Please select a valid start date and end date.";
    return;
  }

  // Filter actual timestamped records here when connected to your database.
  const selected = historyData;
  if (!selected.length) {
    $("reportError").textContent = "No sensor records are available for this period.";
    return;
  }

  const levels = selected.map(item => Number(item.level));
  const average = levels.reduce((sum, value) => sum + value, 0) / levels.length;
  const minimum = Math.min(...levels);
  const maximum = Math.max(...levels);
  const pumpOnCount = selected.filter(item => item.pump === "ON").length;
  const pumpOffCount = selected.length - pumpOnCount;
  const pie = makePumpPie(pumpOnCount, pumpOffCount);
  await new Promise(resolve => setTimeout(resolve, 150));

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  pdf.setFontSize(19);
  pdf.setTextColor(30, 76, 96);
  pdf.text("AQUA Smart Water Management", 15, 20);
  pdf.setFontSize(12);
  pdf.setTextColor(70, 90, 102);
  pdf.text("Water Monitoring Report", 15, 29);
  pdf.setFontSize(10);
  pdf.text(`Reporting period: ${start} to ${end}`, 15, 40);
  pdf.text(`Generated: ${new Date().toLocaleString()}`, 15, 47);

  pdf.setDrawColor(215, 228, 233);
  pdf.line(15, 53, 195, 53);
  pdf.setFontSize(12);
  pdf.setTextColor(30, 76, 96);
  pdf.text("Water Level Summary", 15, 64);
  pdf.setFontSize(10);
  pdf.setTextColor(55, 70, 80);
  pdf.text(`Average water level: ${average.toFixed(1)}%`, 15, 74);
  pdf.text(`Minimum water level: ${minimum.toFixed(1)}%`, 15, 82);
  pdf.text(`Maximum water level: ${maximum.toFixed(1)}%`, 15, 90);
  pdf.text(`Current tank capacity: ${TANK_CAPACITY_LITRES.toLocaleString()} L`, 15, 98);

  pdf.setFontSize(12);
  pdf.setTextColor(30, 76, 96);
  pdf.text("Pump Activity", 15, 112);
  pdf.setFontSize(10);
  pdf.setTextColor(55, 70, 80);
  pdf.text(`Pump ON records: ${pumpOnCount}`, 15, 122);
  pdf.text(`Pump OFF records: ${pumpOffCount}`, 15, 130);
  pdf.addImage(pie.toBase64Image(), "PNG", 15, 140, 105, 65);

  pdf.setFontSize(9);
  pdf.setTextColor(110, 125, 133);
  pdf.text("Note: Report values are based on the sensor history available to the system.", 15, 218);
  pdf.save(`AQUA-Water-Report-${start}-to-${end}.pdf`);
  closeReport();
});

// Initial display
setMode(true);
updateDashboard(waterLevelPercent, pumpOn);

/*
REAL SENSOR / BACKEND INTEGRATION:
Call updateDashboard(sensorPercent, pumpIsOn) whenever a new reading arrives.
Example:
fetch("/api/water-level")
  .then(response => response.json())
  .then(data => updateDashboard(data.levelPercent, data.pumpOn));

For reliable reports, store timestamped readings in your database and filter
those records by the selected start/end dates. Do not use the demo history
array for production reports. Send pump commands to your backend/API rather
than changing only the browser display.
*/
