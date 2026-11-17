
"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const toggle = document.querySelector(".nav-toggle");
    const menu = document.querySelector(".nav-menu");

    if (!toggle || !menu) {
        return;
    }

    function closeMenu() {

        menu.classList.remove("is-open");

        toggle.setAttribute("aria-expanded", "false");

        toggle.setAttribute("aria-label", "Open navigation");
    }


    toggle.addEventListener("click", () => {

        const isOpen =
            toggle.getAttribute("aria-expanded") === "true";

        toggle.setAttribute(
            "aria-expanded",
            String(!isOpen)
        );

        toggle.setAttribute(
            "aria-label",
            isOpen ? "Open navigation" : "Close navigation"
        );

        menu.classList.toggle("is-open", !isOpen);

    });


    // Close menu after selecting a page

    menu.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", closeMenu);

    });


    // Close menu with Escape key

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            closeMenu();

            toggle.focus();

        }

    });


    // Close menu when returning to desktop size

    window.addEventListener("resize", () => {

        if (window.innerWidth > 900) {
            closeMenu();
        }

    });

});
