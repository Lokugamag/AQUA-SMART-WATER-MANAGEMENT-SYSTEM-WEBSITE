
// Check login session
if (sessionStorage.getItem("aquaDemoLoggedIn") !== "true") {
    window.location.replace("login.html");
}

const emailInput = document.getElementById("email");
const nameInput = document.getElementById("fullName");
const usernameInput = document.getElementById("username");
const phoneInput = document.getElementById("phone");

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileAvatar = document.getElementById("profileAvatar");

const accountForm = document.getElementById("accountForm");
const saveMessage = document.getElementById("saveMessage");

// Load saved account information
const savedAccount = JSON.parse(
    localStorage.getItem("aquaAccountDetails") || "{}"
);

emailInput.value = savedAccount.email ||
    sessionStorage.getItem("aquaUserEmail") || "";

nameInput.value = savedAccount.name || "";
usernameInput.value = savedAccount.username || "";
phoneInput.value = savedAccount.phone || "";

function updateProfile() {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    profileName.textContent = name || "User Account";
    profileEmail.textContent = email;
    profileAvatar.textContent =
        (name || email || "U").charAt(0).toUpperCase();
}

updateProfile();

// Save account details
accountForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const accountDetails = {
        name: nameInput.value.trim(),
        username: usernameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim()
    };

    localStorage.setItem(
        "aquaAccountDetails",
        JSON.stringify(accountDetails)
    );

    sessionStorage.setItem("aquaUserEmail", accountDetails.email);

    updateProfile();

    saveMessage.textContent = "Your account details have been saved successfully.";
});

// Change password button
document.getElementById("passwordBtn").addEventListener("click", function() {
    alert("Password changing needs to be connected to your authentication system.");
});
