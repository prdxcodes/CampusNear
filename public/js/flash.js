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

});document.addEventListener("DOMContentLoaded", function () {

    const flashMessages = document.querySelectorAll(".flash-message");

    if (!flashMessages.length) return;

    flashMessages.forEach((flash) => {

        const closeBtn = flash.querySelector(".flash-close");

        let timer;

        // ==========================================
        // HIDE FLASH
        // ==========================================

        function hideFlash() {

            clearTimeout(timer);

            // Prevent multiple calls
            if (flash.classList.contains("flash-hide")) {
                return;
            }

            // Start exit animation
            flash.classList.add("flash-hide");

            // Remove after animation
            setTimeout(() => {

                if (flash && flash.parentNode) {
                    flash.remove();
                }

            }, 400);

        }


        // ==========================================
        // MANUAL CLOSE
        // ==========================================

        if (closeBtn) {

            closeBtn.addEventListener("click", function (event) {

                event.preventDefault();

                hideFlash();

            });

        }


        // ==========================================
        // AUTO HIDE
        // ==========================================

        timer = setTimeout(() => {

            hideFlash();

        }, 4000);

    });

});