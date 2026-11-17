
// AQUA SYSTEM SETTINGS

const settingsForm = document.getElementById("settingsForm");

const settingsMessage =
    document.getElementById("settingsMessage");

const effectiveSettings =
    document.getElementById("effectiveSettings");

const settingsFields = [
    "loginUsername",
    "tankVolume",
    "tankHeight",
    "sensorOffset",
    "pumpOn",
    "pumpOff",
    "pumpTolerance"
];

// Load previously saved settings
function loadSettings() {

    const savedSettings =
        JSON.parse(localStorage.getItem("aquaSystemSettings") || "{}");

    settingsFields.forEach(id => {

        const field = document.getElementById(id);

        if (savedSettings[id] !== undefined) {
            field.value = savedSettings[id];
        }

    });

    updateEffectiveSettings();
}

// Update pump configuration preview
function updateEffectiveSettings() {

    const on = Number(
        document.getElementById("pumpOn").value
    );

    const off = Number(
        document.getElementById("pumpOff").value
    );

    const tolerance = Number(
        document.getElementById("pumpTolerance").value
    );

    effectiveSettings.textContent =
        `Effective: ON ≤ ${on}% · OFF ≥ ${off}% (tol ${tolerance})`;
}

// Save settings
settingsForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const settings = {};

    settingsFields.forEach(id => {

        settings[id] =
            document.getElementById(id).value;

    });

    const tankHeight = Number(settings.tankHeight);
    const offset = Number(settings.sensorOffset);
    const pumpOn = Number(settings.pumpOn);
    const pumpOff = Number(settings.pumpOff);
    const tolerance = Number(settings.pumpTolerance);

    if (tankHeight <= 0 || offset >= tankHeight) {
        settingsMessage.style.color = "#d9534f";
        settingsMessage.textContent =
            "Please check tank height and sensor offset.";
        return;
    }

    if (pumpOn < 0 || pumpOn > 100 ||
        pumpOff < 0 || pumpOff > 100 ||
        pumpOn >= pumpOff ||
        pumpOff - pumpOn < tolerance) {

        settingsMessage.style.color = "#d9534f";
        settingsMessage.textContent =
            "Please check pump ON, OFF and tolerance values.";
        return;
    }

    // DEMO STORAGE ONLY
    // Replace with secure backend API when available.

    localStorage.setItem(
        "aquaSystemSettings",
        JSON.stringify(settings)
    );

    settingsMessage.style.color = "#438a65";

    settingsMessage.textContent =
        "Settings saved successfully!";

    updateEffectiveSettings();

});

// Update preview when values change
["pumpOn", "pumpOff", "pumpTolerance"].forEach(id => {

    document.getElementById(id).addEventListener(
        "input",
        updateEffectiveSettings
    );

});

const userRole = sessionStorage.getItem("aquaUserRole");
const adminVerified = sessionStorage.getItem("aquaAdminVerified");

if (userRole !== "admin" || adminVerified !== "true") {
    alert("Access denied. Administrator account required.");
    window.location.href = "admin-login.html";
}