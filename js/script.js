

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const year = String(new Date().getFullYear());

    const yearElements =
        document.querySelectorAll("[data-current-year]");

    yearElements.forEach(element => {

        element.textContent = year;

    });

});
