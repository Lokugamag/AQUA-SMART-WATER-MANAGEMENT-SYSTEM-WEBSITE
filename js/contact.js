
"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("contactForm");

    const message = document.getElementById("formMessage");

    if (!form || !message) {
        return;
    }

    form.addEventListener("submit", event => {

        event.preventDefault();

        if (!form.checkValidity()) {

            form.reportValidity();

            return;

        }

        message.textContent =
            "The form is currently a demonstration and has not sent your enquiry. Please contact AQUA using its verified contact details.";

        message.setAttribute("role", "alert");

    });

});
