
const loginForm = document.getElementById("loginForm");

const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        loginMessage.textContent =
            "Please enter your email and password.";
        return;
    }

    /*
       DEMO LOGIN
       Front-end testing only.
    */

    const ADMIN_EMAIL = "admin@aqua.com";

    // Identify user role
    const role = email.toLowerCase() === ADMIN_EMAIL
        ? "admin"
        : "client";

    // Save login information
    sessionStorage.setItem("aquaDemoLoggedIn", "true");
    sessionStorage.setItem("aquaUserEmail", email);
    sessionStorage.setItem("aquaUserRole", role);

    loginMessage.style.color = "#438a65";
    loginMessage.textContent =
        "Login successful. Opening dashboard...";

    // Redirect to dashboard
    window.location.href = "dashboard.html";

});
