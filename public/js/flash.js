document.addEventListener("DOMContentLoaded", function () {

    const flash = document.querySelector(".flash-message");

    if (!flash) return;

    const closeBtn = flash.querySelector(".btn-close");

    // Manual close
    if (closeBtn) {
        closeBtn.addEventListener("click", function () {
            hideFlash();
        });
    }

    // Automatically hide after 3 seconds
    const timer = setTimeout(() => {
        hideFlash();
    }, 3000);


    function hideFlash() {

        clearTimeout(timer);

        flash.classList.remove("show");

        setTimeout(() => {
            flash.remove();
        }, 300);

    }

});