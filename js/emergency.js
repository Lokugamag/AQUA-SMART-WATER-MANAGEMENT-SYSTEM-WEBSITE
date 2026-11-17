// =====================================
// AQUA EMERGENCY MANAGEMENT
// =====================================

// Check login session
if (sessionStorage.getItem("aquaDemoLoggedIn") !== "true") {
    window.location.replace("login.html");
}


// Get HTML elements
const emergencyForm = document.getElementById("emergencyForm");
const emergencyTableBody = document.getElementById("emergencyTableBody");
const emptyMessage = document.getElementById("emptyMessage");
const formMessage = document.getElementById("formMessage");


// Load saved emergency reports
let emergencyReports = [];

try {
    emergencyReports = JSON.parse(
        localStorage.getItem("aquaEmergencyReports") || "[]"
    );

    if (!Array.isArray(emergencyReports)) {
        emergencyReports = [];
    }
} catch (error) {
    emergencyReports = [];
}


// Save reports in browser storage
function saveReports() {
    localStorage.setItem(
        "aquaEmergencyReports",
        JSON.stringify(emergencyReports)
    );
}


// =====================================
// UPDATE SUMMARY CARDS
// =====================================

function updateSummary() {

    const activeReports = emergencyReports.filter(
        report => report.status === "Active"
    );

    const criticalReports = activeReports.filter(
        report => report.priority === "Critical"
    );

    const resolvedReports = emergencyReports.filter(
        report => report.status === "Resolved"
    );

    document.getElementById("activeCount").textContent =
        activeReports.length;

    document.getElementById("criticalCount").textContent =
        criticalReports.length;

    document.getElementById("resolvedCount").textContent =
        resolvedReports.length;

    document.getElementById("totalCount").textContent =
        emergencyReports.length;


    // Update overall status
    const systemStatus = document.getElementById("systemStatus");
    const systemStatusText = document.getElementById("systemStatusText");

    systemStatus.classList.remove("warning", "critical");

    if (criticalReports.length > 0) {

        systemStatus.classList.add("critical");

        systemStatusText.textContent =
            "System Status: Critical";

    } else if (activeReports.length > 0) {

        systemStatus.classList.add("warning");

        systemStatusText.textContent =
            "System Status: Warning";

    } else {

        systemStatusText.textContent =
            "System Status: Normal";
    }
}


// =====================================
// DISPLAY EMERGENCY HISTORY
// =====================================

function renderEmergencyTable() {

    emergencyTableBody.innerHTML = "";

    emptyMessage.style.display =
        emergencyReports.length === 0 ? "block" : "none";

    emergencyReports.forEach((report, index) => {

        const row = document.createElement("tr");

        const priorityClass = {
            Low: "priority-low",
            Medium: "priority-medium",
            High: "priority-high",
            Critical: "priority-critical"
        }[report.priority] || "priority-low";

        const statusClass =
            report.status === "Resolved"
                ? "status-resolved"
                : "status-active";


        const values = [
            index + 1,
            report.dateTime,
            report.type,
            report.location,
            report.priority,
            report.status
        ];

        values.forEach((value, cellIndex) => {

            const cell = document.createElement("td");

            if (cellIndex === 4) {

                const badge = document.createElement("span");

                badge.className = `priority-badge ${priorityClass}`;
                badge.textContent = value;

                cell.appendChild(badge);

            } else if (cellIndex === 5) {

                const badge = document.createElement("span");

                badge.className = `status-badge ${statusClass}`;
                badge.textContent = value;

                cell.appendChild(badge);

            } else {

                cell.textContent = value;
            }

            row.appendChild(cell);
        });


        // Action column
        const actionCell = document.createElement("td");

        if (report.status === "Active") {

            const resolveButton = document.createElement("button");

            resolveButton.type = "button";
            resolveButton.className = "resolve-btn";
            resolveButton.textContent = "Resolve";

            resolveButton.addEventListener("click", function() {
                resolveEmergency(report.id);
            });

            actionCell.appendChild(resolveButton);

        } else {

            const resolvedText = document.createElement("span");

            resolvedText.className = "resolved-text";
            resolvedText.textContent = "Completed";

            actionCell.appendChild(resolvedText);
        }

        row.appendChild(actionCell);

        emergencyTableBody.appendChild(row);

    });

    updateSummary();
}


// =====================================
// SUBMIT EMERGENCY REPORT
// =====================================

emergencyForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const type = document.getElementById("emergencyType").value;
    const priority = document.getElementById("priority").value;
    const location = document.getElementById("location").value.trim();
    const reporter = document.getElementById("reporter").value.trim();
    const description = document.getElementById("description").value.trim();

    const attachment =
        document.getElementById("attachment").files[0];


    if (!type || !priority || !location || !description) {

        showMessage(
            "Please complete all required fields.",
            "error"
        );

        return;
    }


    // Create emergency report
    const now = new Date();

    const report = {

        id: Date.now(),

        type: type,

        priority: priority,

        location: location,

        reporter: reporter || "Dashboard User",

        description: description,

        attachmentName: attachment ? attachment.name : "",

        dateTime: now.toLocaleString(),

        status: "Active"
    };


    // Add report
    emergencyReports.unshift(report);

    saveReports();

    renderEmergencyTable();

    emergencyForm.reset();

    showMessage(
        "Emergency report submitted successfully!",
        "success"
    );

});


// =====================================
// SHOW FORM MESSAGE
// =====================================

function showMessage(message, type) {

    formMessage.textContent = message;

    formMessage.className = "form-message " + type;

}


// =====================================
// RESOLVE EMERGENCY
// =====================================

function resolveEmergency(reportId) {

    const confirmed = confirm(
        "Are you sure you want to mark this emergency as resolved?"
    );

    if (!confirmed) return;

    emergencyReports = emergencyReports.map(report => {

        if (report.id === reportId) {

            return {
                ...report,
                status: "Resolved",
                resolvedAt: new Date().toLocaleString()
            };
        }

        return report;
    });

    saveReports();

    renderEmergencyTable();
}


// =====================================
// CLEAR EMERGENCY HISTORY
// =====================================

document.getElementById("clearHistoryBtn").addEventListener(
    "click",
    function() {

        if (emergencyReports.length === 0) {

            alert("There are no emergency reports to clear.");

            return;
        }

        const confirmed = confirm(
            "Are you sure you want to delete all emergency reports?"
        );

        if (confirmed) {

            emergencyReports = [];

            saveReports();

            renderEmergencyTable();

            showMessage(
                "Emergency history cleared.",
                "success"
            );
        }
    }
);


// =====================================
// INITIALIZE PAGE
// =====================================

renderEmergencyTable();