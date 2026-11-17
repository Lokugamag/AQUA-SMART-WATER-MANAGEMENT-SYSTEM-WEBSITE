
const adminLoginForm = document.getElementById("adminLoginForm");

adminLoginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("adminUsername").value.trim();
    const password = document.getElementById("adminPassword").value;
    const error = document.getElementById("adminError");

    // Demo administrator credentials
    const ADMIN_USERNAME = "admin@aqua.com";
    const ADMIN_PASSWORD = "Aqua@123";

    if (
        username.toLowerCase() === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD
    ) {
        // Grant administrator access for this browser session
        sessionStorage.setItem("aquaUserRole", "admin");
        sessionStorage.setItem("aquaAdminVerified", "true");

        window.location.href = "settings.html";
    } else {
        error.textContent = "Invalid admin username or password.";
    }
});
