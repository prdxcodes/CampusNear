document.addEventListener("DOMContentLoaded", function () {

    const menuBtn = document.querySelector(".mobile-menu-btn");
    const navbarLinks = document.querySelector(".navbar-links");

    if (!menuBtn || !navbarLinks) return;

    menuBtn.addEventListener("click", function () {

        navbarLinks.classList.toggle("active");

    });

});